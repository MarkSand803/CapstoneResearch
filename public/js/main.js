import { request } from "./api.js";
import { renderTeams, setupLeagueTabs } from "./teams.js";
import { renderBets } from "./bets.js";
import { renderResults } from "./results.js";

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
  settleButton.disabled = Object.keys(state.bets).length === 0;
}

settleButton.addEventListener("click", () => act("/api/settle", "POST", undefined, "Game day is over! New lines are posted for next week."));

async function start() {
  state = await request("/api/state");
  setupLeagueTabs(render);
  render();
}

start();
