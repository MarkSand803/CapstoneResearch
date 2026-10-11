import express from "express";
import { join } from "node:path";
import { teams } from "./teams.js";

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json());
app.use(express.static(join(process.cwd(), "public")));

app.get("/api/teams", (req, res) => res.json({ teams }));

app.listen(port, () => console.log(`Self Fantasy running at http://localhost:${port}`));
