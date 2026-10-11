import { state, save } from "./game.js";

const DAY_MS = 24 * 60 * 60 * 1000;

// Day 1 = 10 tokens, then +5 each day, Day 7 = 100 token bonus. After Day 7 the cycle repeats.
export function rewardForDay(day) {
  const cycleDay = ((day - 1) % 7) + 1;
  return cycleDay === 7 ? 100 : 10 + (cycleDay - 1) * 5;
}

export function rewardStatus(now = Date.now()) {
  const sinceLast = state.lastClaim === null ? Infinity : now - state.lastClaim;
  const missedDay = state.lastClaim !== null && sinceLast >= 2 * DAY_MS; // more than 24h past the claim window
  const streak = missedDay ? 0 : state.streak;
  const nextDay = streak + 1;
  return {
    streak,
    missedDay,
    canClaim: sinceLast >= DAY_MS,
    msUntilClaim: Math.max(0, DAY_MS - sinceLast),
    nextDay,
    nextReward: rewardForDay(nextDay),
    schedule: Array.from({ length: 7 }, (_, i) => rewardForDay(i + 1))
  };
}

export function claimDaily(now = Date.now()) {
  const status = rewardStatus(now);
  if (!status.canClaim) throw new Error("You already claimed today's reward. Come back in 24 hours.");
  state.streak = status.nextDay; // missed a day -> nextDay is 1, so the streak restarts
  state.tokens += status.nextReward;
  state.lastClaim = now;
  save();
  return status.nextReward;
}

// Demo helper for the video: pretend `hours` have passed since the last claim.
export function skipTime(hours) {
  if (state.lastClaim === null) throw new Error("Claim a reward first, then skip time.");
  state.lastClaim -= Number(hours) * 60 * 60 * 1000;
  save();
}
