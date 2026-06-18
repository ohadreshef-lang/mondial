// Automatic match-result updater.
//
// Fetches finished World Cup matches from football-data.org and writes the
// scores into Firebase exactly like the admin "save result" flow does
// (result + status, then per-bet points and member totals).
//
// Runs from .github/workflows/update-results.yml on a 30-minute cron.
//
// Env:
//   FOOTBALL_DATA_TOKEN  (required) football-data.org API token
//   DRY_RUN=1            print planned writes without touching Firebase
//   INCLUDE_COMPLETED=1  testing aid: also process already-completed matches
//                        (combine with DRY_RUN to verify scoring against
//                        results that were entered manually)

const FIREBASE_API_KEY = 'AIzaSyAyOY_It3oq3Q4ferO_zE23sFLJ_bUZB9g';
const DB_URL = 'https://mondial2026-a77fc-default-rtdb.firebaseio.com';
const ROOT = 'worldcup2026';

const FD_TOKEN = process.env.FOOTBALL_DATA_TOKEN;
const DRY_RUN = !!process.env.DRY_RUN;
const INCLUDE_COMPLETED = !!process.env.INCLUDE_COMPLETED;

// Tournament window: June 11 – July 19, 2026 (with margin). Outside it the
// cron exits immediately without spending API calls.
const WINDOW_START = Date.parse('2026-06-08T00:00:00Z');
const WINDOW_END = Date.parse('2026-07-22T00:00:00Z');

// A match becomes a candidate this long after kickoff. Games run ~105 min +
// stoppage; the API's FINISHED status is the real gate, this only avoids
// pointless API calls.
const MIN_MINUTES_AFTER_KICKOFF = 100;

// Past this long after kickoff a game is certainly over and the API has had ample
// time to publish the FINISHED result. A candidate still unmatched at this point is
// an anomaly (bad team-name mapping or wrong fixture date), not "not finished yet" —
// the run fails (red) so it's visible instead of silently passing. Self-clears once
// the result is auto-matched or entered manually (then it's no longer a candidate).
const STALE_MINUTES = 180;

// Hebrew (canonical DB form) -> English. Copy of TEAM_TRANSLATIONS.en in i18n.js.
const HEB_TO_EN = {
    'ארצות הברית': 'USA', 'קנדה': 'Canada', 'מקסיקו': 'Mexico',
    'ברזיל': 'Brazil', 'ארגנטינה': 'Argentina', 'אורוגוואי': 'Uruguay',
    'קולומביה': 'Colombia', 'אקוודור': 'Ecuador', 'ונצואלה': 'Venezuela',
    'פרגוואי': 'Paraguay', 'בוליביה': 'Bolivia', "צ'ילה": 'Chile',
    'צרפת': 'France', 'ספרד': 'Spain', 'גרמניה': 'Germany',
    'אנגליה': 'England', 'פורטוגל': 'Portugal', 'הולנד': 'Netherlands',
    'איטליה': 'Italy', 'בלגיה': 'Belgium', 'שווייץ': 'Switzerland',
    'קרואטיה': 'Croatia', 'סרביה': 'Serbia', 'דנמרק': 'Denmark',
    'אוסטריה': 'Austria', 'סקוטלנד': 'Scotland', 'טורקיה': 'Turkey',
    'רומניה': 'Romania', 'הונגריה': 'Hungary', 'פולין': 'Poland',
    'מרוקו': 'Morocco', 'סנגל': 'Senegal', 'ניגריה': 'Nigeria',
    'מצרים': 'Egypt', 'קמרון': 'Cameroon', 'חוף השנהב': 'Ivory Coast',
    "אלג'יריה": 'Algeria', 'תוניסיה': 'Tunisia', 'דרום אפריקה': 'South Africa',
    'יפן': 'Japan', 'קוריאה הדרומית': 'South Korea', 'איראן': 'Iran',
    'ערב הסעודית': 'Saudi Arabia', 'אוסטרליה': 'Australia', 'עיראק': 'Iraq',
    'ירדן': 'Jordan', 'אוזבקיסטן': 'Uzbekistan', 'ניו זילנד': 'New Zealand',
    'הונדורס': 'Honduras', 'פנמה': 'Panama', 'קוסטה ריקה': 'Costa Rica',
    "צ'כיה": 'Czechia', 'קטאר': 'Qatar', 'בוסניה והרצגובינה': 'Bosnia and Herzegovina',
    'האיטי': 'Haiti', 'קוראסאו': 'Curaçao', 'שוודיה': 'Sweden',
    'קאבו ורדה': 'Cape Verde', 'נורווגיה': 'Norway', 'קונגו DR': 'DR Congo', 'גאנה': 'Ghana',
};

// football-data.org names that differ from TEAM_TRANSLATIONS.en (normalized form).
const API_ALIASES = {
    'bosnia-herzegovina': 'bosnia and herzegovina',
    'cape verde islands': 'cape verde',
    'congo dr': 'dr congo',
    'united states': 'usa',
};

function norm(name) {
    const n = (name || '')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().replace(/\s+/g, ' ').trim();
    return API_ALIASES[n] || n;
}

// Same semantics as parseMatchDate() in app.js: naive date string is Israeli time.
function parseMatchDate(dateStr) {
    return Date.parse(`${dateStr}:00+03:00`);
}

// Copy of calcPoints() in app.js: exact score 4, correct outcome 1, else 0.
function getOutcome(g1, g2) {
    return g1 > g2 ? 'win1' : g1 < g2 ? 'win2' : 'draw';
}
function calcPoints(b1, b2, r1, r2) {
    if (b1 === r1 && b2 === r2) return 4;
    if (getOutcome(b1, b2) === getOutcome(r1, r2)) return 1;
    return 0;
}

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

async function fbPatch(updates, token) {
    const res = await fetch(`${DB_URL}/${ROOT}/.json?auth=${token}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error(`Firebase PATCH failed: ${res.status} ${await res.text()}`);
}

async function fetchFinishedApiMatches(dateFrom, dateTo) {
    const url = `https://api.football-data.org/v4/competitions/WC/matches?status=FINISHED&dateFrom=${dateFrom}&dateTo=${dateTo}`;
    const res = await fetch(url, { headers: { 'X-Auth-Token': FD_TOKEN } });
    if (!res.ok) throw new Error(`football-data.org request failed: ${res.status} ${await res.text()}`);
    return (await res.json()).matches || [];
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
        const done = m.result && m.result.team1Goals !== undefined;
        if (done && !INCLUDE_COMPLETED) return false;
        return parseMatchDate(m.date) <= now - MIN_MINUTES_AFTER_KICKOFF * 60 * 1000;
    });

    if (candidates.length === 0) {
        console.log('No pending matches past kickoff, nothing to do.');
        return;
    }
    console.log(`${candidates.length} candidate match(es) to check.`);

    const kickoffs = candidates.map(([, m]) => parseMatchDate(m.date));
    const dateFrom = utcDay(Math.min(...kickoffs) - 36 * 3600 * 1000);
    const dateTo = utcDay(Math.max(...kickoffs) + 36 * 3600 * 1000);
    const apiMatches = await fetchFinishedApiMatches(dateFrom, dateTo);
    console.log(`API returned ${apiMatches.length} finished match(es) between ${dateFrom} and ${dateTo}.`);

    // Match each candidate to an API fixture by team pair + ±36h date window.
    const finished = [];
    const staleUnmatched = []; // past STALE_MINUTES but no usable API result -> fail the run
    for (const [matchId, m] of candidates) {
        const kickoff = parseMatchDate(m.date);
        const minsSince = (now - kickoff) / 60000;
        const isStale = minsSince >= STALE_MINUTES;

        const en1 = HEB_TO_EN[m.team1];
        const en2 = HEB_TO_EN[m.team2];
        if (!en1 || !en2) {
            console.warn(`SKIP ${matchId}: no English mapping for "${m.team1}" / "${m.team2}" — enter result manually.`);
            if (isStale) staleUnmatched.push(`${matchId} — no English mapping for "${m.team1}"/"${m.team2}"`);
            continue;
        }
        const t1 = norm(en1), t2 = norm(en2);

        const hits = apiMatches.filter(am => {
            const home = norm(am.homeTeam && am.homeTeam.name);
            const away = norm(am.awayTeam && am.awayTeam.name);
            const sameTeams = (home === t1 && away === t2) || (home === t2 && away === t1);
            if (!sameTeams) return false;
            return Math.abs(Date.parse(am.utcDate) - kickoff) <= 36 * 3600 * 1000;
        });

        if (hits.length === 0) {
            // Normally just "not finished yet" — retry next run, no noise. But once a
            // game is well past kickoff this is an anomaly (team-name mismatch or wrong
            // fixture date): log the nearby API fixtures and flag the run red.
            if (isStale) {
                const related = apiMatches
                    .filter(am => {
                        const h = norm(am.homeTeam && am.homeTeam.name);
                        const a = norm(am.awayTeam && am.awayTeam.name);
                        return h === t1 || a === t1 || h === t2 || a === t2;
                    })
                    .map(am => `"${am.homeTeam && am.homeTeam.name}" vs "${am.awayTeam && am.awayTeam.name}" @ ${am.utcDate} [${am.status}]`);
                console.error(`NO MATCH ${matchId}: "${en1}" vs "${en2}" near ${m.date} — no API fixture ${Math.round(minsSince)} min after kickoff.`);
                console.error(`   API fixtures sharing a team: ${related.length ? related.join('; ') : '(none)'}`);
                // TEMP DIAGNOSTIC — remove before merge.
                console.error(`   [diag] all ${apiMatches.length} fetched FINISHED fixtures: ${apiMatches.map(am => `"${am.homeTeam && am.homeTeam.name}" v "${am.awayTeam && am.awayTeam.name}" @ ${am.utcDate}`).join('; ')}`);
                try {
                    const wideRes = await fetch(`https://api.football-data.org/v4/competitions/WC/matches?dateFrom=2026-06-08&dateTo=2026-07-22`, { headers: { 'X-Auth-Token': FD_TOKEN } });
                    const wide = (await wideRes.json()).matches || [];
                    const teamHits = wide.filter(am => {
                        const h = (am.homeTeam && am.homeTeam.name || '').toLowerCase();
                        const a = (am.awayTeam && am.awayTeam.name || '').toLowerCase();
                        return h.includes('ghana') || a.includes('ghana') || h.includes('panama') || a.includes('panama');
                    });
                    console.error(`   [diag] tournament-wide ${wide.length} fixtures; ghana/panama substr matches: ${teamHits.length ? teamHits.map(am => `"${am.homeTeam && am.homeTeam.name}" v "${am.awayTeam && am.awayTeam.name}" @ ${am.utcDate} [${am.status}]`).join('; ') : '(NONE — teams absent from API/free-tier)'}`);
                } catch (e) {
                    console.error(`   [diag] wide query failed: ${e.message}`);
                }
                staleUnmatched.push(`${matchId} — "${en1}" vs "${en2}", no API fixture found`);
            }
            continue;
        }
        if (hits.length > 1) {
            console.warn(`SKIP ${matchId}: ${hits.length} API matches fit — enter result manually.`);
            if (isStale) staleUnmatched.push(`${matchId} — ${hits.length} ambiguous API fixtures`);
            continue;
        }

        const am = hits[0];
        const ft = am.score && am.score.fullTime;
        if (am.status !== 'FINISHED' || !ft || ft.home === null || ft.away === null) {
            if (isStale) {
                console.error(`NO SCORE ${matchId}: matched API fixture ${am.id} but status=${am.status} score=${ft ? `${ft.home}-${ft.away}` : 'n/a'} ${Math.round(minsSince)} min after kickoff.`);
                staleUnmatched.push(`${matchId} — "${en1}" vs "${en2}", matched fixture has no final score`);
            }
            continue;
        }

        const homeIsTeam1 = norm(am.homeTeam.name) === t1;
        const g1 = homeIsTeam1 ? ft.home : ft.away;
        const g2 = homeIsTeam1 ? ft.away : ft.home;
        if (am.score.duration !== 'REGULAR') {
            console.warn(`NOTE ${matchId}: decided in ${am.score.duration}; recording full-time score ${g1}-${g2}.`);
        }
        finished.push({ matchId, m, g1, g2 });
        console.log(`MATCHED ${matchId}: ${en1} ${g1}-${g2} ${en2} (api id ${am.id})`);
    }

    if (finished.length === 0) {
        console.log('No candidate has a finished result yet.');
        reportStale(staleUnmatched);
        return;
    }

    // Build one multi-path update: results + recalculated points + member
    // totals. Mirrors saveResult() / recalcPoints() / recalcMemberTotal().
    const updates = {};
    for (const { matchId, g1, g2 } of finished) {
        updates[`matches/${matchId}/result`] = { team1Goals: g1, team2Goals: g2 };
        updates[`matches/${matchId}/status`] = 'completed';
    }

    const scored = finished.filter(f => !f.m.noPoints);
    if (scored.length > 0) {
        const [groups, bets, specialBets] = await Promise.all([
            fbGet('groups', token), fbGet('bets', token), fbGet('specialBets', token),
        ]);
        const allBets = bets || {};

        for (const groupId of Object.keys(groups || {})) {
            const members = (groups[groupId] && groups[groupId].members) || {};
            for (const userId of Object.keys(members)) {
                const userBets = ((allBets[groupId] || {})[userId]) || {};

                for (const { matchId, g1, g2 } of scored) {
                    const bet = userBets[matchId];
                    if (!bet) {
                        // Same auto-fill recalcPoints() writes for members with no bet.
                        const filled = { team1Goals: 0, team2Goals: 0, placedAt: 0, points: calcPoints(0, 0, g1, g2) };
                        updates[`bets/${groupId}/${userId}/${matchId}`] = filled;
                        userBets[matchId] = filled;
                    } else {
                        bet.points = calcPoints(bet.team1Goals, bet.team2Goals, g1, g2);
                        updates[`bets/${groupId}/${userId}/${matchId}/points`] = bet.points;
                    }
                }

                const special = ((specialBets || {})[groupId] || {})[userId] || {};
                const matchPts = Object.values(userBets).reduce((s, b) => s + (b.points || 0), 0);
                const specialPts = ((special.winner && special.winner.points) || 0)
                    + ((special.topScorer && special.topScorer.points) || 0);
                updates[`groups/${groupId}/members/${userId}/totalPoints`] = matchPts + specialPts;

                if (!((allBets[groupId] || {})[userId])) {
                    allBets[groupId] = allBets[groupId] || {};
                    allBets[groupId][userId] = userBets;
                }
            }
        }
    }

    if (DRY_RUN) {
        console.log(`DRY RUN — would write ${Object.keys(updates).length} path(s):`);
        console.log(JSON.stringify(updates, null, 2));
        reportStale(staleUnmatched);
        return;
    }

    await fbPatch(updates, token);
    console.log(`Wrote ${Object.keys(updates).length} path(s) for ${finished.length} match(es).`);

    // Write usable results first (above) so a stuck game never blocks good ones, then
    // fail the run if anything is stuck — surfaces it as a red Action.
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
