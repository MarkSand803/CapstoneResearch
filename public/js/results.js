// Shows how last week's bets turned out.
const panel = document.querySelector("#results-panel");
const list = document.querySelector("#result-list");

export function renderResults(state) {
  panel.hidden = state.results.length === 0;
  list.innerHTML = "";
  for (const result of state.results) {
    const team = state.teams.find((t) => t.id === result.teamId);
    const card = document.createElement("div");
    card.className = result.won ? "result-card win" : "result-card loss";
    card.innerHTML = `
      <strong>${team.name}</strong> finished with <strong>${result.actual}</strong> ${result.stat.toLowerCase()} (line ${result.line}).<br />
      You bet ${result.amount} on the ${result.side}:
      <b class="${result.won ? "win" : "loss"}">${result.won ? `WON +${result.payout} tokens` : `lost ${result.amount} tokens`}</b>`;
    list.append(card);
  }
}
