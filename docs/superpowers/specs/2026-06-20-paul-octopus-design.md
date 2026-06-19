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
**seeded by `groupId:matchId`**, making it fixed forever per group (different
across groups, stable within one) and reproducible in tests.

Because Paul bets on **every match, including already-finished ones**, and the
results updater only scores matches that finish *during that run*, `paul-core` is
the **sole authority** for everything Paul: it generates his bets, computes his
match points (for any match that already has a result), and maintains his
`totalPoints`. Paul is therefore **excluded from `buildResultUpdates`** so the two
modules never write the same Paul paths.

Rejected alternatives:
- **Client-side** (first client writes Paul): clients race and could regenerate
  inconsistent randoms, pollutes UI code, non-deterministic, hard to test.
- **Separate dedicated workflow:** duplicates sign-in/reads; more moving parts than
  folding into the existing updater.

## Components

### 1. `scripts/lib/paul-core.mjs` (new, pure — no I/O)

Imports `calcPoints` from `results-core.mjs` (the single scoring source of truth).

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
  returns a flat `{ path: value }` updates object (same shape the updater patches).
  `paul-core` fully owns Paul; the function is **idempotent** (re-running converges):
  1. **User record:** if `users/paul-octopus` absent from the data given, set
     `users/paul-octopus = { name: PAUL_NAME, email: '' }`.
  2. **Membership:** for every group id in `groups`, if
     `groups/{gid}/members/paul-octopus` is absent, set it to
     `{ joinedAt: now, totalPoints: 0, name: PAUL_NAME }`.
  3. **Match bets (every match — past and future):** for every match and every
     group where `bets/{gid}/paul-octopus/{matchId}` is **absent**, generate
     `score = randomScore(seededRandom(`${gid}:${matchId}`))` and set
     `bets/{gid}/paul-octopus/{matchId} = { ...score, placedAt: now }` (plus
     `points` per step 5). The `groupId:matchId` seed makes the pick stable per
     group and **different across groups**. Existing Paul bets are left as-is (not
     regenerated) to preserve `placedAt`.
  4. **Special bets (per group):** for every group where
     `specialBets/{gid}/paul-octopus/winner` is absent and `tournament.teams` is a
     non-empty array, set
     `{ team: randomPick(seededRandom(`${gid}:champion`), tournament.teams), placedAt: now }`
     (plus `points` per step 5). Likewise `topScorer` from `tournament.scorers`
     seeded `` `${gid}:topscorer` ``. If a list is missing/empty, skip that special
     bet (graceful).
  5. **Scoring + total (Paul is sole authority):** for each group, build Paul's full
     bet set (existing bets from the data merged with the ones generated this run).
     For every Paul bet whose match has a `result`, set
     `points = calcPoints(team1Goals, team2Goals, result.team1Goals, result.team2Goals)`.
     For special bets, set `points = TOURNAMENT_POINTS` when the pick equals
     `tournament.winner` / `tournament.topScorer` (and those are set), else `0`.
     Then write `groups/{gid}/members/paul-octopus/totalPoints =
     sum(match points) + sum(special points)`.

`TOURNAMENT_POINTS = 10` is defined locally in `paul-core.mjs` with a comment that
it mirrors the constant in `app.js` (there is no shared constants module).

### 2. `scripts/lib/results-core.mjs` (modify)

- `buildResultUpdates` gains an optional `excludeUserIds = []` parameter. Any member
  whose userId is in that set is **skipped** in the member-scoring loop. Default `[]`
  preserves current behavior (existing tests unchanged).

### 3. `scripts/update-results.mjs` (modify)

- Read the `users` and `settings/tournament` nodes (it already reads `groups`,
  `bets`, `specialBets`).
- Pass `excludeUserIds: [PAUL_USER_ID]` to `buildResultUpdates` so Paul is never
  scored there (he is owned by `paul-core`).
- Call `buildPaulUpdates(...)` and **merge** its result into the existing `updates`
  object before the single `fbPatch(updates, token)`.
- Ordering note: `buildPaulUpdates` is idempotent and self-contained — it recomputes
  Paul's points/total from the matches/results it reads each run, so there is no
  cross-module write conflict and Paul self-heals on the next run if data changes.

### 4. `app.js` (modify — display only)

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

### 5. `i18n.js` (modify)

Add a `paul.name` key in all three languages:
`he: 'פול התמנון'`, `en: 'Paul the Octopus'`, `es: 'Paul el Pulpo'`.

### 6. `styles.css` (modify)

Add `.octo-icon` (small inline icon, slight spacing). RTL-aware (margin on the
logical inline-end so it sits next to the name correctly in Hebrew).

### 7. Cache-busting (`index.html`)

Bump the `?v=` version strings for `app.js`, `i18n.js`, `styles.css` (and the rest,
consistent with the project rule).

## Data flow

```
updater run
  ├─ read matches, groups, bets, specialBets, users, settings/tournament
  ├─ results-core: buildResultUpdates(..., excludeUserIds:[PAUL])  → results + non-Paul points
  ├─ paul-core:    buildPaulUpdates(...)  → Paul membership + per-group random bets
  │                                          + Paul's match/special points + totalPoints
  ├─ merge both into one updates object
  └─ fbPatch(updates)  (single multi-path PATCH)

admin sets finals → recalcTournamentPoints()/recalcMemberTotal() agree with paul-core
                     (both sum match points + special points) → consistent

client render
  └─ leaderboard / live board list members incl. paul-octopus → 🐙 + i18n name
```

## Random distribution rationale

Real match scorelines cluster at 0–2 goals per side. The weighted table
(0:28, 1:34, 2:22, 3:10, 4:4, 5:2 percent) produces believable results
(e.g. 1–0, 2–1, 0–0, 2–2) and rarely a blowout, which reads as a plausible
"reasonable" random rather than uniform noise.

## Determinism

- Match prediction seeded by `groupId:matchId` ⇒ stable forever within a group and
  different across groups, even if Paul joins a group later or the updater reruns.
- Champion/top-scorer seeded by `groupId:champion` / `groupId:topscorer` ⇒ one
  stable pick per group.
- This makes the whole feature unit-testable without mocking time/randomness.

## Edge cases

- **Already-finished match:** Paul still gets a random bet (per the requirement);
  `paul-core` scores it immediately via `calcPoints` against the known result and
  folds it into his `totalPoints`.
- **Match finishing the same run Paul is created:** no conflict — `buildResultUpdates`
  skips Paul, and `buildPaulUpdates` scores it from the result it read.
- **Empty/missing `settings/tournament.teams`/`scorers`:** special bets skipped, no
  crash; they get written on a later run once the lists exist.
- **Paul already fully set up with no new matches:** `buildPaulUpdates` only rewrites
  his `points`/`totalPoints` (idempotent, converges to the same values).

## Testing

`tests/paul-core.test.mjs` (Node `node --test`):

- `randomScore` returns goals within `[0,5]` for both sides.
- `seededRandom` determinism: same seed ⇒ identical score; different seeds ⇒
  (generally) different scores.
- `buildPaulUpdates`:
  - creates membership + user record when absent; **omits** them when present.
  - writes a Paul bet for **every** match (past and future) he hasn't bet; **skips**
    matches Paul already bet (no regeneration).
  - the same match's Paul bet **differs** between two groups (per-group seed).
  - finished matches get `points = calcPoints(...)`; `totalPoints` equals the sum of
    match points + special points.
  - writes random champion/top-scorer from `tournament.teams`/`scorers`; skips when
    the lists are empty; omits when Paul already has the special bet; scores special
    points when `tournament.winner`/`topScorer` are set.

`tests/results-core.test.mjs`:

- `buildResultUpdates` with `excludeUserIds:[PAUL_USER_ID]` skips Paul; default `[]`
  is unchanged (regression guard).

Frontend icon verified with a headless render harness showing a leaderboard /
live board containing `paul-octopus` and asserting the 🐙 + name render.

## Out of scope

- No admin UI to manage Paul (he is fully automatic).
