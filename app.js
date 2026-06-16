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
const aiStatus = document.querySelector("#ai-status");
const topicIntro = document.querySelector("#topic-intro");
const topicIntroTitle = document.querySelector("#topic-intro-title");
const topicIntroText = document.querySelector("#topic-intro-text");
const recommendedSection = document.querySelector("#recommended-section");
const recommendedList = document.querySelector("#recommended-list");
const yearSection = document.querySelector("#year-section");
const yearFilter = document.querySelector("#year-filter");
const relatedSection = document.querySelector("#related-section");
const relatedTopics = document.querySelector("#related-topics");
const statementsSection = document.querySelector("#statements-section");
const statementsList = document.querySelector("#statements-list");
const sampleButton = document.querySelector("#sample-btn");
const clearButton = document.querySelector("#clear-btn");
const timelineTemplate = document.querySelector("#timeline-item-template");
const quoteCardTemplate = document.querySelector("#quote-card-template");
const RESULT_LIMIT = 30;
const EXCERPT_LIMIT = 260;
const AI_RESEARCH_ENDPOINT = "api/research";
const DEFAULT_YEARS = [1998, 2005, 2011, 2014, 2017, 2021, 2026];

const TERM_EXPANSIONS = [
  {
    triggers: ["rom", "romove", "romsky", "romska"],
    terms: ["Romové", "romský", "romská menšina", "Cikán", "Cikáni"]
  },
  {
    triggers: ["migrant", "migranti", "migrace"],
    terms: ["migrace", "uprchlík", "uprchlíci", "azylant", "azylanti"]
  }
];

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
    priority: 78,
    group: "top",
    tags: ["Článek", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}${dates.google}`
  },
  {
    label: "iROZHLAS",
    type: "Článek",
    priority: 96,
    group: "top",
    tags: ["Článek", "Rozhlas"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Airozhlas.cz${dates.google}`
  },
  {
    label: "ČT24",
    type: "Článek",
    priority: 94,
    group: "top",
    tags: ["Televize", "Článek"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Act24.ceskatelevize.cz${dates.google}`
  },
  {
    label: "ČTK / České noviny",
    type: "Článek",
    priority: 92,
    group: "top",
    tags: ["Článek", "ČTK"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Aceskenoviny.cz${dates.google}`
  },
  {
    label: "Google Zprávy",
    type: "Článek",
    priority: 82,
    group: "top",
    tags: ["Článek"],
    build: (query) => `https://news.google.com/search?q=${query}&hl=cs&gl=CZ&ceid=CZ%3Acs`
  },
  {
    label: "Seznam vyhledávání",
    type: "Článek",
    priority: 70,
    group: "top",
    tags: ["Článek"],
    build: (query) => `https://search.seznam.cz/?q=${query}`
  },
  {
    label: "Parlamentní a veřejné databáze",
    type: "Tisková zpráva",
    priority: 90,
    group: "top",
    tags: ["Parlament", "Tisková zpráva"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Apsp.cz+OR+site%3Asenat.cz+OR+site%3Avlada.gov.cz${dates.google}`
  },
  {
    label: "Rozhovory a videa",
    type: "Rozhovor",
    priority: 74,
    group: "archive",
    tags: ["Rozhovor", "Video", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+rozhovor+OR+interview+site%3Ayoutube.com${dates.google}`
  },
  {
    label: "Tiskové zprávy",
    type: "Tisková zpráva",
    priority: 76,
    group: "archive",
    tags: ["Tisková zpráva", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+%22tiskov%C3%A1+zpr%C3%A1va%22+OR+%22press+release%22${dates.google}`
  },
  {
    label: "Sociální sítě",
    type: "Sociální síť",
    priority: 66,
    group: "archive",
    tags: ["Sociální síť", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Ax.com+OR+site%3Atwitter.com+OR+site%3Afacebook.com+OR+site%3Ainstagram.com${dates.google}`
  },
  {
    label: "Investigativní a analytické zdroje",
    type: "Investigativní web",
    priority: 86,
    group: "top",
    tags: ["Investigativa", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+investigace+OR+anal%C3%BDza+OR+dokumenty+site%3Ainvestigace.cz+OR+site%3Ahlidacipes.org+OR+site%3Arespekt.cz${dates.google}`
  },
  {
    label: "Archiv starších článků",
    type: "Článek",
    priority: 58,
    group: "archive",
    tags: ["Článek", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+archiv+OR+star%C5%A1%C3%AD+%C4%8Dl%C3%A1nek${dates.google}`
  },
  {
    label: "Starší rozhovory",
    type: "Rozhovor",
    priority: 56,
    group: "archive",
    tags: ["Rozhovor", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+star%C5%A1%C3%AD+rozhovor+OR+archiv+rozhovor${dates.google}`
  },
  {
    label: "Archiv institucí",
    type: "Tisková zpráva",
    priority: 54,
    group: "archive",
    tags: ["Tisková zpráva", "Parlament", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+archiv+site%3Avlada.gov.cz+OR+site%3Amvcr.cz+OR+site%3Apsp.cz${dates.google}`
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

function stripDiacritics(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function uniqueTerms(terms) {
  const seen = new Set();
  return terms.filter((term) => {
    const key = stripDiacritics(term).toLowerCase().trim();
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function expandSearchTerms(query) {
  const original = query.trim();
  const normalized = stripDiacritics(original).toLowerCase();
  const terms = [original];

  TERM_EXPANSIONS.forEach((entry) => {
    if (entry.triggers.some((trigger) => normalized.includes(trigger))) {
      terms.push(...entry.terms);
    }
  });

  original.split(/\s+/).forEach((part) => {
    const plain = stripDiacritics(part);
    if (plain !== part) {
      terms.push(plain);
    }
  });

  const plainOriginal = stripDiacritics(original);
  if (plainOriginal !== original) {
    terms.push(plainOriginal);
  }

  return uniqueTerms(terms);
}

function buildSearchQuery(filters, term, person = filters.person) {
  const parts = [person, term];

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
  const searchTerms = expandSearchTerms(filters.keywords);
  const personTerms = uniqueTerms([filters.person, stripDiacritics(filters.person)]);
  const dates = buildDateOperators(filters);
  const period = describePeriod(filters);

  return personTerms.flatMap((personTerm, personIndex) => searchTerms.flatMap((term, termIndex) => {
    const queryText = buildSearchQuery(filters, term, personTerm);
    const query = encodeURIComponent(queryText);
    const isExact = termIndex === 0 && personIndex === 0;
    const termWeight = termIndex === 0 ? 160 : Math.max(35, 70 - termIndex * 6);
    const personWeight = personIndex === 0 ? 20 : 8;
    const matchLabel = isExact
      ? "nalezeno podle přesného dotazu"
      : `nalezeno podle souvisejícího výrazu: ${queryText}`;

    return searchTargets
    .filter((target) => !filters.sourceType || target.type === filters.sourceType)
    .filter((target) => !filters.source || target.label.toLowerCase().includes(filters.source.toLowerCase()))
    .map((target) => ({
      date: "",
      dateLabel: "všechny roky",
      type: target.type,
      title: target.label,
      source: target.label,
      sourceGroup: target.group,
      tags: target.tags || [target.type],
      matchedTerm: term,
      matchType: isExact ? "exact" : "related",
      matchLabel: `${target.group === "top" ? "TOP zdroj" : "Archivní/starší zdroj"} · ${matchLabel}`,
      relevanceScore: target.priority + termWeight + personWeight + (target.group === "top" ? 20 : 0),
      excerpt: "",
      relevance: journalisticRelevance(target, filters),
      timeContext: timeContextFor(target, filters),
      scoreLabel: scoreLabelFor(target.priority + termWeight + personWeight + (target.group === "top" ? 20 : 0)),
      url: target.build(query, dates)
    }));
  }))
    .sort((a, b) => {
      const groupDiff = (a.sourceGroup === "top" ? 0 : 1) - (b.sourceGroup === "top" ? 0 : 1);
      return groupDiff || b.relevanceScore - a.relevanceScore;
    })
    .slice(0, RESULT_LIMIT);
}

function journalisticRelevance(target, filters) {
  const person = filters.person || "sledovaná osoba";
  const topic = filters.keywords || "tématu";

  if (target.type === "Rozhovor") {
    return `Rozhovor může obsahovat přímé vyjádření osoby ${person} k tématu ${topic} z daného období.`;
  }

  if (target.type === "Tisková zpráva") {
    return `Oficiální dokument přináší veřejně dostupné informace vztahující se k tématu ${topic}.`;
  }

  if (target.type === "Sociální síť") {
    return `Veřejný příspěvek může zachytit bezprostřední reakci osoby ${person} nebo dalších aktérů.`;
  }

  if (target.type === "Investigativní web") {
    return `Investigativní článek může shrnovat známá fakta a souvislosti případu.`;
  }

  if (target.group === "archive") {
    return `Archivní zdroj ukazuje, jak se o tématu ${topic} psalo nebo mluvilo v minulosti.`;
  }

  return `Článek zachycuje průběh tématu ${topic} a reakce hlavních aktérů.`;
}

function scoreLabelFor(score) {
  if (score >= 260) {
    return "★★★★★ Velmi relevantní";
  }

  if (score >= 220) {
    return "★★★★ Relevantní";
  }

  return "★★★ Doplňující zdroj";
}

function timeContextFor(target, filters) {
  if (filters.dateFrom || filters.dateTo) {
    const period = describePeriod(filters);
    return `Zdroj je zaměřený na období ${period}.`;
  }

  if (target.type === "Rozhovor") {
    return "Rozhovor může pocházet z období před současnou debatou.";
  }

  if (target.group === "archive") {
    return "Archivní zdroj pomáhá zasadit téma do staršího časového kontextu.";
  }

  return "Zdroj zachycuje téma v době veřejné debaty.";
}

function topicIntroFor(filters, records) {
  const topic = filters.keywords;
  const period = describePeriod(filters);
  return {
    title: topic,
    text: `K tématu ${topic} bylo připraveno ${records.length} relevantních zdrojů v období ${period}. Níže jsou řazeny veřejně dostupné články, rozhovory, dokumenty a další zdroje bez hodnocení osob.`
  };
}

function relatedTopicsFor(filters) {
  const terms = expandSearchTerms(filters.keywords).filter((term) => term !== filters.keywords);
  const base = [filters.person, ...terms].filter(Boolean);
  const defaults = ["související kauza", "veřejná debata", "oficiální dokumenty", "rozhovory"];
  return uniqueTerms([...base, ...defaults]).slice(0, 8);
}

function yearsFor(records) {
  const years = records
    .map((record) => record.date ? new Date(`${record.date}T12:00:00`).getFullYear() : null)
    .filter(Boolean);

  return years.length ? [...new Set(years)].sort((a, b) => a - b) : DEFAULT_YEARS;
}

function excerptFor(record) {
  const excerpt = record.excerpt && record.excerpt.trim();

  if (!excerpt) {
    return "AI výňatek zatím není k dispozici. Po připojení rešeršního backendu se tady zobrazí krátká pasáž, která nejlépe vystihuje zdroj.";
  }

  if (excerpt.length <= EXCERPT_LIMIT) {
    return excerpt;
  }

  const shortened = excerpt.slice(0, EXCERPT_LIMIT);
  const lastSpace = shortened.lastIndexOf(" ");
  const cleanCut = lastSpace > 180 ? shortened.slice(0, lastSpace) : shortened;

  return `${cleanCut.trim()}…`;
}

function setAiStatus(message, state = "") {
  aiStatus.textContent = message;
  aiStatus.className = `ai-status ${state}`.trim();
  aiStatus.classList.toggle("hidden", !message);
}

function normalizeAiRecord(record, index) {
  return {
    date: record.date || "",
    dateLabel: record.date ? "" : "AI zdroj",
    type: record.type || "Článek",
    title: record.title || record.source || `AI zdroj ${index + 1}`,
    source: record.source || "Neznámý zdroj",
    sourceGroup: record.sourceGroup || (index < 12 ? "top" : "archive"),
    tags: record.tags || [record.type || "Článek"],
    matchedTerm: record.matchedTerm || "",
    matchType: record.matchType || "exact",
    matchLabel: record.matchLabel || "nalezeno AI rešerší",
    relevanceScore: Number(record.relevanceScore || 0),
    excerpt: record.excerpt || "",
    relevance: record.relevance || "AI označila zdroj jako relevantní k zadané osobě, tématu a časovému kontextu.",
    timeContext: record.timeContext || "Zdroj zachycuje téma v časovém kontextu veřejné debaty.",
    scoreLabel: record.scoreLabel || scoreLabelFor(Number(record.relevanceScore || 0)),
    statementQuote: record.statementQuote || "",
    url: record.url || "#"
  };
}

async function fetchAiRecords(filters) {
  if (window.location.protocol === "file:") {
    setAiStatus("AI výňatky vyžadují backend. Při otevření přes soubor se zobrazují jen zdrojové odkazy.", "is-warning");
    return null;
  }

  setAiStatus("AI rešerše hledá zdroje a krátké výňatky…", "is-loading");

  try {
    const response = await fetch(AI_RESEARCH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filters,
        expandedTerms: expandSearchTerms(filters.keywords),
        limit: RESULT_LIMIT,
        rules: {
          maxExcerptChars: EXCERPT_LIMIT,
          noFullArticles: true,
          neutralOnly: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`AI backend returned ${response.status}`);
    }

    const payload = await response.json();
    const records = Array.isArray(payload.records) ? payload.records : [];

    if (!records.length) {
      setAiStatus("AI backend nevrátil žádné zdroje. Zůstávají zobrazené připravené odkazy.", "is-warning");
      return null;
    }

    setAiStatus(`AI doplnila ${Math.min(records.length, RESULT_LIMIT)} zdrojů s krátkými výňatky.`, "is-ready");
    return records.slice(0, RESULT_LIMIT).map(normalizeAiRecord);
  } catch (error) {
    setAiStatus("AI backend zatím není připojený. Zobrazují se zdrojové odkazy připravené pro rešerši.", "is-warning");
    return null;
  }
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

  records.slice(0, RESULT_LIMIT).forEach((record) => {
    const card = quoteCardTemplate.content.cloneNode(true);
    card.querySelector(".type-badge").textContent = record.type;
    card.querySelector("time").dateTime = record.date || "";
    card.querySelector("time").textContent = `${record.dateLabel || formatDate(record.date)} · ${record.source}`;
    card.querySelector("h4").textContent = record.title;
    card.querySelector(".match-note").textContent = record.matchLabel || "nalezeno podle přesného dotazu";
    card.querySelector(".score-label").textContent = record.scoreLabel || scoreLabelFor(record.relevanceScore || 0);
    card.querySelector(".time-context").textContent = record.timeContext || "Zdroj zachycuje téma v časovém kontextu veřejné debaty.";
    renderTags(card.querySelector(".tag-list"), record.tags || [record.type]);
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
    .sort((a, b) => {
      const groupDiff = (a.sourceGroup === "top" ? 0 : 1) - (b.sourceGroup === "top" ? 0 : 1);
      return groupDiff || (b.relevanceScore || 0) - (a.relevanceScore || 0);
    })
    .forEach((record) => {
      const item = timelineTemplate.content.cloneNode(true);
      item.querySelector(".date-pill").textContent = record.dateLabel || formatDate(record.date);
      item.querySelector(".type-badge").textContent = record.type;
      item.querySelector("time").dateTime = record.date || "";
      item.querySelector("time").textContent = record.source;
      item.querySelector("h4").textContent = record.title;
      item.querySelector(".match-note").textContent = record.matchLabel || "nalezeno podle přesného dotazu";
      item.querySelector(".score-label").textContent = record.scoreLabel || scoreLabelFor(record.relevanceScore || 0);
      item.querySelector(".time-context").textContent = record.timeContext || "Zdroj zachycuje téma v časovém kontextu veřejné debaty.";
      renderTags(item.querySelector(".tag-list"), record.tags || [record.type]);
      item.querySelector("blockquote").textContent = excerptFor(record);
      item.querySelector(".source-name").textContent = record.source;
      item.querySelector(".relevance").textContent = record.relevance;

      const link = item.querySelector("a");
      link.href = record.url;
      link.textContent = "Otevřít celý zdroj";

      timeline.append(item);
    });
}

function renderTags(container, tags) {
  container.replaceChildren();
  tags.slice(0, 5).forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.className = "tag";
    tagEl.textContent = tag;
    container.append(tagEl);
  });
}

function renderTopicIntro(filters, records) {
  const intro = topicIntroFor(filters, records);
  topicIntroTitle.textContent = intro.title;
  topicIntroText.textContent = intro.text;
  topicIntro.classList.remove("hidden");
}

function renderRecommended(records) {
  recommendedList.replaceChildren();

  records.slice(0, 3).forEach((record) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const note = document.createElement("p");

    link.href = record.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = record.title;
    note.textContent = `${record.scoreLabel || scoreLabelFor(record.relevanceScore || 0)} · ${record.relevance}`;

    item.append(link, note);
    recommendedList.append(item);
  });

  recommendedSection.classList.toggle("hidden", records.length === 0);
}

function renderYearFilter(records, filters) {
  yearFilter.replaceChildren();

  yearsFor(records).forEach((year) => {
    const button = document.createElement("button");
    const isActive = filters.dateFrom === `${year}-01-01` && filters.dateTo === `${year}-12-31`;
    button.type = "button";
    button.className = `year-chip ${isActive ? "is-active" : ""}`.trim();
    button.dataset.year = String(year);
    button.textContent = String(year);
    yearFilter.append(button);
  });

  yearSection.classList.remove("hidden");
}

function renderRelatedTopics(filters) {
  relatedTopics.replaceChildren();

  relatedTopicsFor(filters).forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "related-chip";
    button.dataset.topic = topic;
    button.textContent = topic;
    relatedTopics.append(button);
  });

  relatedSection.classList.remove("hidden");
}

function renderStatements(records) {
  statementsList.replaceChildren();

  const statements = records
    .filter((record) => record.statementQuote || record.type === "Rozhovor")
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
    .slice(0, 8);

  if (!statements.length) {
    const empty = document.createElement("div");
    const title = document.createElement("strong");
    const note = document.createElement("p");
    empty.className = "statement-item";
    title.textContent = "Zatím nejsou doplněné konkrétní citace.";
    note.textContent = "Jakmile budou k tématu dostupné výroky stejné osoby, zobrazí se zde chronologicky.";
    empty.append(title, note);
    statementsList.append(empty);
    statementsSection.classList.remove("hidden");
    return;
  }

  statements.forEach((record) => {
    const item = document.createElement("div");
    const title = document.createElement("strong");
    const quote = document.createElement("p");
    const year = record.date ? new Date(`${record.date}T12:00:00`).getFullYear() : "bez data";
    item.className = "statement-item";
    title.textContent = String(year);
    quote.textContent = record.statementQuote || excerptFor(record);
    item.append(title, quote);
    statementsList.append(item);
  });

  statementsSection.classList.remove("hidden");
}

function renderSummary(filters, records) {
  const period = describePeriod(filters);
  const types = records.length ? [...new Set(records.map((record) => record.type.toLowerCase()))].join(", ") : "žádné zdroje";
  summaryText.textContent = `Přehled ukazuje veřejně dostupné zdroje k tématu "${filters.keywords}" a osobě ${filters.person} v období ${period}. Zdroje jsou seřazené podle čtenářské důležitosti; nahoře jsou hlavní články a dokumenty, níže archivní a doplňující materiály.`;
  summaryCard.classList.remove("hidden");
}

function runSearch(filters, records = sampleRecords) {
  const filteredRecords = filterRecords(records, filters);
  resultTitle.textContent = `${filters.person}: ${filters.keywords}`;
  renderSourceLinks(filters);
  renderTopicIntro(filters, filteredRecords);
  renderRecommended(filteredRecords);
  renderYearFilter(filteredRecords, filters);
  renderRelatedTopics(filters);
  renderStatements(filteredRecords);
  renderQuoteCards(filteredRecords);
  renderTimeline(filteredRecords);
  renderSummary(filters, filteredRecords);
  emptyState.classList.add("hidden");
}

yearFilter.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-year]");
  if (!button) {
    return;
  }

  const year = button.dataset.year;
  dateFromInput.value = `${year}-01-01`;
  dateToInput.value = `${year}-12-31`;
  runSearch(collectFilters(), buildGeneratedRecords(collectFilters()));
});

relatedTopics.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-topic]");
  if (!button) {
    return;
  }

  keywordsInput.value = button.dataset.topic;
  runSearch(collectFilters(), buildGeneratedRecords(collectFilters()));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const filters = collectFilters();

  if (!filters.person || !filters.keywords) {
    return;
  }

  runSearch(filters, buildGeneratedRecords(filters));

  const aiRecords = await fetchAiRecords(filters);
  if (aiRecords) {
    runSearch(filters, aiRecords);
  }
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
  topicIntro.classList.add("hidden");
  recommendedSection.classList.add("hidden");
  yearSection.classList.add("hidden");
  relatedSection.classList.add("hidden");
  statementsSection.classList.add("hidden");
  setAiStatus("");
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
