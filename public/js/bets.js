// Bet cards: one per picked team, with an over/under line and a token amount.
const list = document.querySelector("#bet-list");
const betCount = document.querySelector("#bet-count");

export function renderBets(state, onBet) {
  const picked = state.teams.filter((team) => state.picks.includes(team.id));
  const betTotal = Object.keys(state.bets).length;
  betCount.textContent = `${betTotal} ${betTotal === 1 ? "bet" : "bets"}`;

  if (picked.length === 0) {
    list.innerHTML = `<p class="empty">Pick a team above to see its over/under line.</p>`;
    return;
  }

  list.innerHTML = "";
  for (const team of picked) {
    const bet = state.bets[team.id];
    const card = document.createElement("div");
    card.className = "bet-card";
    card.style.borderLeftColor = team.color;
    card.innerHTML = `
      <div class="bet-top">
        <div><strong>${team.name}</strong><small>Team ${team.stat} this week</small></div>
        <div class="line-badge">${team.line}<br /><small>over / under</small></div>
      </div>`;

    if (bet) {
      card.insertAdjacentHTML("beforeend", `<p class="active-bet">Active bet: ${bet.amount} tokens on the ${bet.side.toUpperCase()}</p>`);
    } else {
      const form = document.createElement("div");
      form.className = "bet-form";
      form.innerHTML = `<input type="number" min="1" max="${state.tokens}" value="${Math.min(10, state.tokens)}" aria-label="Tokens to bet" />`;
      const input = form.querySelector("input");
      for (const side of ["over", "under"]) {
        const button = document.createElement("button");
        button.className = side === "over" ? "side-button" : "side-button under";
        button.textContent = `Bet ${side}`;
        button.disabled = state.tokens < 1;
        button.addEventListener("click", () => onBet(team.id, side, Number(input.value)));
        form.append(button);
      }
      card.append(form);
    }
    list.append(card);
  }
}
