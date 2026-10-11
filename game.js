import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { teams } from "./teams.js";

export const MAX_PICKS = 5;
const SAVE_FILE = "data.json";

// Each team gets one random "fantasy" over/under line: points, total yards, or turnovers.
const statTypes = [
  { stat: "Points", min: 14, max: 38, step: 1 },
  { stat: "Total Yards", min: 280, max: 480, step: 5 },
  { stat: "Turnovers", min: 0, max: 3, step: 1 }
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function makeLines() {
  const lines = {};
  for (const team of teams) {
    const type = statTypes[randomInt(0, statTypes.length - 1)];
    const base = randomInt(0, Math.floor((type.max - type.min) / type.step)) * type.step + type.min;
    lines[team.id] = { stat: type.stat, line: base + 0.5 }; // .5 so a bet never ties
  }
  return lines;
}

function freshState() {
  return {
    tokens: 100,
    week: 1,
    picks: [],
    lines: makeLines(),
    bets: {},
    results: [],
    streak: 0,
    lastClaim: null
  };
}

export let state = existsSync(SAVE_FILE) ? JSON.parse(readFileSync(SAVE_FILE, "utf8")) : freshState();

export function save() {
  writeFileSync(SAVE_FILE, JSON.stringify(state, null, 2));
}

export function resetAll() {
  state = freshState();
  save();
}

export function addPick(teamId) {
  if (!teams.some((team) => team.id === teamId)) throw new Error("Unknown team.");
  if (state.picks.includes(teamId)) throw new Error("You already picked that team.");
  if (state.picks.length >= MAX_PICKS) throw new Error(`You can only pick up to ${MAX_PICKS} teams.`);
  state.picks.push(teamId);
  save();
}

export function removePick(teamId) {
  if (state.bets[teamId]) throw new Error("Settle your bet on that team before removing it.");
  state.picks = state.picks.filter((id) => id !== teamId);
  save();
}

export function placeBet(teamId, side, amount) {
  if (!state.picks.includes(teamId)) throw new Error("Pick that team first.");
  if (state.bets[teamId]) throw new Error("You already have a bet on that team this week.");
  if (side !== "over" && side !== "under") throw new Error("Choose over or under.");
  if (!Number.isInteger(amount) || amount < 1) throw new Error("Bet a whole number of tokens (at least 1).");
  if (amount > state.tokens) throw new Error(`You only have ${state.tokens} tokens.`);
  state.tokens -= amount;
  state.bets[teamId] = { side, amount };
  save();
}

// Simulates game day: makes up a final stat for each bet, pays 2x on wins, then starts a new week.
export function settleWeek() {
  const entries = Object.entries(state.bets);
  if (entries.length === 0) throw new Error("Place at least one bet before game day.");
  const results = entries.map(([teamId, bet]) => {
    const { stat, line } = state.lines[teamId];
    const spread = Math.max(2, line * 0.3);
    const actual = Math.max(0, Math.round(line + (Math.random() * 2 - 1) * spread));
    const outcome = actual > line ? "over" : "under";
    const won = outcome === bet.side;
    const payout = won ? bet.amount * 2 : 0;
    state.tokens += payout;
    return { teamId, stat, line, side: bet.side, amount: bet.amount, actual, won, payout };
  });
  state.results = results;
  state.bets = {};
  state.week += 1;
  state.lines = makeLines();
  save();
  return results;
}
