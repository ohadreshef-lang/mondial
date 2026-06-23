import { test } from 'node:test';
import assert from 'node:assert/strict';
import { choosePollSeconds, POLL_LOW_QUOTA_THRESHOLD } from '../scripts/lib/poll-interval.mjs';

test('POLL_LOW_QUOTA_THRESHOLD is 30', () => {
  assert.equal(POLL_LOW_QUOTA_THRESHOLD, 30);
});
test('choosePollSeconds: healthy quota -> 300 (5 min)', () => {
  assert.equal(choosePollSeconds(50), 300);
  assert.equal(choosePollSeconds(30), 300);   // boundary: >= threshold
});
test('choosePollSeconds: low quota -> 600 (10 min)', () => {
  assert.equal(choosePollSeconds(29), 600);
  assert.equal(choosePollSeconds(0), 600);
});
test('choosePollSeconds: unknown remaining -> 600 (conservative)', () => {
  assert.equal(choosePollSeconds(undefined), 600);
  assert.equal(choosePollSeconds(NaN), 600);
  assert.equal(choosePollSeconds(null), 600);
});
