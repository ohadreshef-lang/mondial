// Automatic match-result updater.
//
// Fetches finished World Cup matches from football-data.org and writes the
// scores into Firebase exactly like the admin "save result" flow does
// (result + status, then per-bet points and member totals).
//
// Runs from .github/workflows/update-results.yml on a 30-minute cron.
//
// Finished results + points come from football-data.org. Live in-play scores come
// from API-Football (api-sports.io) — football-data.org's free tier never emits
// IN_PLAY. The live layer is best-effort: if FOOTBALL_API_KEY is unset or the call
// fails, finals/points still work and the Live tab simply shows no live score.
//
// Env:
//   FOOTBALL_DATA_TOKEN  (required) football-data.org API token — finals + points
//   FOOTBALL_API_KEY     (optional) API-Football (api-sports.io) key — live scores
//   DRY_RUN=1            print planned writes without touching Firebase

import { classifyMatches, buildResultUpdates, mapApiFootballLive, parseMatchDate } from './lib/results-core.mjs';

const FIREBASE_API_KEY = 'AIzaSyAyOY_It3oq3Q4ferO_zE23sFLJ_bUZB9g';
const DB_URL = 'https://mondial2026-a77fc-default-rtdb.firebaseio.com';
const ROOT = 'worldcup2026';

const FD_TOKEN = process.env.FOOTBALL_DATA_TOKEN;
const AF_KEY = process.env.FOOTBALL_API_KEY;
const DRY_RUN = !!process.env.DRY_RUN;

// Tournament window: June 11 – July 19, 2026 (with margin). Outside it the
// cron exits immediately without spending API calls.
const WINDOW_START = Date.parse('2026-06-08T00:00:00Z');
const WINDOW_END = Date.parse('2026-07-22T00:00:00Z');

// Past this long after kickoff a game is certainly over and the API has had ample
// time to publish the FINISHED result. A candidate still unmatched at this point is
// an anomaly (bad team-name mapping or wrong fixture date), not "not finished yet" —
// the run fails (red) so it's visible instead of silently passing. Self-clears once
// the result is auto-matched or entered manually (then it's no longer a candidate).
const STALE_MINUTES = 180;

// In-run retry with exponential backoff. A transient blip (network/DNS error, 429
// rate-limit, or 5xx) self-heals within the run instead of failing it — and flipping
// the Action red — until the next 30-min cron. Other 4xx (bad token/request) are
// fatal and fail fast. Every caller is idempotent (reads, and a multi-path PATCH that
// writes the same values), so re-attempts are safe.
const RETRY_ATTEMPTS = 4;
const RETRY_BASE_MS = 1000;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function retryFetch(label, url, options) {
    let lastErr;
    for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
        try {
            const res = await fetch(url, options);
            if (res.ok) return res;
            const err = new Error(`${label} failed: ${res.status} ${await res.text()}`);
            if (res.status !== 429 && res.status < 500) { err.fatal = true; throw err; } // fatal 4xx — don't retry
            lastErr = err;
        } catch (err) {
            // Network/DNS errors are retryable; rethrow the fatal-4xx we just threw.
            if (err.fatal) throw err;
            lastErr = err;
        }
        if (attempt < RETRY_ATTEMPTS) {
            const delay = RETRY_BASE_MS * 2 ** (attempt - 1);
            console.warn(`${label} attempt ${attempt}/${RETRY_ATTEMPTS} failed: ${lastErr.message} — retrying in ${delay}ms`);
            await sleep(delay);
        }
    }
    throw new Error(`${label} failed after ${RETRY_ATTEMPTS} attempts: ${lastErr.message}`);
}

async function firebaseSignIn() {
    const res = await retryFetch(
        'Firebase anonymous sign-in',
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"returnSecureToken":true}' },
    );
    return (await res.json()).idToken;
}

async function fbGet(path, token) {
    const res = await retryFetch(`Firebase GET ${path}`, `${DB_URL}/${ROOT}/${path}.json?auth=${token}`);
    return res.json();
}

async function fbPatch(updates, token) {
    await retryFetch('Firebase PATCH', `${DB_URL}/${ROOT}/.json?auth=${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
}

async function fetchApiMatches(dateFrom, dateTo) {
    // Do NOT add status=FINISHED to the query: combining it with a date range makes
    // football-data.org intermittently omit genuinely-finished fixtures (observed:
    // Ghana–Panama 2026-06-17 stayed absent from the filtered view for 13+ hours while
    // its neighbours returned). Fetching the range unfiltered returns every match
    // (FINISHED, IN_PLAY, PAUSED, SCHEDULED, etc.) so classifyMatches sees all statuses.
    const url = `https://api.football-data.org/v4/competitions/WC/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const res = await retryFetch('football-data.org request', url, { headers: { 'X-Auth-Token': FD_TOKEN } });
    return (await res.json()).matches || [];
}

// API-Football: all currently in-play fixtures (one call covers every live game).
// We filter to our matches by team pair in mapApiFootballLive(). Returns [] on any
// error so the live layer can never break the (authoritative) finals/points flow.
async function fetchApiFootballLive() {
    // Best-effort, single attempt (no retry loop). If the daily quota is reached the
    // API returns HTTP 429 or a 200 with an `errors.requests` message — either way we
    // just skip live for this run: finals + points (football-data.org) are unaffected,
    // and live scores resume automatically when the quota resets at 00:00 UTC. No
    // backoff retries — a 429 persists all day, and the next cron re-checks in minutes.
    try {
        const res = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
            headers: { 'x-apisports-key': AF_KEY },
        });
        if (!res.ok) {
            console.warn(`API-Football live unavailable (HTTP ${res.status}${res.status === 429 ? ' — daily limit/rate reached' : ''}) — skipping live scores this run.`);
            return [];
        }
        const json = await res.json();
        const errs = json.errors;
        if (errs && ((Array.isArray(errs) && errs.length) || (typeof errs === 'object' && Object.keys(errs).length))) {
            console.warn('API-Football limit/error — skipping live scores this run:', JSON.stringify(errs));
            return [];
        }
        return json.response || [];
    } catch (err) {
        console.warn('API-Football live fetch failed (live scores skipped this run):', err.message);
        return [];
    }
}

function utcDay(ms) {
    return new Date(ms).toISOString().slice(0, 10);
}

async function main() {
    if (!FD_TOKEN) throw new Error('FOOTBALL_DATA_TOKEN is not set');

    const now = Date.now();
    if (now < WINDOW_START || now > WINDOW_END) {
        console.log('Outside tournament window, nothing to do.');
        return;
    }

    const token = await firebaseSignIn();
    const matches = (await fbGet('matches', token)) || {};

    const candidates = Object.entries(matches).filter(([, m]) => {
        if (!m || !m.team1 || !m.team2 || !m.date) return false;
        if (m.result && m.result.team1Goals !== undefined) return false;
        return parseMatchDate(m.date) <= now;            // any started, unfinished game
    });
    if (candidates.length === 0) { console.log('No started, unfinished matches. Nothing to do.'); return; }

    const dateFrom = utcDay(WINDOW_START);
    const dateTo = utcDay(WINDOW_END);
    const apiMatches = await fetchApiMatches(dateFrom, dateTo);
    console.log(`API returned ${apiMatches.length} match(es) (all statuses) between ${dateFrom} and ${dateTo}.`);

    // football-data.org is authoritative for FINISHED results (+ points). Its free
    // tier never reports IN_PLAY, so we ignore its `live` and source live scores
    // from API-Football instead.
    const { finished, staleUnmatched } = classifyMatches({
        matches, apiMatches, now, staleMinutes: STALE_MINUTES, inPlayWindowMs: 3 * 3600 * 1000,
    });

    // Live in-play scores from API-Football (best-effort). One call covers all live
    // games; only spent when a started-unfinished match exists (i.e. a live window).
    let live = [];
    if (AF_KEY) {
        const apiFixtures = await fetchApiFootballLive();
        live = mapApiFootballLive({ matches, apiFixtures, now, inPlayWindowMs: 3 * 3600 * 1000 });
    } else {
        console.warn('FOOTBALL_API_KEY not set — skipping live scores.');
    }
    console.log(`Classified: ${finished.length} finished, ${live.length} live.`);

    let groups = {}, bets = {}, specialBets = {};
    if (finished.some(f => !f.m.noPoints)) {
        [groups, bets, specialBets] = await Promise.all([
            fbGet('groups', token), fbGet('bets', token), fbGet('specialBets', token),
        ]);
    }
    const updates = buildResultUpdates({ finished, live, groups: groups || {}, bets: bets || {}, specialBets: specialBets || {}, now });

    if (Object.keys(updates).length === 0) { console.log('Nothing to write.'); reportStale(staleUnmatched); return; }
    if (DRY_RUN) { console.log(`DRY RUN — ${Object.keys(updates).length} path(s):\n${JSON.stringify(updates, null, 2)}`); reportStale(staleUnmatched); return; }
    await fbPatch(updates, token);
    console.log(`Wrote ${Object.keys(updates).length} path(s) (${finished.length} finished, ${live.length} live).`);
    reportStale(staleUnmatched);
}

// Throws (fails the run) when matches are well past kickoff with no usable auto result.
function reportStale(staleUnmatched) {
    if (staleUnmatched.length === 0) return;
    throw new Error(
        `${staleUnmatched.length} match(es) past kickoff with no automatic result — ` +
        `enter the result in the admin panel, or fix the team-name/date mapping:\n  ` +
        staleUnmatched.join('\n  '),
    );
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
