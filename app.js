const form = document.querySelector("#search-form");
const personInput = document.querySelector("#person");
const quoteInput = document.querySelector("#quote");
const keywordsInput = document.querySelector("#keywords");
const dateFromInput = document.querySelector("#date-from");
const dateToInput = document.querySelector("#date-to");
const sourceInput = document.querySelector("#source");
const sourceTypeInput = document.querySelector("#source-type");
const resultTitle = document.querySelector("#result-title");
const sourceLinks = document.querySelector("#source-links");
const timeline = document.querySelector("#timeline");
const quoteCards = document.querySelector("#quote-cards");
const quoteCardsSection = document.querySelector("#quote-cards-section");
const emptyState = document.querySelector("#empty-state");
const summaryCard = document.querySelector("#summary-card");
const summaryText = document.querySelector("#summary-text");
const sampleButton = document.querySelector("#sample-btn");
const clearButton = document.querySelector("#clear-btn");
const timelineTemplate = document.querySelector("#timeline-item-template");
const quoteCardTemplate = document.querySelector("#quote-card-template");

const sampleRecords = [
  {
    date: "2014-03-04",
    type: "Rozhovor",
    title: "Ukázkový archivní rozhovor k tématu",
    source: "Mediální archiv",
    quote: "Krátká ukázková citace z rozhovoru, která se vztahuje k zadanému tématu.",
    relevance: "Zdroj je relevantní, protože obsahuje přímé vyjádření osoby v dřívějším období.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+rozhovor+2014"
  },
  {
    date: "2018-09-18",
    type: "Článek",
    title: "Ukázkový článek s kontextem k veřejnému výroku",
    source: "Zpravodajský web",
    quote: "Krátký výňatek článku popisující okolnosti a veřejně dohledatelný kontext.",
    relevance: "Článek doplňuje časovou osu a pomáhá porovnat pozdější vyjádření s předchozím kontextem.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+2018"
  },
  {
    date: "2022-04-15",
    type: "Tisková zpráva",
    title: "Ukázková tisková zpráva veřejné instituce",
    source: "Veřejná databáze",
    quote: "Krátká citace z oficiálního sdělení nebo tiskové zprávy.",
    relevance: "Oficiální záznam může potvrdit datum, instituci a rámec události bez hodnocení osoby.",
    url: "https://www.google.com/search?q=obil%C3%AD+Ukrajina+tiskov%C3%A1+zpr%C3%A1va+2022"
  },
  {
    date: "2023-09-21",
    type: "Sociální síť",
    title: "Ukázkový veřejný příspěvek na sociální síti",
    source: "X / Facebook / veřejný profil",
    quote: "Krátká citace z veřejného příspěvku, pokud je dohledatelný a ověřitelný.",
    relevance: "Veřejný profil může být relevantní tam, kde osoba vyjádřila postoj mimo tradiční média.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+site%3Ax.com+OR+site%3Afacebook.com"
  },
  {
    date: "2024-08-05",
    type: "Investigativní web",
    title: "Ukázková investigativní analýza související s tématem",
    source: "Investigativní web",
    quote: "Krátký výňatek, který uvádí dohledatelnou souvislost nebo navazující informaci.",
    relevance: "Investigativní zdroj může upozornit na časovou návaznost, dokumenty nebo veřejně dostupná data.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+investigace"
  }
];

const searchTargets = [
  {
    label: "Běžná média napříč historií",
    build: (query, dates) => `https://www.google.com/search?q=${query}${dates.google}`
  },
  {
    label: "Google Zprávy archiv",
    build: (query) => `https://news.google.com/search?q=${query}&hl=cs&gl=CZ&ceid=CZ%3Acs`
  },
  {
    label: "Seznam vyhledávání",
    build: (query) => `https://search.seznam.cz/?q=${query}`
  },
  {
    label: "Parlamentní a veřejné databáze",
    build: (query) => `https://www.google.com/search?q=${query}+site%3Apsp.cz+OR+site%3Asenat.cz+OR+site%3Avlada.gov.cz`
  },
  {
    label: "Rozhovory a videa",
    build: (query) => `https://www.google.com/search?q=${query}+rozhovor+OR+interview+site%3Ayoutube.com`
  },
  {
    label: "Tiskové zprávy",
    build: (query) => `https://www.google.com/search?q=${query}+%22tiskov%C3%A1+zpr%C3%A1va%22+OR+%22press+release%22`
  },
  {
    label: "Sociální sítě",
    build: (query) => `https://www.google.com/search?q=${query}+site%3Ax.com+OR+site%3Atwitter.com+OR+site%3Afacebook.com+OR+site%3Ainstagram.com`
  },
  {
    label: "Investigativní weby",
    build: (query) => `https://www.google.com/search?q=${query}+investigace+OR+kauza+OR+dokumenty+OR+anal%C3%BDza`
  }
];

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${dateValue}T12:00:00`));
}

function buildQueryParts(filters) {
  const parts = [filters.person, filters.keywords];

  if (filters.quote) {
    parts.splice(1, 0, `"${filters.quote}"`);
  }

  if (filters.source) {
    parts.push(filters.source);
  }

  if (filters.sourceType) {
    parts.push(filters.sourceType);
  }

  return parts.filter(Boolean).join(" ").trim();
}

function buildDateOperators(filters) {
  const fromYear = filters.dateFrom ? new Date(`${filters.dateFrom}T12:00:00`).getFullYear() : "";
  const toYear = filters.dateTo ? new Date(`${filters.dateTo}T12:00:00`).getFullYear() : "";

  return {
    google: [fromYear ? `+after%3A${fromYear}-01-01` : "", toYear ? `+before%3A${toYear}-12-31` : ""].join("")
  };
}

function collectFilters() {
  return {
    person: personInput.value.trim(),
    quote: quoteInput.value.trim(),
    keywords: keywordsInput.value.trim(),
    dateFrom: dateFromInput.value,
    dateTo: dateToInput.value,
    source: sourceInput.value.trim(),
    sourceType: sourceTypeInput.value
  };
}

function renderSourceLinks(filters) {
  const queryText = buildQueryParts(filters);
  const query = encodeURIComponent(queryText);
  const dates = buildDateOperators(filters);
  sourceLinks.replaceChildren();

  searchTargets.forEach((target) => {
    const link = document.createElement("a");
    link.href = target.build(query, dates);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = target.label;
    sourceLinks.append(link);
  });
}

function filterRecords(records, filters) {
  return records.filter((record) => {
    const recordTime = new Date(`${record.date}T12:00:00`).getTime();
    const fromTime = filters.dateFrom ? new Date(`${filters.dateFrom}T00:00:00`).getTime() : -Infinity;
    const toTime = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59`).getTime() : Infinity;
    const sourceMatch = !filters.source || record.source.toLowerCase().includes(filters.source.toLowerCase());
    const typeMatch = !filters.sourceType || record.type === filters.sourceType;

    return recordTime >= fromTime && recordTime <= toTime && sourceMatch && typeMatch;
  });
}

function renderQuoteCards(records) {
  quoteCards.replaceChildren();

  records.slice(0, 4).forEach((record) => {
    const card = quoteCardTemplate.content.cloneNode(true);
    card.querySelector(".type-badge").textContent = record.type;
    card.querySelector("time").dateTime = record.date;
    card.querySelector("time").textContent = `${formatDate(record.date)} · ${record.source}`;
    card.querySelector("h4").textContent = record.title;
    card.querySelector("blockquote").textContent = record.quote;
    card.querySelector(".relevance").textContent = record.relevance;

    const link = card.querySelector("a");
    link.href = record.url;
    link.textContent = "Otevřít celý zdroj";

    quoteCards.append(card);
  });

  quoteCardsSection.classList.toggle("hidden", records.length === 0);
}

function renderTimeline(records) {
  timeline.replaceChildren();

  records
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((record) => {
      const item = timelineTemplate.content.cloneNode(true);
      item.querySelector(".date-pill").textContent = formatDate(record.date);
      item.querySelector(".type-badge").textContent = record.type;
      item.querySelector("time").dateTime = record.date;
      item.querySelector("time").textContent = record.source;
      item.querySelector("h4").textContent = record.title;
      item.querySelector("blockquote").textContent = record.quote;
      item.querySelector(".source-name").textContent = record.source;
      item.querySelector(".relevance").textContent = record.relevance;

      const link = item.querySelector("a");
      link.href = record.url;
      link.textContent = "Otevřít celý článek / zdroj";

      timeline.append(item);
    });
}

function renderSummary(filters, records) {
  const period = [filters.dateFrom || "nejstarší dostupné zdroje", filters.dateTo || "současnost"].join(" až ");
  const types = records.length ? [...new Set(records.map((record) => record.type.toLowerCase()))].join(", ") : "žádné ukázkové typy";
  summaryText.textContent = `Dotaz porovnává veřejné zdroje pro "${filters.person}" a téma "${filters.keywords}" v období ${period}. Nalezené nebo připravené záznamy jsou typu ${types}. Shrnutí neurčuje, zda je výrok pravdivý; upozorňuje pouze na dohledatelné souvislosti, návaznosti, možné rozpory a nedostatek dat.`;
  summaryCard.classList.remove("hidden");
}

function runSearch(filters, records = sampleRecords) {
  const filteredRecords = filterRecords(records, filters);
  resultTitle.textContent = `${filters.person}: ${filters.keywords}`;
  renderSourceLinks(filters);
  renderQuoteCards(filteredRecords);
  renderTimeline(filteredRecords);
  renderSummary(filters, filteredRecords);
  emptyState.classList.add("hidden");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const filters = collectFilters();

  if (!filters.person || !filters.keywords) {
    return;
  }

  runSearch(filters);
});

sampleButton.addEventListener("click", () => {
  personInput.value = "Andrej Babiš";
  quoteInput.value = "obilí z Ukrajiny";
  keywordsInput.value = "obilí Ukrajina";
  dateFromInput.value = "2010-01-01";
  dateToInput.value = "2026-06-16";
  sourceInput.value = "";
  sourceTypeInput.value = "";
  runSearch(collectFilters());
});

clearButton.addEventListener("click", () => {
  form.reset();
  sourceLinks.replaceChildren();
  timeline.replaceChildren();
  quoteCards.replaceChildren();
  resultTitle.textContent = "Zadejte osobu, výrok a téma";
  summaryCard.classList.add("hidden");
  quoteCardsSection.classList.add("hidden");
  emptyState.classList.remove("hidden");
  renderSourceLinks({
    person: "Veřejná osoba",
    quote: "",
    keywords: "klíčová slova",
    dateFrom: "",
    dateTo: "",
    source: "",
    sourceType: ""
  });
});

renderSourceLinks({
  person: "Veřejná osoba",
  quote: "",
  keywords: "klíčová slova",
  dateFrom: "",
  dateTo: "",
  source: "",
  sourceType: ""
});
