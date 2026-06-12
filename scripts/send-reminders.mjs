// Daily prediction-reminder emails.
//
// Finds, per user and per group, matches kicking off in the next 3 days that
// the user has not predicted yet, and sends one summary email per user via
// Gmail SMTP. Run from .github/workflows/daily-reminders.yml every morning.
//
// Env:
//   SMTP_USER  Gmail address to send from
//   SMTP_PASS  Gmail App Password
//   DRY_RUN=1  print the emails instead of sending

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const FIREBASE_API_KEY = 'AIzaSyAyOY_It3oq3Q4ferO_zE23sFLJ_bUZB9g';
const DB_URL = 'https://mondial2026-a77fc-default-rtdb.firebaseio.com';
const ROOT = 'worldcup2026';
const SITE_URL = 'https://mondial.guru';

const DRY_RUN = !!process.env.DRY_RUN;
const WINDOW_HOURS = 72;

// Same semantics as parseMatchDate() in app.js: naive date string is Israeli time.
function parseMatchDate(dateStr) {
    return Date.parse(`${dateStr}:00+03:00`);
}

// Bets lock 5 minutes before kickoff (matchIsLocked in app.js).
const LOCK_MS = 5 * 60 * 1000;

async function firebaseSignIn() {
    const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"returnSecureToken":true}' },
    );
    if (!res.ok) throw new Error(`Firebase anonymous sign-in failed: ${res.status} ${await res.text()}`);
    return (await res.json()).idToken;
}

async function fbGet(path, token) {
    const res = await fetch(`${DB_URL}/${ROOT}/${path}.json?auth=${token}`);
    if (!res.ok) throw new Error(`Firebase GET ${path} failed: ${res.status} ${await res.text()}`);
    return res.json();
}

function fmtMatchDate(dateStr) {
    // dateStr is naive Israel time "2026-06-13T22:00" — format directly.
    const [d, t] = dateStr.split('T');
    const [, m, day] = d.split('-');
    return `${parseInt(day, 10)}.${parseInt(m, 10)} בשעה ${t}`;
}

// DB values (names, teams) are writable by any authenticated client — escape
// everything interpolated into the email HTML.
const esc = s => String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function buildEmail(name, groupsMissing) {
    const sections = groupsMissing.map(({ groupName, matches }) => `
        <h3 style="margin:16px 0 6px;color:#1a4731;">${esc(groupName)}</h3>
        <ul style="margin:0;padding-inline-start:20px;">
            ${matches.map(m => `<li style="margin:4px 0;">${esc(m.team1)} נגד ${esc(m.team2)} — ${esc(fmtMatchDate(m.date))}</li>`).join('')}
        </ul>`).join('');

    return `<!DOCTYPE html>
<html dir="rtl" lang="he"><body style="font-family:Arial,Helvetica,sans-serif;direction:rtl;text-align:right;color:#222;">
    <h2 style="color:#1a4731;">⚽ היי ${esc(name)}, יש לך ניחושים פתוחים!</h2>
    <p>המשחקים הבאים נסגרים בקרוב ועוד לא ניחשת את התוצאה:</p>
    ${sections}
    <p style="margin-top:20px;">
        <a href="${SITE_URL}" style="background:#1a4731;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">למילוי הניחושים ⚽</a>
    </p>
    <p style="color:#888;font-size:12px;margin-top:24px;">נשלח אוטומטית ממונדיאל 2026 — הניחושים נסגרים 5 דקות לפני כל משחק.</p>
</body></html>`;
}

async function main() {
    const token = await firebaseSignIn();
    const [matches, groups, bets, users] = await Promise.all([
        fbGet('matches', token), fbGet('groups', token), fbGet('bets', token), fbGet('users', token),
    ]);

    const now = Date.now();
    const windowEnd = now + WINDOW_HOURS * 3600 * 1000;
    const upcoming = Object.entries(matches || {})
        .filter(([, m]) => {
            if (!m || !m.date || (m.result && m.result.team1Goals !== undefined)) return false;
            const ko = parseMatchDate(m.date);
            return ko - LOCK_MS > now && ko <= windowEnd;
        })
        .sort((a, b) => parseMatchDate(a[1].date) - parseMatchDate(b[1].date));

    if (upcoming.length === 0) {
        console.log('No open matches in the next 3 days, nothing to remind.');
        return;
    }
    console.log(`${upcoming.length} open match(es) in the next ${WINDOW_HOURS}h.`);

    // userId -> { name, email, groups: [{groupName, matches: [...]}] }
    const reminders = new Map();
    for (const [groupId, g] of Object.entries(groups || {})) {
        const members = (g && g.members) || {};
        for (const userId of Object.keys(members)) {
            const userBets = (((bets || {})[groupId]) || {})[userId] || {};
            const missing = upcoming
                .filter(([matchId]) => {
                    const b = userBets[matchId];
                    return !b || b.placedAt === 0; // no bet, or recalc auto-fill
                })
                .map(([, m]) => m);
            if (missing.length === 0) continue;

            const u = (users || {})[userId] || {};
            const email = u.email;
            if (!email || !email.includes('@')) {
                console.warn(`SKIP ${userId}: no valid email on users node.`);
                continue;
            }
            if (!reminders.has(userId)) {
                reminders.set(userId, { name: u.name || members[userId].name || '', email, groups: [] });
            }
            reminders.get(userId).groups.push({ groupName: g.name || '', matches: missing });
        }
    }

    console.log(`${reminders.size} user(s) with missing predictions.`);
    if (reminders.size === 0) return;

    if (DRY_RUN) {
        for (const [userId, r] of reminders) {
            const total = r.groups.reduce((s, g) => s + g.matches.length, 0);
            console.log(`DRY RUN → ${r.email} (${r.name}): ${total} missing across ${r.groups.length} group(s)`);
        }
        const [, sample] = reminders.entries().next().value;
        console.log('\n--- sample email body ---\n' + buildEmail(sample.name, sample.groups));
        return;
    }

    const { SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_USER || !SMTP_PASS) {
        console.warn('SMTP_USER / SMTP_PASS not configured — emails NOT sent. Set the repo secrets to enable sending.');
        return;
    }

    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    let sent = 0, failed = 0;
    for (const [userId, r] of reminders) {
        try {
            await transport.sendMail({
                from: `"מונדיאל 2026 ⚽" <${SMTP_USER}>`,
                to: r.email,
                subject: '⚽ תזכורת: יש לך ניחושים פתוחים למשחקים הקרובים',
                html: buildEmail(r.name, r.groups),
            });
            sent++;
            console.log(`SENT → ${r.email}`);
        } catch (err) {
            failed++;
            console.error(`FAILED → ${r.email}: ${err.message}`);
        }
    }
    console.log(`Done: ${sent} sent, ${failed} failed.`);
    if (failed > 0 && sent === 0) process.exit(1);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
