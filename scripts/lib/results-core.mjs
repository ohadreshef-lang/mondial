// Pure planning logic for the results updater. No network, DB, or process.env —
// everything is passed in, so it is unit-testable with mock data.

export const HEB_TO_EN = {
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

export const API_ALIASES = {
    'bosnia-herzegovina': 'bosnia and herzegovina',
    'cape verde islands': 'cape verde',
    'congo dr': 'dr congo',
    'united states': 'usa',
};

export function norm(name) {
    const n = (name || '')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().replace(/\s+/g, ' ').trim();
    return API_ALIASES[n] || n;
}

export function parseMatchDate(dateStr) {
    // Naive strings are UTC (mirrors app.js `new Date(dateStr + 'Z')`). Returns ms.
    if (!dateStr) return 0;
    return Date.parse(`${dateStr}Z`);
}

export function getOutcome(g1, g2) {
    return g1 > g2 ? 'win1' : g1 < g2 ? 'win2' : 'draw';
}

export function calcPoints(b1, b2, r1, r2) {
    if (b1 === r1 && b2 === r2) return 4;
    if (getOutcome(b1, b2) === getOutcome(r1, r2)) return 1;
    return 0;
}

// --- API-Football live source (in-play scores only) -----------------------
// football-data.org's free tier never emits IN_PLAY, so live scores come from
// API-Football (api-sports.io). This maps its `fixtures?live=all` response to our
// `live` entries. Finished results + points still come from football-data.org.

// API-Football status.short -> our live status. Anything else (NS, FT, AET, PEN,
// PST, CANC, ...) is not an in-play score and is skipped here.
const AF_INPLAY = new Set(['1H', '2H', 'ET', 'BT', 'P', 'LIVE']);
// Finished statuses — used to CLOSE the game promptly (football-data.org's free tier
// is delayed, so we mark FT from API-Football and let football-data set the official
// result + points when it catches up).
const AF_FINISHED = new Set(['FT', 'AET', 'PEN']);

// API-Football team-name spellings that differ from our canonical English
// (post-base-normalisation). Unmatched live fixtures are skipped gracefully.
const AF_NAME_FIX = {
    'korea republic': 'South Korea',
    'czech republic': 'Czechia',
    'cape verde islands': 'Cape Verde',
    'congo dr': 'DR Congo',
    'bosnia': 'Bosnia and Herzegovina',
    "cote d'ivoire": 'Ivory Coast',
    'usa': 'USA',
};

function normAf(name) {
    const b = norm(name);                 // NFD + lowercase + API_ALIASES
    return AF_NAME_FIX[b] ? norm(AF_NAME_FIX[b]) : b;
}

// Map API-Football live fixtures to our live entries. Pure — pass the fixtures in.
// A DB match is matched to a single in-play fixture by team pair + ±36h window,
// within inPlayWindowMs of kickoff. Returns [{ matchId, m, g1, g2, status }].
export function mapApiFootballLive({ matches, apiFixtures, now, inPlayWindowMs = 3 * 3600 * 1000 }) {
    const live = [];
    for (const [matchId, m] of Object.entries(matches || {})) {
        if (!m || !m.team1 || !m.team2 || !m.date) continue;
        if (m.result && m.result.team1Goals !== undefined) continue;
        const kickoff = parseMatchDate(m.date);
        if (kickoff > now || (now - kickoff) > inPlayWindowMs) continue;
        const en1 = HEB_TO_EN[m.team1], en2 = HEB_TO_EN[m.team2];
        if (!en1 || !en2) continue;
        const t1 = norm(en1), t2 = norm(en2);

        const hits = (apiFixtures || []).filter(f => {
            const short = f.fixture && f.fixture.status && f.fixture.status.short;
            if (short !== 'HT' && !AF_INPLAY.has(short) && !AF_FINISHED.has(short)) return false;
            const home = normAf(f.teams && f.teams.home && f.teams.home.name);
            const away = normAf(f.teams && f.teams.away && f.teams.away.name);
            const same = (home === t1 && away === t2) || (home === t2 && away === t1);
            if (!same) return false;
            const fdate = f.fixture && f.fixture.date ? Date.parse(f.fixture.date) : NaN;
            return Number.isNaN(fdate) ? true : Math.abs(fdate - kickoff) <= 36 * 3600 * 1000;
        });
        if (hits.length !== 1) continue;  // 0 = not live/unmatched, >1 = ambiguous -> skip

        const f = hits[0];
        const gh = f.goals && f.goals.home, ga = f.goals && f.goals.away;
        if (gh == null || ga == null) continue;
        const homeIsT1 = normAf(f.teams.home.name) === t1;
        const g1 = homeIsT1 ? gh : ga;
        const g2 = homeIsT1 ? ga : gh;
        const st = f.fixture.status || {};
        const short = st.short;
        const status = short === 'HT' ? 'PAUSED' : AF_FINISHED.has(short) ? 'FT' : 'IN_PLAY';
        // FT carries no running clock; otherwise capture elapsed (caps 45/90) + stoppage.
        const minute = status === 'FT' ? null : (typeof st.elapsed === 'number' ? st.elapsed : null);
        const extra = status === 'FT' ? null : (typeof st.extra === 'number' ? st.extra : null);
        const inlineEvents = Array.isArray(f.events) ? f.events : null;
        live.push({ matchId, m, g1, g2, status, minute, extra,
            fixtureId: f.fixture && f.fixture.id, homeName: f.teams.home.name, homeIsT1, inlineEvents });
    }
    return live;
}

// Map API-Football goal events to our scorer list. Pure. Keeps real goals (incl.
// penalties), drops missed penalties, credits own goals to the benefiting team (the
// team the API already names on the event), and returns them time-ordered. `homeName`
// is the API home-team name; `homeIsT1` says whether the API home side is our team1.
export function parseGoalEvents(apiEvents, { homeName, homeIsT1 }) {
    const out = [];
    for (const e of (apiEvents || [])) {
        if (!e || e.type !== 'Goal') continue;
        const detail = e.detail || '';
        if (detail === 'Missed Penalty') continue;
        const player = e.player && e.player.name;
        if (!player) continue;
        const time = e.time || {};
        const minute = typeof time.elapsed === 'number' ? time.elapsed : null;
        const extra = typeof time.extra === 'number' ? time.extra : null;
        const kind = detail === 'Penalty' ? 'pen' : detail === 'Own Goal' ? 'og' : 'goal';
        // API-Football already names the BENEFITING team on the event (including own
        // goals, where `player` is the own-goaler) — so no flip is needed for any kind.
        const eventIsHome = normAf(e.team && e.team.name) === normAf(homeName);
        const team = eventIsHome ? (homeIsT1 ? 1 : 2) : (homeIsT1 ? 2 : 1);
        out.push({ team, player, minute, extra, kind });
    }
    out.sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0) || (a.extra ?? 0) - (b.extra ?? 0));
    return out;
}

// Match a DB match to a single API fixture by team pair + ±36h window.
function findApiFixture(m, apiMatches) {
    const en1 = HEB_TO_EN[m.team1];
    const en2 = HEB_TO_EN[m.team2];
    if (!en1 || !en2) return { error: 'mapping', en1, en2 };
    const t1 = norm(en1), t2 = norm(en2);
    const kickoff = parseMatchDate(m.date);
    const hits = apiMatches.filter(am => {
        const home = norm(am.homeTeam && am.homeTeam.name);
        const away = norm(am.awayTeam && am.awayTeam.name);
        const same = (home === t1 && away === t2) || (home === t2 && away === t1);
        if (!same) return false;
        return Math.abs(Date.parse(am.utcDate) - kickoff) <= 36 * 3600 * 1000;
    });
    if (hits.length !== 1) return { error: hits.length === 0 ? 'none' : 'ambiguous', en1, en2, count: hits.length };
    const am = hits[0];
    const t1IsHome = norm(am.homeTeam.name) === t1;
    return { am, en1, en2, t1IsHome };
}

// Split candidates into finished (final score) and live (in-play score), and flag
// stale unmatched ones (well past kickoff, no usable API data).
export function classifyMatches({ matches, apiMatches, now, staleMinutes = 180, inPlayWindowMs = 3 * 3600 * 1000, refinalizeWindowMs = 6 * 3600 * 1000 }) {
    const finished = [];
    const live = [];
    const staleUnmatched = [];

    for (const [matchId, m] of Object.entries(matches || {})) {
        if (!m || !m.team1 || !m.team2 || !m.date) continue;
        const hasResult = m.result && m.result.team1Goals !== undefined;
        // A finalized match is normally done. Re-examine it only briefly after finishing
        // so a VAR correction to the final score can still be applied.
        const withinRefinalize = hasResult && m.finishedAt != null && (now - m.finishedAt) <= refinalizeWindowMs;
        if (hasResult && !withinRefinalize) continue;
        const kickoff = parseMatchDate(m.date);
        if (kickoff > now) continue;                       // not started -> nothing to fetch
        const minsSince = (now - kickoff) / 60000;
        const isStale = minsSince >= staleMinutes;

        const found = findApiFixture(m, apiMatches);
        if (found.error) {
            if (isStale && !hasResult) staleUnmatched.push(`${matchId} — "${found.en1 || m.team1}" vs "${found.en2 || m.team2}", ${found.error}`);
            continue;
        }
        const am = found.am;
        const ft = am.score && am.score.fullTime;
        const g1 = found.t1IsHome ? (ft && ft.home) : (ft && ft.away);
        const g2 = found.t1IsHome ? (ft && ft.away) : (ft && ft.home);

        if (am.status === 'FINISHED' && ft && ft.home !== null && ft.away !== null) {
            if (hasResult) {
                // Re-finalize only if the authoritative score actually changed.
                if (g1 !== m.result.team1Goals || g2 !== m.result.team2Goals) {
                    finished.push({ matchId, m, g1, g2 });
                }
            } else {
                finished.push({ matchId, m, g1, g2 });
            }
        } else if (!hasResult && (am.status === 'IN_PLAY' || am.status === 'PAUSED') && ft && ft.home !== null && ft.away !== null
                   && (now - kickoff) <= inPlayWindowMs) {
            live.push({ matchId, m, g1, g2, status: am.status });
        } else if (isStale && !hasResult) {
            staleUnmatched.push(`${matchId} — "${found.en1}" vs "${found.en2}", status=${am.status}, no usable score`);
        }
    }
    return { finished, live, staleUnmatched };
}

// Build one Firebase multi-path patch: live nodes, final results (+finishedAt,
// clear live), and recalculated per-bet points + member totals.
export function buildResultUpdates({ finished, live, groups, bets, specialBets, now }) {
    const updates = {};

    for (const { matchId, g1, g2, status, minute, extra, scorers } of live) {
        updates[`matches/${matchId}/live`] = { team1Goals: g1, team2Goals: g2, status, updatedAt: now, minute: minute == null ? null : minute, extra: extra == null ? null : extra };
        // Scorers live on a PERSISTENT path so they survive finalize (when the live node
        // is nulled). Never cleared — becomes part of the match's history.
        updates[`matches/${matchId}/scorers`] = Array.isArray(scorers) ? scorers : [];
    }

    for (const { matchId, g1, g2 } of finished) {
        updates[`matches/${matchId}/result`] = { team1Goals: g1, team2Goals: g2 };
        updates[`matches/${matchId}/status`] = 'completed';
        updates[`matches/${matchId}/finishedAt`] = now;
        updates[`matches/${matchId}/live`] = null;
    }

    const scored = finished.filter(f => !f.m.noPoints);
    if (scored.length > 0) {
        const allBets = bets || {};
        for (const groupId of Object.keys(groups || {})) {
            const members = (groups[groupId] && groups[groupId].members) || {};
            for (const userId of Object.keys(members)) {
                const userBets = ((allBets[groupId] || {})[userId]) || {};
                for (const { matchId, g1, g2 } of scored) {
                    const bet = userBets[matchId];
                    if (!bet) {
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
    return updates;
}
