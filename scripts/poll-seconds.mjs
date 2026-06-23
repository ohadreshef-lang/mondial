// Prints the updater's next poll interval in seconds (300 or 600), chosen from the
// remaining API-Football quota via the FREE /status endpoint (does not consume quota).
// Any failure -> 600 (conservative). Called by the GitHub Actions poll loop.
import { choosePollSeconds } from './lib/poll-interval.mjs';

const KEY = process.env.FOOTBALL_API_KEY;

async function remainingQuota() {
    if (!KEY) return undefined;
    try {
        const res = await fetch('https://v3.football.api-sports.io/status', {
            headers: { 'x-apisports-key': KEY },
        });
        if (!res.ok) return undefined;
        const json = await res.json();
        const r = json && json.response && json.response.requests;
        if (!r || typeof r.current !== 'number' || typeof r.limit_day !== 'number') return undefined;
        return r.limit_day - r.current;
    } catch {
        return undefined;
    }
}

console.log(choosePollSeconds(await remainingQuota()));
