// Team picker: choose up to 5 favorite teams.
const grid = document.querySelector("#team-grid");
const pickCount = document.querySelector("#pick-count");
const tabs = document.querySelectorAll(".filter-tab");

let league = "NFL";

export function renderTeams(state, onPick, onRemove) {
  pickCount.textContent = `${state.picks.length} / ${state.maxPicks}`;
  const full = state.picks.length >= state.maxPicks;

  grid.innerHTML = "";
  for (const team of state.teams.filter((t) => t.league === league)) {
    const picked = state.picks.includes(team.id);
    const card = document.createElement("div");
    card.className = picked ? "team-card picked" : "team-card";
    card.style.borderLeftColor = team.color;
    card.innerHTML = `<div class="team-info"><strong>${team.name}</strong><small>${team.abbr} · ${team.league}</small></div>`;

    const button = document.createElement("button");
    button.className = picked ? "pick-button remove" : "pick-button";
    button.textContent = picked ? "Remove" : "Pick";
    button.disabled = !picked && full;
    button.addEventListener("click", () => (picked ? onRemove(team.id) : onPick(team.id)));
    card.append(button);
    grid.append(card);
  }
}

export function setupLeagueTabs(rerender) {
  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      league = tab.dataset.league;
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      rerender();
    });
  }
}
