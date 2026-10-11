import express from "express";
import { join } from "node:path";
import { teams } from "./teams.js";
import * as game from "./game.js";
import * as rewards from "./rewards.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(join(process.cwd(), "public")));

function publicState() {
  const s = game.state;
  return {
    tokens: s.tokens,
    week: s.week,
    maxPicks: game.MAX_PICKS,
    teams: teams.map((team) => ({ ...team, ...s.lines[team.id] })),
    picks: s.picks,
    bets: s.bets,
    results: s.results,
    rewards: rewards.rewardStatus()
  };
}

// Runs an action, then sends back the fresh state (or a 400 with the error message).
function handle(action) {
  return (req, res) => {
    try {
      action(req);
      res.json(publicState());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}

app.get("/api/state", (req, res) => res.json(publicState()));
app.post("/api/picks", handle((req) => game.addPick(req.body.teamId)));
app.delete("/api/picks/:teamId", handle((req) => game.removePick(req.params.teamId)));
app.post("/api/bets", handle((req) => game.placeBet(req.body.teamId, req.body.side, Number(req.body.amount))));
app.post("/api/settle", handle(() => game.settleWeek()));
app.post("/api/claim", handle(() => rewards.claimDaily()));
app.post("/api/dev/skip", handle((req) => rewards.skipTime(req.body.hours)));
app.post("/api/reset", handle(() => game.resetAll()));

app.listen(port, () => console.log(`Self Fantasy running at http://localhost:${port}`));
