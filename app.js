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
    title: "Archivní rozhovor k tématu",
    source: "Mediální archiv",
    excerpt: "",
    relevance: "Zdroj je relevantní, protože může obsahovat přímé vyjádření osoby v dřívějším období.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+rozhovor+2014"
  },
  {
    date: "2018-09-18",
    type: "Článek",
    title: "Článek s kontextem k veřejnému výroku",
    source: "Zpravodajský web",
    excerpt: "",
    relevance: "Článek může doplnit časovou osu a pomoci porovnat pozdější vyjádření s předchozím kontextem.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+2018"
  },
  {
    date: "2022-04-15",
    type: "Tisková zpráva",
    title: "Tisková zpráva veřejné instituce",
    source: "Veřejná databáze",
    excerpt: "",
    relevance: "Oficiální záznam může potvrdit datum, instituci a rámec události bez hodnocení osoby.",
    url: "https://www.google.com/search?q=obil%C3%AD+Ukrajina+tiskov%C3%A1+zpr%C3%A1va+2022"
  },
  {
    date: "2023-09-21",
    type: "Sociální síť",
    title: "Veřejný příspěvek na sociální síti",
    source: "X / Facebook / veřejný profil",
    excerpt: "",
    relevance: "Veřejný profil může být relevantní tam, kde osoba vyjádřila postoj mimo tradiční média.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+site%3Ax.com+OR+site%3Afacebook.com"
  },
  {
    date: "2024-08-05",
    type: "Investigativní web",
    title: "Investigativní analýza související s tématem",
    source: "Investigativní web",
    excerpt: "",
    relevance: "Investigativní zdroj může upozornit na časovou návaznost, dokumenty nebo veřejně dostupná data.",
    url: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+investigace"
  }
];

const searchTargets = [
  {
    label: "Běžná média",
    type: "Článek",
    build: (query, dates) => `https://www.google.com/search?q=${query}${dates.google}`
  },
  {
    label: "iROZHLAS",
    type: "Článek",
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Airozhlas.cz${dates.google}`
  },
  {
    label: "ČT24",
    type: "Článek",
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Act24.ceskatelevize.cz${dates.google}`
  },
  {
    label: "ČTK / České noviny",
    type: "Článek",
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Aceskenoviny.cz${dates.google}`
  },
  {
    label: "Google Zprávy",
    type: "Článek",
    build: (query) => `https://news.google.com/search?q=${query}&hl=cs&gl=CZ&ceid=CZ%3Acs`
  },
  {
    label: "Seznam vyhledávání",
    type: "Článek",
    build: (query) => `https://search.seznam.cz/?q=${query}`
  },
  {
    label: "Parlamentní a veřejné databáze",
    type: "Tisková zpráva",
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Apsp.cz+OR+site%3Asenat.cz+OR+site%3Avlada.gov.cz${dates.google}`
  },
  {
    label: "Rozhovory a videa",
    type: "Rozhovor",
    build: (query, dates) => `https://www.google.com/search?q=${query}+rozhovor+OR+interview+site%3Ayoutube.com${dates.google}`
  },
  {
    label: "Tiskové zprávy",
    type: "Tisková zpráva",
    build: (query, dates) => `https://www.google.com/search?q=${query}+%22tiskov%C3%A1+zpr%C3%A1va%22+OR+%22press+release%22${dates.google}`
  },
  {
    label: "Sociální sítě",
    type: "Sociální síť",
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Ax.com+OR+site%3Atwitter.com+OR+site%3Afacebook.com+OR+site%3Ainstagram.com${dates.google}`
  },
  {
    label: "Investigativní a analytické zdroje",
    type: "Investigativní web",
    build: (query, dates) => `https://www.google.com/search?q=${query}+investigace+OR+anal%C3%BDza+OR+dokumenty+site%3Ainvestigace.cz+OR+site%3Ahlidacipes.org+OR+site%3Arespekt.cz${dates.google}`
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

  if (filters.exactQuote) {
    parts.splice(1, 0, `"${filters.exactQuote}"`);
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

function describePeriod(filters) {
  if (!filters.dateFrom && !filters.dateTo) {
    return "od začátku veřejně dostupného webu do současnosti";
  }

  return [filters.dateFrom || "od začátku veřejně dostupného webu", filters.dateTo || "současnost"].join(" až ");
}

function collectFilters() {
  return {
    person: personInput.value.trim(),
    exactQuote: quoteInput.value.trim(),
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

function buildGeneratedRecords(filters) {
  const queryText = buildQueryParts(filters);
  const query = encodeURIComponent(queryText);
  const dates = buildDateOperators(filters);
  const period = describePeriod(filters);

  return searchTargets
    .filter((target) => !filters.sourceType || target.type === filters.sourceType)
    .filter((target) => !filters.source || target.label.toLowerCase().includes(filters.source.toLowerCase()))
    .map((target) => ({
      date: "",
      dateLabel: "všechny roky",
      type: target.type,
      title: target.label,
      source: target.label,
      excerpt: "",
      relevance: `Tento zdroj je relevantní pro ověření veřejně dohledatelných výroků a kontextu k tématu "${filters.keywords}" v období ${period}, bez použití bulvárních nebo dezinformačních webů.`,
      url: target.build(query, dates)
    }));
}

function excerptFor(record) {
  return record.excerpt && record.excerpt.trim() ? record.excerpt.trim() : "Výňatek zatím není doplněn";
}

function filterRecords(records, filters) {
  return records.filter((record) => {
    const recordTime = record.date ? new Date(`${record.date}T12:00:00`).getTime() : 0;
    const fromTime = filters.dateFrom ? new Date(`${filters.dateFrom}T00:00:00`).getTime() : -Infinity;
    const toTime = filters.dateTo ? new Date(`${filters.dateTo}T23:59:59`).getTime() : Infinity;
    const sourceMatch = !filters.source || record.source.toLowerCase().includes(filters.source.toLowerCase());
    const typeMatch = !filters.sourceType || record.type === filters.sourceType;
    const dateMatch = record.date ? recordTime >= fromTime && recordTime <= toTime : true;

    return dateMatch && sourceMatch && typeMatch;
  });
}

function renderQuoteCards(records) {
  quoteCards.replaceChildren();

  records.slice(0, 4).forEach((record) => {
    const card = quoteCardTemplate.content.cloneNode(true);
    card.querySelector(".type-badge").textContent = record.type;
    card.querySelector("time").dateTime = record.date || "";
    card.querySelector("time").textContent = `${record.dateLabel || formatDate(record.date)} · ${record.source}`;
    card.querySelector("h4").textContent = record.title;
    card.querySelector("blockquote").textContent = excerptFor(record);
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
      item.querySelector(".date-pill").textContent = record.dateLabel || formatDate(record.date);
      item.querySelector(".type-badge").textContent = record.type;
      item.querySelector("time").dateTime = record.date || "";
      item.querySelector("time").textContent = record.source;
      item.querySelector("h4").textContent = record.title;
      item.querySelector("blockquote").textContent = excerptFor(record);
      item.querySelector(".source-name").textContent = record.source;
      item.querySelector(".relevance").textContent = record.relevance;

      const link = item.querySelector("a");
      link.href = record.url;
      link.textContent = "Otevřít celý zdroj";

      timeline.append(item);
    });
}

function renderSummary(filters, records) {
  const period = describePeriod(filters);
  const types = records.length ? [...new Set(records.map((record) => record.type.toLowerCase()))].join(", ") : "žádné zdroje";
  summaryText.textContent = `Dotaz porovnává veřejné zdroje pro "${filters.person}" a téma "${filters.keywords}" v období ${period}. Zobrazené položky jsou typu ${types}. Shrnutí neurčuje, zda je výrok pravdivý; upozorňuje pouze na dohledatelné souvislosti, návaznosti, možné rozpory a nedostatek dat.`;
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

  runSearch(filters, buildGeneratedRecords(filters));
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
    exactQuote: "",
    keywords: "klíčová slova",
    dateFrom: "",
    dateTo: "",
    source: "",
    sourceType: ""
  });
});

renderSourceLinks({
  person: "Veřejná osoba",
  exactQuote: "",
  keywords: "klíčová slova",
  dateFrom: "",
  dateTo: "",
  source: "",
  sourceType: ""
});
