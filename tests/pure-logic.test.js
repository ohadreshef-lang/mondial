// Tests for pure-logic helpers in app.js.
//
// app.js is a classic-script browser file (no exports), so we load it into a
// vm sandbox with stubs for the browser/Firebase globals it touches at the
// top level. The functions we exercise don't need the DOM or the database —
// only scoring, id-hashing, date parsing, and string helpers.
//
// Run:  node --test tests/

const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const appSource = readFileSync(join(__dirname, '..', 'app.js'), 'utf8');

function loadApp() {
    const sandbox = {
        document: {
            addEventListener: () => {},
            querySelectorAll: () => [],
            getElementById: () => null,
        },
        setInterval: () => 0,
        clearInterval: () => {},
        window: { location: { search: '', pathname: '/' } },
        localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
        firebase: undefined,
        db: null,
        t: (key) => key,
        translateTeam: (name) => name,
        currentLang: 'he',
        console,
        URLSearchParams,
        Date,
        Math,
        Object,
        Array,
        JSON,
        String,
        Number,
        Boolean,
        RegExp,
        Promise,
        Error,
        isNaN,
        parseInt,
        parseFloat,
    };
    vm.createContext(sandbox);
    vm.runInContext(appSource, sandbox);
    return sandbox;
}

const app = loadApp();

// --- getOutcome ------------------------------------------------------------

test('getOutcome: team1 wins', () => {
    assert.equal(app.getOutcome(3, 1), 'win1');
    assert.equal(app.getOutcome(1, 0), 'win1');
});

test('getOutcome: team2 wins', () => {
    assert.equal(app.getOutcome(0, 2), 'win2');
    assert.equal(app.getOutcome(1, 5), 'win2');
});

test('getOutcome: draw', () => {
    assert.equal(app.getOutcome(0, 0), 'draw');
    assert.equal(app.getOutcome(2, 2), 'draw');
});

// --- calcPoints ------------------------------------------------------------

test('calcPoints: exact score returns 4', () => {
    assert.equal(app.calcPoints(2, 1, 2, 1), 4);
    assert.equal(app.calcPoints(0, 0, 0, 0), 4);
    assert.equal(app.calcPoints(1, 3, 1, 3), 4);
});

test('calcPoints: correct outcome but wrong score returns 1', () => {
    assert.equal(app.calcPoints(2, 1, 3, 0), 1);   // both win1
    assert.equal(app.calcPoints(0, 2, 1, 4), 1);   // both win2
    assert.equal(app.calcPoints(1, 1, 2, 2), 1);   // both draw
});

test('calcPoints: wrong outcome returns 0', () => {
    assert.equal(app.calcPoints(2, 1, 1, 2), 0);   // predicted win1, got win2
    assert.equal(app.calcPoints(0, 0, 1, 0), 0);   // predicted draw, got win1
    assert.equal(app.calcPoints(0, 3, 1, 1), 0);   // predicted win2, got draw
});

// --- emailToId -------------------------------------------------------------

test('emailToId: lowercases and replaces dot', () => {
    assert.equal(app.emailToId('Foo@Bar.COM'), 'foo@bar_com');
});

test('emailToId: replaces all Firebase-reserved chars', () => {
    // `.` `#` `$` `[` `]` `/` are all illegal in RTDB keys
    assert.equal(app.emailToId('a.b#c$d[e]f/g@x.y'), 'a_b_c_d_e_f_g@x_y');
});

test('emailToId: stable for already-clean emails', () => {
    assert.equal(app.emailToId('plain@example_com'), 'plain@example_com');
});

test('emailToId matches real prod IDs', () => {
    // Confirms round-trip with the format used in the live DB.
    assert.equal(app.emailToId('shay.t@helloflare.com'), 'shay_t@helloflare_com');
    assert.equal(app.emailToId('ohad.reshef@gmail.com'), 'ohad_reshef@gmail_com');
});

// --- parseMatchDate (Israeli-time gotcha) ---------------------------------

test('parseMatchDate: treats naive string as UTC', () => {
    // "2026-06-11T19:00" parsed as UTC == "2026-06-11T19:00:00Z"
    const d = app.parseMatchDate('2026-06-11T19:00');
    assert.equal(d.toISOString(), '2026-06-11T19:00:00.000Z');
});

test('parseMatchDate: empty string returns epoch', () => {
    assert.equal(app.parseMatchDate('').getTime(), 0);
    assert.equal(app.parseMatchDate(null).getTime(), 0);
    assert.equal(app.parseMatchDate(undefined).getTime(), 0);
});

test('parseMatchDate: does NOT drift with host timezone', () => {
    const d = app.parseMatchDate('2026-06-11T19:00');
    assert.equal(d.getUTCHours(), 19, 'naive string is UTC');
});

// --- matchIsLocked ---------------------------------------------------------

test('matchIsLocked: match starting in 2 hours is not locked', () => {
    const in2hours = new Date(Date.now() + 2*60*60*1000).toISOString().slice(0,16);
    assert.equal(app.matchIsLocked({ date: in2hours }), false);
});

test('matchIsLocked: match starting in 30 minutes is NOT locked (5-min lock)', () => {
    const in30 = new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16);
    assert.equal(app.matchIsLocked({ date: in30 }), false);
});

test('matchIsLocked: match starting in 2 minutes IS locked (5-min lock)', () => {
    const in2 = new Date(Date.now() + 2 * 60 * 1000).toISOString().slice(0, 16);
    assert.equal(app.matchIsLocked({ date: in2 }), true);
});

test('matchIsLocked: past match is locked', () => {
    assert.equal(app.matchIsLocked({ date: '2020-01-01T12:00' }), true);
});

// --- generateInviteCode ----------------------------------------------------

test('generateInviteCode: 6 chars long', () => {
    for (let i = 0; i < 50; i++) {
        assert.equal(app.generateInviteCode().length, 6);
    }
});

test('generateInviteCode: uses only the safe alphabet (no 0/O/1/I/L)', () => {
    const safe = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;
    for (let i = 0; i < 200; i++) {
        const code = app.generateInviteCode();
        assert.match(code, safe, `invalid char in ${code}`);
    }
});

// --- escapeHtml ------------------------------------------------------------

test('escapeHtml: escapes angle brackets and quotes', () => {
    assert.equal(
        app.escapeHtml('<script>alert("x")</script>'),
        '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    );
});

test('escapeHtml: escapes ampersand first to avoid double-escaping', () => {
    assert.equal(app.escapeHtml('Tom & Jerry'), 'Tom &amp; Jerry');
    assert.equal(app.escapeHtml('&lt;'), '&amp;lt;');
});

test('escapeHtml: falsy input returns empty string', () => {
    assert.equal(app.escapeHtml(''), '');
    assert.equal(app.escapeHtml(null), '');
    assert.equal(app.escapeHtml(undefined), '');
});

// --- getFlag ---------------------------------------------------------------

test('getFlag: returns mapped flag for known team', () => {
    assert.equal(app.getFlag('ברזיל'), '🇧🇷');
    assert.equal(app.getFlag('ארגנטינה'), '🇦🇷');
    assert.equal(app.getFlag("צ'כיה"), '🇨🇿');
});

test('getFlag: falls back to white flag for unknown team', () => {
    assert.equal(app.getFlag('Atlantis'), '🏳️');
    assert.equal(app.getFlag(''), '🏳️');
});

// --- Participating-teams sanity -------------------------------------------
// Note: PARTICIPATING_TEAMS and TEAM_FLAGS are `const` and don't leak onto
// the vm sandbox, so we probe them via the exposed helpers instead.

test('getSortedParticipatingTeams: returns all 48 WC 2026 teams', () => {
    assert.equal(app.getSortedParticipatingTeams().length, 48);
});

test('every participating team has a flag (not the fallback)', () => {
    const teams = app.getSortedParticipatingTeams();
    const missing = teams.filter(name => app.getFlag(name) === '🏳️');
    // Cross-realm arrays fail deepStrictEqual even when empty, so use length.
    assert.equal(missing.length, 0, `teams without flags: ${missing.join(', ')}`);
});
