# פול התמנון (Paul the Octopus) — Dummy Random Player Design

**Date:** 2026-06-20
**Status:** Approved

## Goal

Add a fixed "dummy" player, **פול התמנון** (Paul the Octopus), to every group. Paul
makes reasonable random predictions for every match (plus a random tournament
champion and top scorer) so real players can see how a purely random competitor
fares. He appears in the leaderboard and live board like any member, with a small
🐙 icon next to his name.

## Background / Constraints (from the existing codebase)

- **The GitHub Action updater** (`scripts/update-results.mjs`) already authenticates
  to Firebase with a service token (`firebaseSignIn()` → idToken, writes via
  `fbPatch` REST `PATCH ?auth=token`) and reads `matches`, `groups`, `bets`,
  `specialBets` every run.
- **`buildResultUpdates`** (`scripts/lib/results-core.mjs`) iterates **every member of
  every group** when a match finishes: it scores each member's bet via `calcPoints`,
  **auto-fills a missing bet as 0–0**, and rewrites `groups/{gid}/members/{uid}/totalPoints`.
  So any member who has bets is scored automatically.
- **`recalcTournamentPoints`** (`app.js`) iterates every member of every group and
  scores `specialBets/{gid}/{uid}/{winner|topScorer}` against `settings/tournament`
  (`TOURNAMENT_POINTS = 10` each). Triggered by the admin when finals are set.
- **The DB now requires auth** (anonymous REST read returns 401). Writes must come
  from an authenticated context — the updater (server-side) or a logged-in client.
- Data model (rooted at `worldcup2026/`):
  - `users/{uid}` → `{ name, email }`
  - `groups/{gid}/members/{uid}` → `{ joinedAt, totalPoints, name }`
  - `bets/{gid}/{uid}/{matchId}` → `{ team1Goals, team2Goals, placedAt, points? }`
  - `specialBets/{gid}/{uid}/{winner|topScorer}` → `{ team|player, placedAt, points? }`
  - `settings/tournament` → `{ teams, scorers, winner, topScorer }`
  - `matches/{matchId}` → `{ team1, team2, date, ..., result? }`
- `parseMatchDate` treats the naive date string as **UTC** (updater is UTC).

## Chosen approach: Updater-owned, deterministic per-match seed

The updater is the only context that has write credentials, already reads the
needed data, and already scores every member. Paul's logic is a new **pure**
module called from the updater each run. Paul's prediction for a given match is
**seeded by the matchId**, making it fixed forever, identical across all groups,
and reproducible in tests.

Rejected alternatives:
- **Client-side** (first client writes Paul): clients race and could regenerate
  inconsistent randoms, pollutes UI code, non-deterministic, hard to test.
- **Separate dedicated workflow:** duplicates sign-in/reads; more moving parts than
  folding into the existing updater.

## Components

### 1. `scripts/lib/paul-core.mjs` (new, pure — no I/O)

Exports:

- `PAUL_USER_ID = 'paul-octopus'`
- `PAUL_NAME = 'פול התמנון'`
- `seededRandom(str)` — returns a deterministic PRNG function `() => [0,1)` derived
  from a string seed (string hash → mulberry32). Same string ⇒ same sequence.
- `randomScore(rng)` — returns `{ team1Goals, team2Goals }`. Each side's goals drawn
  independently from the weighted distribution:
  `0:0.28, 1:0.34, 2:0.22, 3:0.10, 4:0.04, 5:0.02`.
- `randomPick(rng, list)` — returns a deterministic element of a non-empty array
  (or `null` for an empty/missing list).
- `buildPaulUpdates({ groups, matches, bets, specialBets, tournament, now })` —
  returns a flat `{ path: value }` updates object (same shape the updater patches):
  1. **User record:** if `users/paul-octopus` absent from the data given, set
     `users/paul-octopus = { name: PAUL_NAME, email: '' }`. (The updater passes the
     `users` node so this is computed, not blindly overwritten.)
  2. **Membership:** for every group id in `groups`, if
     `groups/{gid}/members/paul-octopus` is absent, set it to
     `{ joinedAt: now, totalPoints: 0, name: PAUL_NAME }`.
  3. **Match bets:** for every match where `parseMatchDate(date).getTime() > now`
     (not started) **and** `result` is absent (not finished): for every group where
     `bets/{gid}/paul-octopus/{matchId}` is absent, set it to
     `{ ...randomScore(seededRandom(matchId)), placedAt: now }`. The same matchId
     seed is reused for all groups, so Paul's pick is identical everywhere.
  4. **Special bets:** for every group where `specialBets/{gid}/paul-octopus/winner`
     is absent and `tournament.teams` is a non-empty array, set
     `{ team: randomPick(seededRandom('paul-champion'), tournament.teams), placedAt: now }`.
     Likewise `topScorer` from `tournament.scorers` seeded `'paul-topscorer'`. If a
     list is missing/empty, skip that special bet (graceful).

`buildPaulUpdates` performs **no scoring** — points are filled by the existing
match recalc and `recalcTournamentPoints`.

### 2. `scripts/update-results.mjs` (modify)

- Read the `users` and `settings/tournament` nodes (it already reads `groups`,
  `bets`, `specialBets`).
- Call `buildPaulUpdates(...)` and **merge** its result into the existing `updates`
  object before the single `fbPatch(updates, token)`.
- Ordering note: scoring in the same run uses the data read at the start, so on the
  very first run that creates Paul he is not yet scored; he is scored on the next run
  when a result lands (or auto-filled 0–0 for a result that lands the same run). This
  is acceptable and documented.

### 3. `app.js` (modify — display only)

- Add `const PAUL_USER_ID = 'paul-octopus';` near the other top-level constants.
- A small helper to render a member's display label:
  `paulDisplayName(uid)` → returns `t('paul.name')` when `uid === PAUL_USER_ID`,
  else the resolved member/user name. The 🐙 icon is rendered as a separate
  `<span class="octo-icon">🐙</span>` immediately before the name when
  `uid === PAUL_USER_ID`.
- Apply in the two places members are listed:
  - **Leaderboard** rows (`renderLeaderboard`).
  - **Live board** rows (`buildLiveCard`'s `nameOf` usage).
- No other behavior changes — Paul shows up because he is a member.

### 4. `i18n.js` (modify)

Add a `paul.name` key in all three languages:
`he: 'פול התמנון'`, `en: 'Paul the Octopus'`, `es: 'Paul el Pulpo'`.

### 5. `styles.css` (modify)

Add `.octo-icon` (small inline icon, slight spacing). RTL-aware (margin on the
logical inline-end so it sits next to the name correctly in Hebrew).

### 6. Cache-busting (`index.html`)

Bump the `?v=` version strings for `app.js`, `i18n.js`, `styles.css` (and the rest,
consistent with the project rule).

## Data flow

```
updater run
  ├─ read matches, groups, bets, specialBets, users, settings/tournament
  ├─ results-core: buildResultUpdates(...)  → match results + per-member points
  ├─ paul-core:    buildPaulUpdates(...)     → Paul membership + random bets
  ├─ merge both into one updates object
  └─ fbPatch(updates)  (single multi-path PATCH)

admin sets finals → recalcTournamentPoints() scores Paul's special bets (he's a member)

client render
  └─ leaderboard / live board list members incl. paul-octopus → 🐙 + i18n name
```

## Random distribution rationale

Real match scorelines cluster at 0–2 goals per side. The weighted table
(0:28, 1:34, 2:22, 3:10, 4:4, 5:2 percent) produces believable results
(e.g. 1–0, 2–1, 0–0, 2–2) and rarely a blowout, which reads as a plausible
"reasonable" random rather than uniform noise.

## Determinism

- Match prediction seeded by `matchId` ⇒ stable forever and identical in every
  group, even if Paul joins a group later or the updater reruns.
- Champion/top-scorer seeded by fixed constants ⇒ one stable pick.
- This makes the whole feature unit-testable without mocking time/randomness.

## Edge cases

- **Match already played before Paul existed:** no Paul bet is written; the existing
  auto-fill scores it 0–0. Paul effectively "joined late" for those — acceptable.
- **In-progress match (started, no result):** treated as not-future, so no late bet
  is written; auto-filled 0–0 if it finishes before Paul ever bet it. Rare.
- **Empty/missing `settings/tournament.teams`/`scorers`:** special bets skipped, no
  crash.
- **Paul already fully set up:** `buildPaulUpdates` returns an empty/minimal object;
  the updater's PATCH is a no-op for Paul's paths (idempotent).

## Testing

`tests/paul-core.test.mjs` (Node `node --test`):

- `randomScore` returns goals within `[0,5]` for both sides.
- `seededRandom` determinism: same seed ⇒ identical score; different matchIds ⇒
  (generally) different scores.
- `buildPaulUpdates`:
  - creates membership + user record when absent; **omits** them when present.
  - writes a match bet only for future, unfinished matches; **skips** started/
    finished matches and matches Paul already bet.
  - the same match's Paul bet is identical across two groups.
  - writes random champion/top-scorer from `tournament.teams`/`scorers`; skips when
    the lists are empty; omits when Paul already has the special bet.

Frontend icon verified with a headless render harness showing a leaderboard /
live board containing `paul-octopus` and asserting the 🐙 + name render.

## Out of scope

- No admin UI to manage Paul (he is fully automatic).
- No per-group independent randomness (Paul is one octopus; one pick per match,
  shared across groups).
- No retroactive random bets for already-played matches.
