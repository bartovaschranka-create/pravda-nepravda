import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_VERSION = "0.3.23";
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
    code = `(async () => {\n${code}\n})`;
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
assert(app.includes("Prohledává se"), "Chybí viditelný souhrn počtu prohledávaných zdrojů.");
assert(app.includes("bez-data"), "Chybí zobrazení zdrojů bez dohledaného data na časové ose.");
assert(app.includes("Celý článek"), "Přímý odkaz na konkrétní článek nemá správný text.");
assert(app.includes("isLiveResult"), "Chybí rozlišení konkrétních živých výsledků z API.");
assert(app.includes("isConcreteArticle"), "Chybí rozlišení konkrétního článku od obecného zdroje.");
assert(app.includes("Obecné zdrojové okruhy se jako výsledky nezobrazují"), "Chybí hláška pro prázdné konkrétní výsledky.");
assert(app.includes("window.location.protocol === \"file:\""), "Chybí oddělení statického režimu od živého API režimu.");
assert(app.includes("PERSON_EXPANSIONS"), "Frontend neumí rozšiřovat zadaná jména osob.");
assert(app.includes("ukrajinské obilí"), "Frontend neumí rozšířit dotaz obilí o související výrazy.");
assert((await text(files.api)).includes("resultSnippet"), "Backend nepoužívá Brave snippet/description jako výňatek.");
assert((await text(files.api)).includes("BRAVE_SEARCH_API_KEY_MISSING"), "Backend nevrací jasný stav při chybějícím Brave API klíči.");
assert((await text(files.api)).includes("rawResultsCollected"), "Backend nevrací diagnostiku konkrétních Brave výsledků.");
assert((await text(files.api)).includes("SOURCE_QUERY_GROUPS"), "Backend nepoužívá čisté zdrojové dotazy pro Brave Search.");
assert((await text(files.api)).includes("extractPublishedDate"), "Backend neumí vytáhnout datum publikace z HTML metadat článku.");
assert((await text(files.api)).includes("SOURCE_PRIORITY_DOMAINS"), "Backend nezvýhodňuje seriózní redakční zdroje.");
assert((await text(files.api)).includes("relatedOrganizationTerms"), "Backend nehledá souvislosti firem a organizací spojených s osobou.");
assert((await text(files.api)).includes("replace(/<[^>]+>/g"), "Backend nečistí HTML tagy ve výňatcích.");
assert((await text(files.api)).includes("&lt;"), "Backend nedekóduje escapované HTML tagy ve výňatcích.");
assert(app.includes("cleanNormalizedRecord"), "Frontend nemá pojistku proti HTML tagům v datech z API.");
assert(app.includes("cleanDisplayText"), "Frontend neumí čistit zobrazovaný text.");
assert(app.includes("loadPublicPersonProfile"), "Frontend neumí dohledat veřejný profil osoby.");
assert(app.includes("debateDevelopmentText"), "Shrnutí v čase je pořád jen obecná formulace.");
assert(app.includes("statementQuote || record.quote || record.excerpt"), "Chronologie citací neumí použít výňatky ze zdrojů.");
assert(app.includes("stanceShiftYears"), "Lišta roků neumí označit možný posun postoje.");
assert(app.includes("has-stance-shift"), "Roky neumí zobrazit marker možného posunu postoje.");
assert(app.includes("PERSON_CANDIDATES"), "Frontend neumí nabídnout více kandidátů při shodném příjmení.");
assert(app.includes("personCandidatesFor"), "Frontend neumí vyhodnotit nejednoznačnou osobu.");
assert(app.includes("button.dataset.person"), "Klik na kandidáta neumí upřesnit hledanou osobu.");
assert(app.includes("Lukáš Krpálek"), "Chybí kandidát Lukáš Krpálek pro nejednoznačné příjmení.");
assert(app.includes("Michal Krpálek"), "Chybí kandidát Michal Krpálek pro nejednoznačné příjmení.");
assert(app.includes("Jiří Krpálek"), "Chybí kandidát Jiří Krpálek pro nejednoznačné příjmení.");
assert(app.includes("Martin Němec"), "Chybí kandidát Martin Němec pro nejednoznačné příjmení.");
assert(app.includes("personSearchTerm"), "Frontend neumí hledat celé jméno jako přesnou frázi.");
assert(html.includes("person-context"), "Formulář nemá viditelné pole pro upřesnění osoby.");
assert(html.includes("<details class=\"advanced-field\">"), "Přesná citace není schovaná v rozbalovací části.");
assert(app.includes("personContextInput"), "Frontend nečte pole pro upřesnění osoby.");
assert(app.includes("filters.personContext"), "Frontend nepoužívá upřesnění osoby v dotazu.");
assert((await text(files.api)).includes("personSearchTerm"), "Backend neumí hledat celé jméno jako přesnou frázi.");
assert((await text(files.api)).includes("filters.personContext"), "Backend nepoužívá upřesnění osoby v dotazu.");
assert((await text(files.api)).includes("Zeppelin CZ"), "Backend neumí doplnit firemní souvislosti pro Martina Němce.");
assert((await text(files.api)).includes("linkedin.com"), "Backend neprohledává LinkedIn a profesní profily.");
assert((await text(files.api)).includes("company"), "Backend neumí samostatně řadit firemní zdroje.");
assert((await text(files.api)).includes("slice(0, 48)"), "Backend nezkouší dostatečný počet dotazových kombinací.");
assert((await text(files.api)).includes("limit * 5"), "Backend nesbírá dost kandidátů před řazením.");
assert(app.includes("LinkedIn"), "Frontend nemá záložní odkaz na LinkedIn.");
assert(app.includes("Firemní weby a magazíny"), "Frontend nemá záložní odkaz na firemní magazíny.");
assert(app.includes("Zeppelin CZ / Caterpillar"), "Frontend nemá záložní odkaz na Zeppelin/Caterpillar.");
assert(app.includes("looksLikeDisambiguation"), "Frontend neumí rozpoznat rozcestníkový profil osoby.");
assert(app.includes("personStanceSummary"), "Profil osoby neumí zobrazit stručný soupis postojů v čase.");
assert(app.includes("renderYearChangeDetail"), "Klik na rok neumí zobrazit, v čem je naznačený posun.");
assert(app.includes("formatDate(record.date)"), "Chronologie citací nezobrazuje datum vydání článku.");
assert(styles.includes(".person-avatar img"), "Chybí styl pro veřejnou fotografii osoby.");
assert(styles.includes(".candidate-card"), "Chybí styl pro výběr více možných osob.");
assert(styles.includes(".advanced-field"), "Chybí styl pro rozbalovací přesnou citaci.");
assert(styles.includes(".person-stance-summary"), "Chybí styl pro soupis postojů v profilu.");
assert(styles.includes(".year-change-detail"), "Chybí styl pro detail označeného roku.");
assert(styles.includes(".year-chip.has-stance-shift"), "Chybí styl pro marker možné změny postoje na časové ose.");
assert(styles.includes("blockquote.is-missing"), "Chybí vizuální styl pro nedoplněný výňatek.");
assert(styles.includes("--year-intensity"), "Chybí vizuální intenzita roků v časové ose.");
assert(styles.includes("source-summary"), "Chybí styl pro viditelný souhrn zdrojů.");

const visibleSurface = [html, app, readme].join("\n");
for (const term of forbiddenVisibleTerms) {
  assert(!visibleSurface.includes(term), `Nalezen zakázaný viditelný termín: ${term}`);
}

parseCheck(files.app, app);
parseCheck(files.api, await text(files.api));
parseCheck(files.server, await text(files.server));

console.log(`Kontrola aplikace prošla pro verzi ${APP_VERSION}.`);
