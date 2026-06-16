const form = document.querySelector("#search-form");
const personInput = document.querySelector("#person");
const keywordsInput = document.querySelector("#keywords");
const resultTitle = document.querySelector("#result-title");
const sourceLinks = document.querySelector("#source-links");
const timeline = document.querySelector("#timeline");
const emptyState = document.querySelector("#empty-state");
const summaryCard = document.querySelector("#summary-card");
const summaryText = document.querySelector("#summary-text");
const sampleButton = document.querySelector("#sample-btn");
const clearButton = document.querySelector("#clear-btn");
const template = document.querySelector("#timeline-item-template");

const sampleRecords = [
  {
    date: "2022-04-15",
    type: "Výrok",
    quote: "Ukázková krátká citace k tématu. V ostré verzi zde bude pouze krátký úryvek ze zdroje.",
    context: "Záznam ilustruje, jak se v časové ose zobrazí přímý výrok osoby.",
    source: "Veřejný zdroj",
    url: "https://www.google.com/search?q=Andrej+Babi%C5%A1+obil%C3%AD+Ukrajina+15.04.2022"
  },
  {
    date: "2023-09-21",
    type: "Rozhovor",
    quote: "Ukázkové vyjádření z mediálního rozhovoru k tématu.",
    context: "AI může neutrálně upozornit na návaznost nebo změnu postoje, pokud je doložená zdroji.",
    source: "Mediální rozhovor",
    url: "https://www.google.com/search?q=Andrej+Babi%C5%A1+obil%C3%AD+Ukrajina+rozhovor+21.09.2023"
  },
  {
    date: "2024-03-12",
    type: "Související článek",
    quote: "Ukázkový název nebo krátká parafráze článku souvisejícího s tématem.",
    context: "Související články doplňují časovou osu, ale nejsou vydávané za výrok osoby.",
    source: "Zpravodajský zdroj",
    url: "https://www.google.com/search?q=obil%C3%AD+Ukrajina+%C4%8Cesko+12.03.2024"
  },
  {
    date: "2024-08-05",
    type: "Událost",
    quote: "Ukázková událost navazující na sledované téma.",
    context: "Události pomáhají pochopit chronologii bez určování, kdo má pravdu.",
    source: "Veřejný záznam",
    url: "https://www.google.com/search?q=obil%C3%AD+Ukrajina+%C4%8Cesko+05.08.2024"
  }
];

const sourceTemplates = [
  ["Google", (query) => `https://www.google.com/search?q=${query}`],
  ["Google Zprávy", (query) => `https://news.google.com/search?q=${query}&hl=cs&gl=CZ&ceid=CZ%3Acs`],
  ["Seznam", (query) => `https://search.seznam.cz/?q=${query}`],
  ["Poslanecká sněmovna", (query) => `https://www.google.com/search?q=${query}+site%3Apsp.cz`],
  ["Senát", (query) => `https://www.google.com/search?q=${query}+site%3Asenat.cz`],
  ["YouTube", (query) => `https://www.youtube.com/results?search_query=${query}`]
];

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${dateValue}T12:00:00`));
}

function buildQuery(person, keywords) {
  return encodeURIComponent(`${person} ${keywords}`.trim());
}

function renderSourceLinks(person, keywords) {
  const query = buildQuery(person, keywords);
  sourceLinks.replaceChildren();

  sourceTemplates.forEach(([label, buildUrl]) => {
    const link = document.createElement("a");
    link.href = buildUrl(query);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;
    sourceLinks.append(link);
  });
}

function renderTimeline(records) {
  timeline.replaceChildren();

  records
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((record) => {
      const item = template.content.cloneNode(true);
      item.querySelector(".date-pill").textContent = formatDate(record.date);
      item.querySelector(".type-badge").textContent = record.type;
      item.querySelector("time").dateTime = record.date;
      item.querySelector("time").textContent = record.source;
      item.querySelector("blockquote").textContent = record.quote;
      item.querySelector(".context").textContent = record.context;

      const link = item.querySelector("a");
      link.href = record.url;
      link.textContent = "Otevřít původní zdroj";

      timeline.append(item);
    });
}

function renderSummary(person, keywords, records) {
  const types = [...new Set(records.map((record) => record.type.toLowerCase()))].join(", ");
  summaryText.textContent = `Pro dotaz "${person} / ${keywords}" časová osa obsahuje ${records.length} ukázkové záznamy typu ${types}. Shrnutí nepřisuzuje motivaci ani pravdivost; pouze odděluje výroky, rozhovory, články a události v chronologii.`;
  summaryCard.classList.remove("hidden");
}

function runSearch(person, keywords, records = sampleRecords) {
  resultTitle.textContent = `${person}: ${keywords}`;
  renderSourceLinks(person, keywords);
  renderTimeline(records);
  renderSummary(person, keywords, records);
  emptyState.classList.add("hidden");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const person = personInput.value.trim();
  const keywords = keywordsInput.value.trim();

  if (!person || !keywords) {
    return;
  }

  runSearch(person, keywords);
});

sampleButton.addEventListener("click", () => {
  personInput.value = "Andrej Babiš";
  keywordsInput.value = "obilí Ukrajina";
  runSearch(personInput.value, keywordsInput.value);
});

clearButton.addEventListener("click", () => {
  personInput.value = "";
  keywordsInput.value = "";
  sourceLinks.replaceChildren();
  timeline.replaceChildren();
  resultTitle.textContent = "Zadejte osobu a téma";
  summaryCard.classList.add("hidden");
  emptyState.classList.remove("hidden");
});

renderSourceLinks("Veřejná osoba", "klíčová slova");
