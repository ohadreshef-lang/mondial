// Choose the updater poll cadence from the remaining API-Football daily quota.
// 5 min (300s) when quota is healthy; 10 min (600s) when low OR unknown (conservative).
export const POLL_LOW_QUOTA_THRESHOLD = 30;

export function choosePollSeconds(remaining) {
    return (Number.isFinite(remaining) && remaining >= POLL_LOW_QUOTA_THRESHOLD) ? 300 : 600;
}
