// Hard-coded teams for the rough draft (no sports API needed yet).
// [id, name, abbreviation, league, color]
const rows = [
  ["kc", "Kansas City Chiefs", "KC", "NFL", "#e31837"],
  ["buf", "Buffalo Bills", "BUF", "NFL", "#2563eb"],
  ["phi", "Philadelphia Eagles", "PHI", "NFL", "#0f766e"],
  ["dal", "Dallas Cowboys", "DAL", "NFL", "#1e40af"],
  ["sf", "San Francisco 49ers", "SF", "NFL", "#b91c1c"],
  ["bal", "Baltimore Ravens", "BAL", "NFL", "#6d28d9"],
  ["det", "Detroit Lions", "DET", "NFL", "#0284c7"],
  ["cin", "Cincinnati Bengals", "CIN", "NFL", "#ea580c"],
  ["gb", "Green Bay Packers", "GB", "NFL", "#15803d"],
  ["mia", "Miami Dolphins", "MIA", "NFL", "#0d9488"],
  ["hou", "Houston Texans", "HOU", "NFL", "#1d4ed8"],
  ["lar", "Los Angeles Rams", "LAR", "NFL", "#ca8a04"],

  ["ala", "Alabama Crimson Tide", "ALA", "College", "#9f1239"],
  ["uga", "Georgia Bulldogs", "UGA", "College", "#b91c1c"],
  ["osu", "Ohio State Buckeyes", "OSU", "College", "#dc2626"],
  ["mich", "Michigan Wolverines", "MICH", "College", "#1e3a8a"],
  ["tex", "Texas Longhorns", "TEX", "College", "#c2410c"],
  ["ore", "Oregon Ducks", "ORE", "College", "#15803d"],
  ["clem", "Clemson Tigers", "CLEM", "College", "#ea580c"],
  ["lsu", "LSU Tigers", "LSU", "College", "#6d28d9"],
  ["nd", "Notre Dame Fighting Irish", "ND", "College", "#a16207"],
  ["psu", "Penn State Nittany Lions", "PSU", "College", "#1d4ed8"],
  ["fsu", "Florida State Seminoles", "FSU", "College", "#9d174d"],
  ["usc", "USC Trojans", "USC", "College", "#b91c1c"]
];

export const teams = rows.map(([id, name, abbr, league, color]) => ({ id, name, abbr, league, color }));
