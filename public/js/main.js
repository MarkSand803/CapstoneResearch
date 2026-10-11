import { request } from "./api.js";
import { renderTeams, setupLeagueTabs } from "./teams.js";
import { renderBets } from "./bets.js";
import { renderResults } from "./results.js";
import { renderRewards, setupRewards, openPopup, closePopup } from "./rewards.js";

const messageElement = document.querySelector("#message");
const tokenDisplay = document.querySelector("#token-display");
const weekLabel = document.querySelector("#week-label");

const settleButton = document.querySelector("#settle-button");

let state;

function showMessage(text, isError = false) {
  messageElement.textContent = text;
  messageElement.className = isError ? "message error" : "message";
}

// Runs a server request, then redraws with the new state.
async function act(path, method, body, successText) {
  try {
    state = await request(path, method, body);
    showMessage(successText || "");
  } catch (error) {
    showMessage(error.message, true);
  }
  render();
}

function render() {
  tokenDisplay.textContent = `◉ ${state.tokens} tokens`;
  weekLabel.textContent = `WEEK ${state.week}`;
  renderTeams(state, (id) => act("/api/picks", "POST", { teamId: id }), (id) => act(`/api/picks/${id}`, "DELETE"));
  renderBets(state, (teamId, side, amount) => act("/api/bets", "POST", { teamId, side, amount }, `Bet placed: ${amount} tokens on the ${side}.`));
  renderResults(state);
  renderRewards(state.rewards);
  settleButton.disabled = Object.keys(state.bets).length === 0;
}

settleButton.addEventListener("click", () => act("/api/settle", "POST", undefined, "Game day is over! New lines are posted for next week."));

async function claim() {
  const before = state.tokens;
  await act("/api/claim", "POST");
  if (state.tokens > before) showMessage(`Daily reward claimed: +${state.tokens - before} tokens!`);
  closePopup();
}

// Demo tools so the streak can be shown in a short video.
document.querySelector("#skip-24").addEventListener("click", () => act("/api/dev/skip", "POST", { hours: 24 }, "Pretended 24 hours passed."));
document.querySelector("#skip-48").addEventListener("click", () => act("/api/dev/skip", "POST", { hours: 48 }, "Pretended 2 days passed."));
document.querySelector("#reset-button").addEventListener("click", () => act("/api/reset", "POST", undefined, "Everything reset."));

async function start() {
  state = await request("/api/state");
  setupLeagueTabs(render);
  setupRewards(claim);
  render();
  if (state.rewards.canClaim) openPopup(); // show the daily reward popup right away
}

start();
