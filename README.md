# Self Fantasy (Research Milestone)

A small web app with two features:

- **Self Fantasy (Team Over/Under):** pick up to 5 favorite teams (12 NFL + 12 college), see a random over/under line for each (points, total yards, or turnovers), and bet tokens on the over or under. You can never bet more tokens than you have. "Simulate Game Day" settles the bets; wins pay 2x.
- **Daily Login Rewards & Streaks:** a popup lets you claim free tokens once every 24 hours (Day 1 = 10, +5 per day, Day 7 = 100 bonus). Missing a day resets the streak to Day 1. A corner widget always shows your streak and a countdown to the next reward.

## Run it

```bash
npm install
npm start
```

Then open http://localhost:3000. Requires Node 20+.

The "Demo tools" buttons at the bottom pretend 24 hours (or 2 days) passed so the streak and the missed-day reset can be shown without waiting.

## Tech choices

| Piece | Choice | Why |
| --- | --- | --- |
| Runtime | Node.js 20+ | One language on server and browser. |
| Server | Express 5 | Tiny, well documented, easy to add API routes. |
| Frontend | Plain HTML, CSS, and browser ES modules | No build step, so it is easy to run and debug. |
| Storage | `data.json` file | Enough for a rough draft; no database to install. |
| Package manager | npm | `package.json` lists dependencies, `package-lock.json` pins exact versions so teammates get identical installs. |

**Pros:** very fast to set up, nothing to compile, easy for teammates to read.
**Cons:** no component framework (React, Vue) so the UI code is manual DOM updates; the JSON file does not handle many users or concurrent writes; the game state is for a single user.

**Likely next steps for the team project:** a framework such as React + Vite, a real database such as Postgres or SQLite, user accounts, and a real sports-data API for lines and results.

## Project layout

- `server.js`: Express server and API routes
- `game.js`: picks, random lines, bets, game day settling, saving
- `rewards.js`: daily reward and streak logic
- `teams.js`: the 24 hard-coded teams
- `public/`: the web page (`index.html`, CSS, and `js/` modules)

## Notes

The CSS colors and general layout were inspired by a classmate's reference project; all code here is original.
