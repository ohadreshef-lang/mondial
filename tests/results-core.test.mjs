import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyMatches, buildResultUpdates, mapApiFootballLive, parseMatchDate, calcPoints } from '../scripts/lib/results-core.mjs';

const now = Date.parse('2026-06-17T22:30:00Z'); // 2.5h after the 20:00Z kickoff

// Hebrew canonical matches keyed like prod ids. Dates are UTC-naive.
const matches = {
  m_fin: { team1: 'אנגליה', team2: 'קרואטיה', date: '2026-06-17T20:00' }, // 20:00Z, finished
  m_open:{ team1: 'גאנה',   team2: 'פנמה',    date: '2026-06-30T20:00' }, // far future, ignored
};
const apiMatches = [
  { id: 1, status: 'FINISHED', utcDate: '2026-06-17T20:00:00Z',
    homeTeam: { name: 'England' }, awayTeam: { name: 'Croatia' },
    score: { duration: 'REGULAR', fullTime: { home: 4, away: 2 } } },
];

test('classifyMatches: finished fixture is detected with correct orientation', () => {
  const { finished, live } = classifyMatches({ matches, apiMatches, now, minMinutes: 0, staleMinutes: 180, inPlayWindowMs: 9000000 });
  assert.equal(finished.length, 1);
  assert.equal(finished[0].matchId, 'm_fin');
  assert.equal(finished[0].g1, 4); // England == team1
  assert.equal(finished[0].g2, 2);
  assert.equal(live.length, 0);
});

test('buildResultUpdates: finished writes result + finishedAt + clears live', () => {
  const finished = [{ matchId: 'm_fin', m: matches.m_fin, g1: 4, g2: 2 }];
  const updates = buildResultUpdates({ finished, live: [], groups: {}, bets: {}, specialBets: {}, now });
  assert.deepEqual(updates['matches/m_fin/result'], { team1Goals: 4, team2Goals: 2 });
  assert.equal(updates['matches/m_fin/status'], 'completed');
  assert.equal(updates['matches/m_fin/finishedAt'], now);
  assert.equal(updates['matches/m_fin/live'], null);
});

test('calcPoints: exact score = 4, correct outcome = 1, miss = 0', () => {
  assert.equal(calcPoints(2, 1, 2, 1), 4); // exact
  assert.equal(calcPoints(2, 1, 3, 0), 1); // correct outcome (win1)
  assert.equal(calcPoints(2, 1, 1, 2), 0); // wrong outcome
});

test('classifyMatches: in-play fixture becomes a live entry', () => {
  const matches = { m_live: { team1: 'גאנה', team2: 'פנמה', date: '2026-06-17T23:00' } }; // 23:00Z
  const now = Date.parse('2026-06-17T23:50:00Z'); // 50 min in (UTC dates)
  const apiMatches = [{
    id: 9, status: 'IN_PLAY', utcDate: '2026-06-17T23:00:00Z',
    homeTeam: { name: 'Ghana' }, awayTeam: { name: 'Panama' },
    score: { duration: 'REGULAR', fullTime: { home: 1, away: 0 } },
  }];
  const { live, finished } = classifyMatches({ matches, apiMatches, now, staleMinutes: 180, inPlayWindowMs: 3*3600*1000 });
  assert.equal(finished.length, 0);
  assert.equal(live.length, 1);
  assert.equal(live[0].matchId, 'm_live');
  assert.equal(live[0].g1, 1); // Ghana == team1
  assert.equal(live[0].g2, 0);
  assert.equal(live[0].status, 'IN_PLAY');
});

test('buildResultUpdates: live entry writes a live node only', () => {
  const now = 1750000000000;
  const live = [{ matchId: 'm_live', m: { team1:'גאנה', team2:'פנמה' }, g1: 1, g2: 0, status: 'IN_PLAY' }];
  const updates = buildResultUpdates({ finished: [], live, groups: {}, bets: {}, specialBets: {}, now });
  assert.deepEqual(updates['matches/m_live/live'], { team1Goals: 1, team2Goals: 0, status: 'IN_PLAY', updatedAt: now, minute: null });
  assert.equal(updates['matches/m_live/result'], undefined);
});

test('buildResultUpdates: finished recalcs a member bet to points', () => {
  const now = 1750000000000;
  const finished = [{ matchId: 'm_fin', m: { team1:'אנגליה', team2:'קרואטיה' }, g1: 4, g2: 2 }];
  const groups = { g1: { members: { u1: {} } } };
  const bets = { g1: { u1: { m_fin: { team1Goals: 4, team2Goals: 2, points: 0 } } } };
  const updates = buildResultUpdates({ finished, live: [], groups, bets, specialBets: {}, now });
  assert.equal(updates['bets/g1/u1/m_fin/points'], 4); // exact -> calcPoints exact value
  assert.equal(updates['groups/g1/members/u1/totalPoints'], 4);
});

// --- mapApiFootballLive (API-Football live source) -------------------------

const afNow = Date.parse('2026-06-17T23:50:00Z'); // 50 min into a 23:00Z kickoff
const afMatches = {
  m_live: { team1: 'גאנה', team2: 'פנמה', date: '2026-06-17T23:00' },          // Ghana v Panama
  m_kr:   { team1: 'קוריאה הדרומית', team2: 'יפן', date: '2026-06-17T23:00' },  // South Korea v Japan
  m_done: { team1: 'אנגליה', team2: 'קרואטיה', date: '2026-06-17T20:00', result: { team1Goals: 4, team2Goals: 2 } },
};
const afFixture = (home, away, gh, ga, short) => ({
  fixture: { id: 1, date: '2026-06-17T23:00:00+00:00', status: { short, elapsed: 50 } },
  league: { id: 1, name: 'World Cup' },
  teams: { home: { name: home }, away: { name: away } },
  goals: { home: gh, away: ga },
});

test('mapApiFootballLive: in-play (1H) -> live entry with correct orientation', () => {
  const live = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Ghana', 'Panama', 1, 0, '1H')], now: afNow });
  assert.equal(live.length, 1);
  assert.equal(live[0].matchId, 'm_live');
  assert.equal(live[0].g1, 1); // Ghana == team1
  assert.equal(live[0].g2, 0);
  assert.equal(live[0].status, 'IN_PLAY');
  assert.equal(live[0].minute, 50); // captured from fixture.status.elapsed
});

test('mapApiFootballLive: away-home swap orients to team1/team2', () => {
  // API has Panama at home; our DB has Ghana as team1 -> g1 must follow Ghana.
  const live = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Panama', 'Ghana', 0, 2, '2H')], now: afNow });
  assert.equal(live.length, 1);
  assert.equal(live[0].g1, 2); // Ghana (team1) scored 2
  assert.equal(live[0].g2, 0);
});

test('mapApiFootballLive: HT -> PAUSED', () => {
  const live = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Ghana', 'Panama', 1, 1, 'HT')], now: afNow });
  assert.equal(live.length, 1);
  assert.equal(live[0].status, 'PAUSED');
});

test('mapApiFootballLive: team-name alias (Korea Republic -> South Korea)', () => {
  const live = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Korea Republic', 'Japan', 2, 2, '1H')], now: afNow });
  assert.equal(live.length, 1);
  assert.equal(live[0].matchId, 'm_kr');
  assert.equal(live[0].g1, 2);
  assert.equal(live[0].status, 'IN_PLAY');
});

test('mapApiFootballLive: non-live status (NS/FT) is skipped', () => {
  const ns = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Ghana', 'Panama', 0, 0, 'NS')], now: afNow });
  const ft = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Ghana', 'Panama', 1, 0, 'FT')], now: afNow });
  assert.equal(ns.length, 0);
  assert.equal(ft.length, 0);
});

test('mapApiFootballLive: null goals skipped; already-finished match skipped; unmatched skipped', () => {
  const nullGoals = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Ghana', 'Panama', null, null, '1H')], now: afNow });
  assert.equal(nullGoals.length, 0);
  // m_done has a result -> never live even if a fixture matches its teams
  const doneFix = { fixture: { date: '2026-06-17T20:00:00+00:00', status: { short: '2H' } }, teams: { home: { name: 'England' }, away: { name: 'Croatia' } }, goals: { home: 5, away: 0 } };
  const done = mapApiFootballLive({ matches: afMatches, apiFixtures: [doneFix], now: Date.parse('2026-06-17T20:50:00Z') });
  assert.equal(done.length, 0);
  // a live fixture for teams not in our DB -> no entry
  const other = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Brazil', 'Spain', 1, 1, '1H')], now: afNow });
  assert.equal(other.length, 0);
});

test('mapApiFootballLive: past the in-play window is skipped', () => {
  // 5h after kickoff, beyond the 3h window
  const lateNow = Date.parse('2026-06-18T04:00:00Z');
  const live = mapApiFootballLive({ matches: afMatches, apiFixtures: [afFixture('Ghana', 'Panama', 1, 0, '2H')], now: lateNow });
  assert.equal(live.length, 0);
});
