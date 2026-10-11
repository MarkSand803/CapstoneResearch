// Daily rewards: popup (claim button + streak counter) and the corner streak widget.
const widget = document.querySelector("#streak-widget");
const widgetStreak = document.querySelector("#widget-streak");
const widgetTimer = document.querySelector("#widget-timer");
const popup = document.querySelector("#rewards-popup");
const popupStreak = document.querySelector("#popup-streak");
const popupNote = document.querySelector("#popup-note");
const rewardDays = document.querySelector("#reward-days");
const claimButton = document.querySelector("#claim-button");

let rewards;
let readyAt = 0; // browser time when the next claim opens

function formatTime(ms) {
  const total = Math.ceil(ms / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

function tick() {
  if (!rewards) return;
  const remaining = readyAt - Date.now();
  const ready = remaining <= 0;
  widget.classList.toggle("ready", ready);
  widgetTimer.textContent = ready ? "Reward ready! Tap to claim" : `Next reward in ${formatTime(remaining)}`;
  claimButton.disabled = !ready;
  claimButton.textContent = ready ? `Claim ${rewards.nextReward} tokens` : `Come back in ${formatTime(remaining)}`;
}

export function renderRewards(newRewards) {
  rewards = newRewards;
  readyAt = Date.now() + rewards.msUntilClaim;

  widgetStreak.textContent = `Day ${rewards.streak} streak`;
  popupStreak.textContent = rewards.streak;
  popupNote.textContent = rewards.missedDay
    ? "You missed a day, so your streak reset. Claim now to start again at Day 1."
    : "Open the app every 24 hours to keep your streak going. Day 7 is a big bonus!";

  const cycleDay = rewards.streak % 7; // days already claimed in this 7-day cycle
  rewardDays.innerHTML = "";
  rewards.schedule.forEach((tokens, index) => {
    const day = index + 1;
    const cell = document.createElement("div");
    cell.className = "reward-day";
    if (day === 7) cell.classList.add("bonus");
    if (day <= cycleDay || (rewards.streak > 0 && cycleDay === 0)) cell.classList.add("done");
    if (day === ((rewards.nextDay - 1) % 7) + 1) cell.classList.remove("done"), cell.classList.add("next");
    cell.innerHTML = `Day ${day}<b>${tokens}</b>`;
    rewardDays.append(cell);
  });
  tick();
}

export function openPopup() { popup.hidden = false; }
export function closePopup() { popup.hidden = true; }
export function setupRewards(onClaim) {
  widget.addEventListener("click", openPopup);
  document.querySelector("#popup-close").addEventListener("click", closePopup);
  popup.addEventListener("click", (event) => { if (event.target === popup) closePopup(); });
  claimButton.addEventListener("click", onClaim);
  setInterval(tick, 1000);
}
