import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_VERSION = "0.3.8";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const files = {
  html: "index.html",
  app: "app.js",
  api: "api/research.js",
  server: "server.mjs",
  styles: "styles.css",
  readme: "README.md"
};

const forbiddenVisibleTerms = [
  "Ověřeno",
  "Neověřeno",
  "Dezinformace",
  "AI analyzovala",
  "Algoritmus zjistil"
];

async function text(file) {
  return readFile(path.join(ROOT, file), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseCheck(file, source) {
  let code = source;

  if (file === files.api) {
    code = code.replace("export default async function handler", "async function handler");
  }

  if (file === files.server) {
    code = code
      .replace(/^import .+$/gm, "")
      .replace("const __dirname = path.dirname(fileURLToPath(import.meta.url));", "const __dirname = '';");
  }

  try {
    new Function(code);
  } catch (error) {
    throw new Error(`${file} neprošel syntax checkem:\n${error.message}`);
  }
}

const html = await text(files.html);
const app = await text(files.app);
const styles = await text(files.styles);
const readme = await text(files.readme);

assert(html.includes(`content="${APP_VERSION}-`), "Meta verze v index.html neodpovídá aktuální verzi.");
assert(html.includes(`verze ${APP_VERSION}`), "Viditelná verze v levém panelu neodpovídá aktuální verzi.");
assert(html.includes(`styles.css?v=${APP_VERSION}`), "CSS nemá cache-busting verzi.");
assert(html.includes(`app.js?v=${APP_VERSION}`), "JS nemá cache-busting verzi.");
assert(app.includes(`const APP_VERSION = "${APP_VERSION}"`), "APP_VERSION v app.js neodpovídá aktuální verzi.");
assert(readme.includes(APP_VERSION), "README neobsahuje aktuální verzi.");
assert(app.includes("Výňatek zatím není doplněn"), "Chybí fallback pro nedoplněný výňatek.");
assert(app.includes("visibleExcerptFor"), "Chybí funkce pro vždy viditelný výňatek.");
assert(app.includes("yearStatsFor"), "Chybí výpočet hustoty článků v časové ose.");
assert(app.includes("sourceGroupRank"), "Chybí řazení skupin zdrojů podle relevance.");
assert(styles.includes("blockquote.is-missing"), "Chybí vizuální styl pro nedoplněný výňatek.");
assert(styles.includes("--year-intensity"), "Chybí vizuální intenzita roků v časové ose.");

const visibleSurface = [html, app, readme].join("\n");
for (const term of forbiddenVisibleTerms) {
  assert(!visibleSurface.includes(term), `Nalezen zakázaný viditelný termín: ${term}`);
}

parseCheck(files.app, app);
parseCheck(files.api, await text(files.api));
parseCheck(files.server, await text(files.server));

console.log(`Kontrola aplikace prošla pro verzi ${APP_VERSION}.`);
