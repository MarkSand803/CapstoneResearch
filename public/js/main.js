import { request } from "./api.js";
import { renderTeams, setupLeagueTabs } from "./teams.js";

const messageElement = document.querySelector("#message");
const tokenDisplay = document.querySelector("#token-display");
const weekLabel = document.querySelector("#week-label");

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
}

async function start() {
  state = await request("/api/state");
  setupLeagueTabs(render);
  render();
}

start();
