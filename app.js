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
const personProfile = document.querySelector("#person-profile");
const personAvatar = document.querySelector("#person-avatar");
const personName = document.querySelector("#person-name");
const personDescription = document.querySelector("#person-description");
const personStanceSummary = document.querySelector("#person-stance-summary");
const personCandidates = document.querySelector("#person-candidates");
const topicIntro = document.querySelector("#topic-intro");
const topicIntroTitle = document.querySelector("#topic-intro-title");
const topicIntroText = document.querySelector("#topic-intro-text");
const topicStats = document.querySelector("#topic-stats");
const recommendedSection = document.querySelector("#recommended-section");
const recommendedList = document.querySelector("#recommended-list");
const yearSection = document.querySelector("#year-section");
const yearFilter = document.querySelector("#year-filter");
const yearChangeDetail = document.querySelector("#year-change-detail");
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
const RESEARCH_ENDPOINT = "api/research";
const DEFAULT_YEARS = [2007, 2011, 2014, 2017, 2021, 2026];
const APP_VERSION = "0.3.19";
let currentRecords = [];

const TERM_EXPANSIONS = [
  {
    triggers: ["obili", "obiln", "ukrajinske obili"],
    terms: ["obilí Ukrajina", "ukrajinské obilí", "dovoz obilí", "dovoz ukrajinského obilí", "zemědělství", "komodity", "potraviny Ukrajina"]
  },
  {
    triggers: ["digitalizace", "digitalizaci", "digitalizaci stavebniho rizeni", "dsr", "portal stavebnika"],
    terms: ["digitalizace stavebního řízení", "stavební řízení", "Portál stavebníka", "DSŘ", "MMR", "Ministerstvo pro místní rozvoj"]
  },
  {
    triggers: ["rom", "romove", "romsky", "romska"],
    terms: ["Romové", "romský", "romská menšina", "Cikán", "Cikáni"]
  },
  {
    triggers: ["migrant", "migranti", "migrace"],
    terms: ["migrace", "uprchlík", "uprchlíci", "azylant", "azylanti"]
  }
];

const PERSON_EXPANSIONS = [
  {
    triggers: ["babis", "andrej babis"],
    names: ["Andrej Babiš", "Babiš"]
  },
  {
    triggers: ["bartos", "ivan bartos"],
    names: ["Ivan Bartoš", "Bartoš"]
  },
  {
    triggers: ["fiala", "petr fiala"],
    names: ["Petr Fiala", "Fiala"]
  }
];

const PERSON_CANDIDATES = [
  {
    name: "Andrej Babiš",
    role: "politik, předseda hnutí ANO",
    aliases: ["babis", "andrej babis", "babiš", "andrej babiš"]
  },
  {
    name: "Ivan Bartoš",
    role: "politik, Česká pirátská strana",
    aliases: ["bartos", "ivan bartos", "bartoš", "ivan bartoš"]
  },
  {
    name: "Petr Fiala",
    role: "politik, ODS",
    aliases: ["fiala", "petr fiala"]
  },
  {
    name: "Radim Fiala",
    role: "politik, SPD",
    aliases: ["fiala", "radim fiala"]
  }
];

const SPELLING_TERMS = [
  "digitalizace",
  "digitalizaci",
  "stavební",
  "řízení",
  "portál",
  "stavebníka",
  "migrace",
  "uprchlík",
  "azylant",
  "romové",
  "romský"
];

const sampleRecords = [
  {
    date: "2014-03-04",
    type: "Rozhovor",
    title: "Archivní rozhovor k tématu",
    source: "Mediální archiv",
    excerpt: "",
    relevance: "Archivní rozhovor ukazuje, jak se osoba k tématu vyjadřovala v minulosti.",
    directUrl: "",
    searchUrl: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+rozhovor+2014"
  },
  {
    date: "2018-09-18",
    type: "Článek",
    title: "Článek s kontextem k veřejnému výroku",
    source: "Zpravodajský web",
    excerpt: "",
    relevance: "Článek popisuje průběh událostí a dobovou veřejnou debatu.",
    directUrl: "",
    searchUrl: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+2018"
  },
  {
    date: "2022-04-15",
    type: "Tisková zpráva",
    title: "Tisková zpráva veřejné instituce",
    source: "Veřejná databáze",
    excerpt: "",
    relevance: "Oficiální dokument obsahuje veřejně dostupné informace vztahující se k tématu.",
    directUrl: "",
    searchUrl: "https://www.google.com/search?q=obil%C3%AD+Ukrajina+tiskov%C3%A1+zpr%C3%A1va+2022"
  },
  {
    date: "2023-09-21",
    type: "Sociální síť",
    title: "Veřejný příspěvek na sociální síti",
    source: "X / Facebook / veřejný profil",
    excerpt: "",
    relevance: "Veřejný příspěvek zachycuje dobovou reakci mimo tradiční média.",
    directUrl: "",
    searchUrl: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+site%3Ax.com+OR+site%3Afacebook.com"
  },
  {
    date: "2024-08-05",
    type: "Investigativní web",
    title: "Investigativní analýza související s tématem",
    source: "Investigativní web",
    excerpt: "",
    relevance: "Investigativní zdroj může upozornit na časovou návaznost, dokumenty nebo veřejně dostupná data.",
    directUrl: "",
    searchUrl: "https://www.google.com/search?q=%22Andrej+Babi%C5%A1%22+obil%C3%AD+Ukrajina+investigace"
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
    label: "Seznam Zprávy",
    type: "Článek",
    priority: 91,
    group: "top",
    tags: ["Článek", "Analýza"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Aseznamzpravy.cz${dates.google}`
  },
  {
    label: "Aktuálně.cz",
    type: "Článek",
    priority: 89,
    group: "top",
    tags: ["Článek", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Aaktualne.cz${dates.google}`
  },
  {
    label: "Deník N",
    type: "Článek",
    priority: 88,
    group: "top",
    tags: ["Článek", "Analýza"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Adenikn.cz${dates.google}`
  },
  {
    label: "Hospodářské noviny",
    type: "Článek",
    priority: 87,
    group: "top",
    tags: ["Článek", "Ekonomika"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Ahn.cz+OR+site%3Aihned.cz${dates.google}`
  },
  {
    label: "Respekt",
    type: "Investigativní web",
    priority: 86,
    group: "top",
    tags: ["Investigativa", "Analýza"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Arespekt.cz${dates.google}`
  },
  {
    label: "Český rozhlas",
    type: "Rozhovor",
    priority: 85,
    group: "top",
    tags: ["Rozhovor", "Rozhlas"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Arozhlas.cz+OR+site%3Aplus.rozhlas.cz${dates.google}`
  },
  {
    label: "Česká televize archiv",
    type: "Rozhovor",
    priority: 84,
    group: "top",
    tags: ["Televize", "Video", "Archiv"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Aceskatelevize.cz${dates.google}`
  },
  {
    label: "Ministerstva a úřady",
    type: "Tisková zpráva",
    priority: 83,
    group: "official",
    tags: ["Tisková zpráva", "Oficiální dokument"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Avlada.gov.cz+OR+site%3Amvcr.cz+OR+site%3Ammr.gov.cz+OR+site%3Amfcr.cz${dates.google}`
  },
  {
    label: "Soudy a justice",
    type: "Tisková zpráva",
    priority: 81,
    group: "official",
    tags: ["Soud", "Oficiální dokument"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Ajustice.cz+OR+site%3Ausoud.cz+OR+site%3Ansoud.cz${dates.google}`
  },
  {
    label: "Kontrolní a veřejné databáze",
    type: "Tisková zpráva",
    priority: 80,
    group: "official",
    tags: ["Oficiální dokument", "Databáze"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Anku.cz+OR+site%3Auohs.cz+OR+site%3Ahlidacstatu.cz${dates.google}`
  },
  {
    label: "Parlamentní a veřejné databáze",
    type: "Tisková zpráva",
    priority: 90,
    group: "top",
    tags: ["Parlament", "Tisková zpráva", "Soud", "Policie"],
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
    tags: ["Investigativa", "Archiv", "Soud", "Policie"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+investigace+OR+anal%C3%BDza+OR+dokumenty+site%3Ainvestigace.cz+OR+site%3Ahlidacipes.org+OR+site%3Arespekt.cz${dates.google}`
  },
  {
    label: "Investigace.cz",
    type: "Investigativní web",
    priority: 84,
    group: "investigative",
    tags: ["Investigativa", "Dokumenty"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Ainvestigace.cz${dates.google}`
  },
  {
    label: "HlídacíPes.org",
    type: "Investigativní web",
    priority: 82,
    group: "investigative",
    tags: ["Investigativa", "Analýza"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Ahlidacipes.org${dates.google}`
  },
  {
    label: "Odborné a profesní zdroje",
    type: "Článek",
    priority: 64,
    group: "archive",
    tags: ["Článek", "Odborný zdroj"],
    build: (query, dates) => `https://www.google.com/search?q=${query}+site%3Aceska-justice.cz+OR+site%3Aekonomickydenik.cz+OR+site%3Alupa.cz${dates.google}`
  },
  {
    label: "Internet Archive / starší web",
    type: "Článek",
    priority: 62,
    group: "archive",
    tags: ["Archiv"],
    build: (query) => `https://web.archive.org/web/*/${query}`
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

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => []);

  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function spellingVariants(query) {
  return query.split(/\s+/).flatMap((part) => {
    const clean = stripDiacritics(part).toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

    if (clean.length < 5) {
      return [];
    }

    return SPELLING_TERMS.filter((term) => {
      const normalizedTerm = stripDiacritics(term).toLowerCase();
      return levenshtein(clean, normalizedTerm) <= 2;
    });
  });
}

function expandSearchTerms(query) {
  const original = query.trim();
  const normalized = stripDiacritics(original).toLowerCase();
  const terms = [original, ...spellingVariants(original)];

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

function expandPersonTerms(person) {
  const original = person.trim();
  const normalized = stripDiacritics(original).toLowerCase();
  const terms = [original];

  PERSON_EXPANSIONS.forEach((entry) => {
    if (entry.triggers.some((trigger) => normalized.includes(trigger))) {
      terms.push(...entry.names);
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

function sourceGroupRank(group) {
  const ranks = {
    top: 0,
    investigative: 1,
    official: 2,
    archive: 3
  };

  return ranks[group] ?? 4;
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

  const groups = searchTargets.reduce((acc, target) => {
    acc[target.group] = (acc[target.group] || 0) + 1;
    return acc;
  }, {});
  const summary = document.createElement("div");
  summary.className = "source-summary";
  summary.innerHTML = `
    <strong>Prohledává se ${searchTargets.length} okruhů zdrojů</strong>
    <span>${groups.top || 0} hlavních médií · ${groups.investigative || 0} investigativní · ${groups.official || 0} oficiální · ${groups.archive || 0} archivní</span>
  `;
  sourceLinks.append(summary);

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
  const personTerms = expandPersonTerms(filters.person);
  const dates = buildDateOperators(filters);
  const period = describePeriod(filters);

  return personTerms.flatMap((personTerm, personIndex) => searchTerms.flatMap((term, termIndex) => {
    const queryText = buildSearchQuery(filters, term, personTerm);
    const query = encodeURIComponent(queryText);
    const isExact = termIndex === 0 && personIndex === 0;
    const termWeight = termIndex === 0 ? 160 : Math.max(35, 70 - termIndex * 6);
    const personWeight = personIndex === 0 ? 20 : 8;
    const matchLabel = isExact
      ? "Přesná shoda tématu"
      : `Související výraz: ${term}`;

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
      quote: "",
      excerpt: "",
      relevance: journalisticRelevance(target, filters),
      sourceBrief: sourceBriefFor(target, filters),
      timeContext: timeContextFor(target, filters),
      scoreLabel: scoreLabelFor(target.priority + termWeight + personWeight + (target.group === "top" ? 20 : 0)),
      directUrl: "",
      searchUrl: target.build(query, dates)
    }));
  }))
    .sort((a, b) => {
      const groupDiff = sourceGroupRank(a.sourceGroup) - sourceGroupRank(b.sourceGroup);
      return groupDiff || b.relevanceScore - a.relevanceScore;
    })
    .slice(0, RESULT_LIMIT);
}

function journalisticRelevance(target, filters) {
  const person = filters.person || "sledovaná osoba";
  const topic = filters.keywords || "tématu";

  if (target.label === "iROZHLAS") {
    return `Texty iROZHLASu často přinášejí citace aktérů, časovou linku událostí a odkazy na související veřejné dokumenty k tématu ${topic}.`;
  }

  if (target.label === "ČT24") {
    return `ČT24 zachycuje televizní a zpravodajský kontext: kdy se téma ${topic} dostalo do veřejné debaty a kdo na něj reagoval.`;
  }

  if (target.label === "ČTK / České noviny") {
    return `ČTK obvykle nabízí stručný dobový záznam události, vyjádření hlavních aktérů a základní časové souvislosti.`;
  }

  if (target.type === "Rozhovor") {
    return `Rozhovory pomáhají dohledat, jak osoba ${person} o tématu ${topic} mluvila vlastními slovy v daném období.`;
  }

  if (target.type === "Tisková zpráva") {
    return `Oficiální dokumenty ukazují stanoviska institucí, data rozhodnutí a veřejně dostupné podklady k tématu ${topic}.`;
  }

  if (target.type === "Sociální síť") {
    return `Veřejné příspěvky zachycují rychlé reakce osoby ${person} nebo dalších aktérů mimo redakční rozhovor.`;
  }

  if (target.type === "Investigativní web") {
    return `Investigativní materiály obvykle skládají dohromady dokumenty, časovou linku případu a vazby mezi hlavními aktéry.`;
  }

  if (target.group === "archive") {
    return `Archivní zdroje ukazují, jak se o tématu ${topic} psalo dříve a jaké informace byly veřejně dostupné před současnou debatou.`;
  }

  return `Článek přináší dobový popis událostí k tématu ${topic}, včetně citací a reakcí hlavních aktérů.`;
}

function sourceBriefFor(target, filters) {
  const person = filters.person || "sledovaná osoba";
  const topic = filters.keywords || "téma";
  const topicKey = stripDiacritics(topic).toLowerCase();

  if (topicKey.includes("digitaliz") || topicKey.includes("staveb") || topicKey.includes("dsr")) {
    return [
      `Souvislost s osobou ${person} se typicky týká digitalizace stavebního řízení, Portálu stavebníka a agendy ministerstva pro místní rozvoj.`,
      "V článcích hledejte, kdy se systém spouštěl, jaké problémy se popisovaly a kdo na ně veřejně reagoval.",
      "Užitečné jsou hlavně citace úřadů, obcí, stavebníků, ministerstva a politických aktérů."
    ];
  }

  if (target.label === "iROZHLAS") {
    return [
      `Hledejte konkrétní citace osoby ${person} a reakce dalších aktérů.`,
      `U tématu ${topic} bývají užitečné časové souvislosti a odkazy na navazující texty.`
    ];
  }

  if (target.label === "ČT24") {
    return [
      "Zdroj může ukázat, kdy se věc dostala do hlavních zpráv.",
      `U tématu ${topic} jsou důležité dobové reakce politiků, institucí nebo dalších účastníků.`
    ];
  }

  if (target.label === "ČTK / České noviny") {
    return [
      "Agenturní text pomůže rychle zjistit základní sled událostí.",
      "Hledejte datum, stručné shrnutí a citovaná vyjádření hlavních aktérů."
    ];
  }

  if (target.type === "Rozhovor") {
    return [
      `Nejdůležitější je přímé vyjádření osoby ${person}.`,
      "Rozhovor může ukázat, jak byla věc formulovaná v dané době, ne až zpětně."
    ];
  }

  if (target.type === "Tisková zpráva") {
    return [
      "Sledujte datum, instituci a přesné znění oficiálního stanoviska.",
      `U tématu ${topic} může dokument doplnit rámec události bez redakční zkratky.`
    ];
  }

  if (target.type === "Investigativní web") {
    return [
      "Hledejte dokumenty, návaznosti a osoby nebo firmy zmiňované v případu.",
      "Takový zdroj bývá užitečný pro pochopení delší časové linky."
    ];
  }

  if (target.type === "Sociální síť") {
    return [
      "Veřejný příspěvek může zachytit bezprostřední reakci před vydáním delších článků.",
      "Důležité je datum příspěvku a přesné znění citace."
    ];
  }

  return [
    `Zdroj může přinést základní popis událostí k tématu ${topic}.`,
    "Hledejte konkrétní citace, datum vydání a navazující reakce."
  ];
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
    return `Zaměřeno na období ${period}, takže pomáhá oddělit starší výroky od novějších reakcí.`;
  }

  if (target.type === "Rozhovor") {
    return "Rozhovory jsou vhodné pro srovnání dřívějších formulací s pozdějšími vyjádřeními.";
  }

  if (target.group === "archive") {
    return "Archivní okruh hledá starší texty, které mohou ukázat, kdy a v jakém kontextu se téma objevovalo dříve.";
  }

  if (target.type === "Tisková zpráva") {
    return "Oficiální dokumenty pomáhají zasadit událost do data rozhodnutí, jednání nebo stanoviska instituce.";
  }

  if (target.type === "Investigativní web") {
    return "Investigativní zdroje obvykle propojují starší události s později zveřejněnými dokumenty a reakcemi.";
  }

  if (target.type === "Sociální síť") {
    return "Veřejné příspěvky ukazují bezprostřední reakce a formulace, které se často objevují ještě před širším mediálním zpracováním.";
  }

  return "Zpravodajské články pomáhají zachytit, kdy se téma dostalo do veřejné debaty a jak se vyvíjely reakce aktérů.";
}

function topicIntroFor(filters, records) {
  const topic = filters.keywords;
  const period = describePeriod(filters);
  return {
    title: topic,
    text: `K tématu ${topic} bylo nalezeno ${records.length} veřejně dostupných zdrojů v období ${period}. Níže jsou řazeny články, rozhovory, dokumenty a další materiály vztahující se k tématu.`
  };
}

function relatedTopicsFor(filters) {
  const terms = expandSearchTerms(filters.keywords).filter((term) => term !== filters.keywords);
  const topicKey = stripDiacritics(filters.keywords).toLowerCase();
  const mappedTopics = topicKey.includes("capi hnizdo")
    ? ["Andrej Babiš", "Dotace EU", "Agrofert", "střet zájmů"]
    : [];
  const base = [filters.person, ...terms].filter(Boolean);
  const defaults = ["veřejná debata", "oficiální dokumenty", "rozhovory"];
  return uniqueTerms([...mappedTopics, ...base, ...defaults]).slice(0, 8);
}

function yearsFor(records) {
  const years = records
    .map((record) => record.date ? new Date(`${record.date}T12:00:00`).getFullYear() : null)
    .filter(Boolean);

  return years.length ? [...new Set(years)].sort((a, b) => a - b) : DEFAULT_YEARS;
}

function stanceSignalFor(record) {
  const text = stripDiacritics([
    record.statementQuote,
    record.quote,
    record.excerpt,
    record.contextExcerpt,
    record.relevance
  ].filter(Boolean).join(" ")).toLowerCase();

  const contrastWords = ["drive", "nyni", "dnes", "pozdji", "později", "zmenil", "zmenila", "otocil", "obrat", "puvodne", "nakonec", "zatimco"];
  const supportWords = ["podpor", "souhlas", "chce", "prosazuje", "slibil", "pripustil", "je pro", "privita"];
  const opposeWords = ["odmita", "odmitl", "nesouhlas", "kritiz", "nechce", "varoval", "je proti", "poprel", "vyloucil"];

  const hasContrast = contrastWords.some((word) => text.includes(stripDiacritics(word).toLowerCase()));
  const support = supportWords.some((word) => text.includes(word));
  const oppose = opposeWords.some((word) => text.includes(word));

  if (hasContrast) return "contrast";
  if (support && oppose) return "mixed";
  if (support) return "support";
  if (oppose) return "oppose";
  return "";
}

function stanceSignalLabel(signal) {
  if (signal === "contrast") return "pasáž naznačuje kontrast mezi dřívější a pozdější formulací";
  if (signal === "mixed") return "ve stejném období se objevují podpůrné i odmítavé formulace";
  if (signal === "support") return "pasáž působí jako souhlasná nebo prosazující formulace";
  if (signal === "oppose") return "pasáž působí jako odmítavá nebo kritická formulace";
  return "pasáž doplňuje časový kontext";
}

function recordYear(record) {
  if (!record.date) return null;
  const year = new Date(`${record.date}T12:00:00`).getFullYear();
  return Number.isNaN(year) ? null : year;
}

function stanceRecordsForYear(records, year) {
  return records
    .filter((record) => recordYear(record) === Number(year))
    .map((record) => ({
      record,
      signal: stanceSignalFor(record),
      excerpt: excerptFor(record) || record.contextExcerpt || record.relevance || ""
    }))
    .filter((item) => item.signal || item.excerpt)
    .slice(0, 4);
}

function stanceSummaryItems(records) {
  const items = records
    .filter((record) => record.date && (record.statementQuote || record.quote || record.excerpt))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .map((record) => ({
      year: recordYear(record),
      date: record.date,
      source: record.source,
      signal: stanceSignalFor(record),
      excerpt: excerptFor(record)
    }))
    .filter((item) => item.year && item.excerpt);

  const byYear = new Map();
  items.forEach((item) => {
    if (!byYear.has(item.year)) byYear.set(item.year, item);
  });

  return [...byYear.values()].slice(0, 5);
}

function stanceShiftYears(records) {
  const byYear = new Map();

  records.forEach((record) => {
    if (!record.date) return;
    const year = new Date(`${record.date}T12:00:00`).getFullYear();
    if (Number.isNaN(year)) return;
    const signal = stanceSignalFor(record);
    if (!signal) return;
    if (!byYear.has(year)) byYear.set(year, new Set());
    byYear.get(year).add(signal);
  });

  const years = [...byYear.keys()].sort((a, b) => a - b);
  const marked = new Set();
  let previousSignals = new Set();

  years.forEach((year) => {
    const signals = byYear.get(year);
    if (signals.has("contrast") || signals.has("mixed")) {
      marked.add(year);
    }

    const stanceSignals = [...signals].filter((signal) => signal === "support" || signal === "oppose");
    const previousStanceSignals = [...previousSignals].filter((signal) => signal === "support" || signal === "oppose");
    if (stanceSignals.length && previousStanceSignals.length && stanceSignals.some((signal) => !previousSignals.has(signal))) {
      marked.add(year);
    }

    previousSignals = new Set([...previousSignals, ...signals]);
  });

  return marked;
}

function yearStatsFor(records) {
  const counts = new Map();
  const stanceYears = stanceShiftYears(records);
  let undated = 0;

  records.forEach((record) => {
    if (!record.date) {
      undated += 1;
      return;
    }
    const year = new Date(`${record.date}T12:00:00`).getFullYear();
    if (!Number.isNaN(year)) counts.set(year, (counts.get(year) || 0) + 1);
  });

  const years = counts.size ? [...counts.keys()].sort((a, b) => a - b) : DEFAULT_YEARS;
  const max = Math.max(1, ...years.map((year) => counts.get(year) || 0));

  const stats = years.map((year) => ({
    year,
    count: counts.get(year) || 0,
    intensity: (counts.get(year) || 0) / max,
    stanceShift: stanceYears.has(year),
    undated: false
  }));

  if (undated) {
    stats.push({
      year: "bez-data",
      count: undated,
      intensity: 0.28,
      undated: true
    });
  }

  return stats;
}

function recordUrl(record) {
  return record.directUrl || record.searchUrl || "#";
}

function recordLinkText(record) {
  return record.directUrl ? "Celý článek" : "Otevřít záložní hledání";
}

function hasConcreteArticleUrl(record) {
  return Boolean(record.directUrl || record.url);
}

function periodFromRecords(records) {
  const years = records
    .map((record) => record.date ? new Date(`${record.date}T12:00:00`).getFullYear() : null)
    .filter(Boolean);

  if (!years.length) {
    return "všechny roky";
  }

  return `${Math.min(...years)}–${Math.max(...years)}`;
}

function statementCount(records) {
  return records.filter((record) => record.statementQuote || record.type === "Rozhovor").length;
}

function displayPersonName(name = "") {
  const trimmed = name.trim();
  const normalized = stripDiacritics(trimmed).toLowerCase();
  const exactCandidate = PERSON_CANDIDATES.find((candidate) =>
    stripDiacritics(candidate.name).toLowerCase() === normalized
  );
  if (exactCandidate) return exactCandidate.name;

  if (normalized.includes("babis")) return "Andrej Babiš";
  if (normalized.includes("bartos")) return "Ivan Bartoš";
  if (normalized === "fiala") return "Fiala";
  if (normalized.includes("petr fiala")) return "Petr Fiala";
  if (normalized.includes("radim fiala")) return "Radim Fiala";
  return trimmed
    .split(/\s+/)
    .map((part) => part ? `${part[0].toUpperCase()}${part.slice(1)}` : "")
    .join(" ");
}

function initialsFor(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function shortProfileFallback(name, records = []) {
  const sources = records.length ? `${records.length} dohledaných zdrojů` : "veřejně dostupné zdroje";
  return `${name} je hledaná veřejně známá osoba. Profil slouží jen k orientaci; níže jsou řazeny ${sources}, citace a souvislosti k zadanému tématu.`;
}

function personCandidatesFor(query = "") {
  const normalized = stripDiacritics(query).toLowerCase().trim();
  if (!normalized) return [];

  const exactName = PERSON_CANDIDATES.find((candidate) =>
    stripDiacritics(candidate.name).toLowerCase() === normalized
  );
  if (exactName) return [exactName];

  return PERSON_CANDIDATES.filter((candidate) =>
    candidate.aliases.some((alias) => {
      const normalizedAlias = stripDiacritics(alias).toLowerCase();
      return normalizedAlias === normalized || normalizedAlias.includes(normalized) || normalized.includes(normalizedAlias);
    })
  );
}

async function loadPublicPersonProfile(name) {
  if (!name || window.location.protocol === "file:") return null;

  try {
    const response = await fetch(`https://cs.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/\s+/g, "_"))}`, {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return {
      description: cleanDisplayText(data.extract || data.description || ""),
      imageUrl: data.thumbnail?.source || data.originalimage?.source || ""
    };
  } catch {
    return null;
  }
}

function candidateInitials(name = "") {
  return initialsFor(name) || "?";
}

function renderPersonCandidates(candidates = [], currentName = "") {
  personCandidates.replaceChildren();

  if (candidates.length <= 1) {
    personCandidates.classList.add("hidden");
    return;
  }

  const note = document.createElement("p");
  note.className = "candidate-note";
  note.textContent = "Jméno odpovídá více veřejným osobám. Upřesněte hledaný profil:";
  personCandidates.append(note);

  candidates.forEach((candidate) => {
    const button = document.createElement("button");
    const avatar = document.createElement("span");
    const text = document.createElement("span");
    const name = document.createElement("strong");
    const role = document.createElement("small");

    button.type = "button";
    button.className = "candidate-card";
    button.dataset.person = candidate.name;
    button.classList.toggle("is-active", stripDiacritics(candidate.name).toLowerCase() === stripDiacritics(currentName).toLowerCase());

    avatar.className = "candidate-avatar";
    avatar.textContent = candidateInitials(candidate.name);

    name.textContent = candidate.name;
    role.textContent = candidate.role;
    text.append(name, role);
    button.append(avatar, text);
    personCandidates.append(button);

    loadPublicPersonProfile(candidate.name).then((profile) => {
      if (!profile?.imageUrl || !personCandidates.contains(button)) return;
      const image = document.createElement("img");
      image.src = profile.imageUrl;
      image.alt = candidate.name;
      image.loading = "lazy";
      image.referrerPolicy = "no-referrer";
      image.addEventListener("error", () => {
        avatar.replaceChildren(candidateInitials(candidate.name));
      }, { once: true });
      avatar.replaceChildren(image);
    });
  });

  personCandidates.classList.remove("hidden");
}

function renderPersonStanceSummary(records = []) {
  personStanceSummary.replaceChildren();
  const items = stanceSummaryItems(records);

  if (!items.length) {
    personStanceSummary.classList.add("hidden");
    return;
  }

  const title = document.createElement("strong");
  const list = document.createElement("ol");
  title.textContent = "Postoje a formulace v čase";

  items.forEach((item) => {
    const li = document.createElement("li");
    const meta = document.createElement("span");
    const text = document.createElement("p");
    meta.textContent = `${formatDate(item.date)} · ${item.source}${item.signal ? ` · ${stanceSignalLabel(item.signal)}` : ""}`;
    text.textContent = item.excerpt;
    li.append(meta, text);
    list.append(li);
  });

  personStanceSummary.append(title, list);
  personStanceSummary.classList.remove("hidden");
}

function setPersonAvatar(name, imageUrl = "") {
  personAvatar.replaceChildren();

  if (imageUrl) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = name;
    image.loading = "lazy";
    image.referrerPolicy = "no-referrer";
    image.addEventListener("error", () => {
      personAvatar.replaceChildren(initialsFor(name) || "?");
      personAvatar.classList.remove("has-photo");
    }, { once: true });
    personAvatar.append(image);
    personAvatar.classList.add("has-photo");
    return;
  }

  personAvatar.textContent = initialsFor(name) || "?";
  personAvatar.classList.remove("has-photo");
}

function renderPersonProfile(filters, records = []) {
  const name = filters.person.trim();
  const displayName = displayPersonName(name);
  const candidates = personCandidatesFor(name);

  setPersonAvatar(displayName);
  personName.textContent = displayName;
  personDescription.textContent = candidates.length > 1
    ? `Zadané jméno může odpovídat více veřejným osobám. Vyberte konkrétní profil, aby se výsledky nepletly mezi různé osoby.`
    : shortProfileFallback(displayName, records);
  renderPersonCandidates(candidates, displayName);
  renderPersonStanceSummary(candidates.length > 1 ? [] : records);
  personProfile.classList.toggle("hidden", !name);

  if (candidates.length > 1) {
    return;
  }

  loadPublicPersonProfile(displayName).then((profile) => {
    if (!profile || personName.textContent !== displayName) return;
    if (profile.imageUrl) setPersonAvatar(displayName, profile.imageUrl);
    if (profile.description) {
      const firstSentence = profile.description.split(/(?<=[.!?])\s+/u).slice(0, 2).join(" ");
      personDescription.textContent = cleanDisplayText(firstSentence).slice(0, 260);
    }
  });
}

function excerptFor(record) {
  const quote = record.quote && record.quote.trim();
  const excerpt = record.excerpt && record.excerpt.trim();
  const text = quote || excerpt;

  if (!text) {
    return "";
  }

  if (text.length <= EXCERPT_LIMIT) {
    return text;
  }

  const shortened = text.slice(0, EXCERPT_LIMIT);
  const lastSpace = shortened.lastIndexOf(" ");
  const cleanCut = lastSpace > 180 ? shortened.slice(0, lastSpace) : shortened;

  return `${cleanCut.trim()}…`;
}

function contextExcerptFor(record) {
  const quote = record.quote && record.quote.trim();
  const excerpt = record.excerpt && record.excerpt.trim();

  if (!excerpt || excerpt === quote) {
    const points = Array.isArray(record.sourceBrief) ? record.sourceBrief.filter(Boolean) : [];
    return points[0] || record.relevance || "";
  }

  if (excerpt.length <= EXCERPT_LIMIT) {
    return excerpt;
  }

  const shortened = excerpt.slice(0, EXCERPT_LIMIT);
  const lastSpace = shortened.lastIndexOf(" ");
  const cleanCut = lastSpace > 180 ? shortened.slice(0, lastSpace) : shortened;
  return `${cleanCut.trim()}…`;
}

function quoteLabelFor(record) {
  if (record.quote && record.quote.trim()) {
    return "Citace výroku";
  }

  if (record.excerpt && record.excerpt.trim()) {
    return "Úryvek ze zdroje";
  }

  return "Výňatek";
}

function visibleExcerptFor(record) {
  if (record.isLiveResult && !hasRealExcerpt(record)) {
    return "";
  }

  return excerptFor(record) || "Výňatek zatím není doplněn";
}

function hasRealExcerpt(record) {
  return Boolean((record.quote && record.quote.trim()) || (record.excerpt && record.excerpt.trim()));
}

function setAiStatus(message, state = "") {
  aiStatus.textContent = message;
  aiStatus.className = `ai-status ${state}`.trim();
  aiStatus.classList.toggle("hidden", !message);
}

function decodeHtmlEntities(value = "") {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(value);
  return textarea.value;
}

function cleanDisplayText(value = "") {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanDisplayList(value) {
  return Array.isArray(value) ? value.map(cleanDisplayText).filter(Boolean) : [];
}

function normalizeAiRecord(record, index) {
  return {
    date: record.date || "",
    dateLabel: record.date ? "" : (record.dateLabel || "datum nezjištěno"),
    type: record.type || "Článek",
    title: record.title || record.source || `Zdroj ${index + 1}`,
    source: record.source || "Neznámý zdroj",
    sourceGroup: record.sourceGroup || (index < 12 ? "top" : "archive"),
    tags: record.tags || [record.type || "Článek"],
    matchedTerm: record.matchedTerm || "",
    matchType: record.matchType || "exact",
    matchLabel: record.matchLabel || "Doplněno ze zdroje",
    relevanceScore: Number(record.relevanceScore || 0),
    quote: record.quote || record.statementQuote || "",
    excerpt: record.excerpt || "",
    contextExcerpt: record.contextExcerpt || "",
    relevance: record.relevance || "Zdroj přináší informace k zadané osobě, tématu a časovému kontextu.",
    sourceBrief: record.sourceBrief || [],
    timeContext: record.timeContext || "Záznam doplňuje časovou souvislost tématu a pomáhá zařadit citaci nebo článek do širšího přehledu.",
    scoreLabel: record.scoreLabel || scoreLabelFor(Number(record.relevanceScore || 0)),
    statementQuote: record.statementQuote || "",
    directUrl: record.directUrl || record.url || "",
    searchUrl: record.searchUrl || "",
    isLiveResult: Boolean(record.isLiveResult),
    isConcreteArticle: Boolean(record.isLiveResult && (record.directUrl || record.url))
  };
}

function cleanNormalizedRecord(record) {
  return {
    ...record,
    dateLabel: cleanDisplayText(record.dateLabel),
    type: cleanDisplayText(record.type),
    title: cleanDisplayText(record.title),
    source: cleanDisplayText(record.source),
    tags: cleanDisplayList(record.tags),
    matchedTerm: cleanDisplayText(record.matchedTerm),
    matchLabel: cleanDisplayText(record.matchLabel),
    quote: cleanDisplayText(record.quote),
    excerpt: cleanDisplayText(record.excerpt),
    contextExcerpt: cleanDisplayText(record.contextExcerpt),
    relevance: cleanDisplayText(record.relevance),
    sourceBrief: cleanDisplayList(record.sourceBrief),
    timeContext: cleanDisplayText(record.timeContext),
    scoreLabel: cleanDisplayText(record.scoreLabel),
    statementQuote: cleanDisplayText(record.statementQuote)
  };
}

async function fetchAiRecords(filters) {
  if (window.location.protocol === "file:") {
    setAiStatus("Pro živé výtahy otevřete aplikaci přes lokální adresu http://localhost:4173. Přímé otevření souboru umí zobrazit jen rozšířené zdrojové odkazy.", "is-warning");
    return null;
  }

  setAiStatus("Hledáme zdroje a krátké výňatky k tématu…", "is-loading");

  try {
    const response = await fetch(RESEARCH_ENDPOINT, {
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
          sourceTimelineOnly: true
        }
      })
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      if (response.status === 503 || errorPayload.code === "BRAVE_SEARCH_API_KEY_MISSING") {
        setAiStatus("Vyhledávání není připojené k Brave Search API. Zkontrolujte .env nebo restart serveru s BRAVE_SEARCH_API_KEY.", "is-warning");
        return null;
      }
      throw new Error(`Research endpoint returned ${response.status}`);
    }

    const payload = await response.json();
    const records = Array.isArray(payload.records) ? payload.records : [];

    if (!records.length) {
      setAiStatus("Brave Search nevrátil žádné konkrétní články pro zadanou osobu a téma. Obecné zdrojové okruhy se jako výsledky nezobrazují.", "is-warning");
      return [];
    }

    setAiStatus(`Doplněno ${Math.min(records.length, RESULT_LIMIT)} zdrojů s krátkými výňatky.`, "is-ready");
    return records
      .slice(0, RESULT_LIMIT)
      .map(normalizeAiRecord)
      .map(cleanNormalizedRecord)
      .filter(hasConcreteArticleUrl);
  } catch (error) {
    setAiStatus("Živé výtahy se teď nepodařilo načíst. Zkontrolujte, že aplikace běží přes lokální server a že je nastavený klíč BRAVE_SEARCH_API_KEY.", "is-warning");
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
    card.querySelector(".match-note").textContent = record.matchLabel || "Přesná shoda tématu";
    card.querySelector(".score-label").textContent = record.scoreLabel || scoreLabelFor(record.relevanceScore || 0);
    card.querySelector(".time-context").textContent = record.timeContext || "Záznam doplňuje časovou souvislost tématu a pomáhá zařadit citaci nebo článek do širšího přehledu.";
    renderTags(card.querySelector(".tag-list"), record.tags || [record.type]);
    renderSourceBrief(card.querySelector(".source-brief"), record);
    const excerptText = visibleExcerptFor(record);
    const excerptLabel = card.querySelector(".excerpt-label");
    const excerptBlock = card.querySelector("blockquote");
    const contextExcerpt = card.querySelector(".context-excerpt");
    excerptBlock.textContent = excerptText;
    excerptLabel.textContent = quoteLabelFor(record);
    excerptLabel.classList.toggle("hidden", !excerptText);
    excerptBlock.classList.toggle("hidden", !excerptText);
    excerptBlock.classList.toggle("is-missing", !hasRealExcerpt(record));
    const contextText = record.contextExcerpt || contextExcerptFor(record);
    contextExcerpt.textContent = contextText ? `${hasRealExcerpt(record) ? "Kontext ze zdroje" : "Co zatím víme o zdroji"}: ${contextText}` : "";
    contextExcerpt.classList.toggle("hidden", !contextText);
    card.querySelector(".relevance").textContent = record.relevance;

    const link = card.querySelector("a");
    link.href = recordUrl(record);
    link.textContent = recordLinkText(record);

    quoteCards.append(card);
  });

  quoteCardsSection.classList.toggle("hidden", records.length === 0);
}

function renderTimeline(records) {
  timeline.replaceChildren();

  records
    .slice()
    .sort((a, b) => {
      const groupDiff = sourceGroupRank(a.sourceGroup) - sourceGroupRank(b.sourceGroup);
      return groupDiff || (b.relevanceScore || 0) - (a.relevanceScore || 0);
    })
    .forEach((record) => {
      const item = timelineTemplate.content.cloneNode(true);
      item.querySelector(".date-pill").textContent = record.dateLabel || formatDate(record.date);
      item.querySelector(".type-badge").textContent = record.type;
      item.querySelector("time").dateTime = record.date || "";
      item.querySelector("time").textContent = record.source;
      item.querySelector("h4").textContent = record.title;
      item.querySelector(".match-note").textContent = record.matchLabel || "Přesná shoda tématu";
      item.querySelector(".score-label").textContent = record.scoreLabel || scoreLabelFor(record.relevanceScore || 0);
      item.querySelector(".time-context").textContent = record.timeContext || "Záznam doplňuje časovou souvislost tématu a pomáhá zařadit citaci nebo článek do širšího přehledu.";
      renderTags(item.querySelector(".tag-list"), record.tags || [record.type]);
      renderSourceBrief(item.querySelector(".source-brief"), record);
      const excerptText = visibleExcerptFor(record);
      const excerptLabel = item.querySelector(".excerpt-label");
      const excerptBlock = item.querySelector("blockquote");
      const contextExcerpt = item.querySelector(".context-excerpt");
      excerptBlock.textContent = excerptText;
      excerptLabel.textContent = quoteLabelFor(record);
      excerptLabel.classList.toggle("hidden", !excerptText);
      excerptBlock.classList.toggle("hidden", !excerptText);
      excerptBlock.classList.toggle("is-missing", !hasRealExcerpt(record));
      const contextText = record.contextExcerpt || contextExcerptFor(record);
      contextExcerpt.textContent = contextText ? `${hasRealExcerpt(record) ? "Kontext ze zdroje" : "Co zatím víme o zdroji"}: ${contextText}` : "";
      contextExcerpt.classList.toggle("hidden", !contextText);
      item.querySelector(".source-name").textContent = record.source;
      item.querySelector(".relevance").textContent = record.relevance;

      const link = item.querySelector("a");
      link.href = recordUrl(record);
      link.textContent = recordLinkText(record);

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

function renderSourceBrief(container, record) {
  if (!container) {
    return;
  }

  container.replaceChildren();
  const points = Array.isArray(record.sourceBrief) ? record.sourceBrief.filter(Boolean).slice(0, 3) : [];

  if (!points.length) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");

  const title = document.createElement("strong");
  const list = document.createElement("ul");
  title.textContent = "Co se dozvíte";

  points.forEach((point) => {
    const item = document.createElement("li");
    item.textContent = point;
    list.append(item);
  });

  container.append(title, list);
}

function renderTopicIntro(filters, records) {
  const intro = topicIntroFor(filters, records);
  topicIntroTitle.textContent = intro.title;
  topicIntroText.textContent = intro.text;
  topicStats.replaceChildren();

  [
    `${records.length} zdrojů`,
    `${statementCount(records)} výroků v čase`,
    periodFromRecords(records)
  ].forEach((value) => {
    const item = document.createElement("span");
    item.textContent = value;
    topicStats.append(item);
  });

  topicIntro.classList.remove("hidden");
}

function renderRecommended(records) {
  recommendedList.replaceChildren();

  records.slice(0, 3).forEach((record) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const note = document.createElement("p");

    link.href = recordUrl(record);
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
  yearChangeDetail.replaceChildren();
  yearChangeDetail.classList.add("hidden");

  yearStatsFor(records).forEach(({ year, count, intensity, stanceShift, undated }) => {
    const button = document.createElement("button");
    const isActive = !undated && filters.dateFrom === `${year}-01-01` && filters.dateTo === `${year}-12-31`;
    button.type = "button";
    button.className = `year-chip ${undated ? "is-undated" : ""} ${stanceShift ? "has-stance-shift" : ""} ${isActive ? "is-active" : ""}`.trim();
    button.dataset.year = String(year);
    button.style.setProperty("--year-intensity", String(Math.max(0.08, intensity)));
    button.disabled = Boolean(undated);
    button.title = undated
      ? `${count} zdrojů zatím nemá dohledané datum`
      : `${year}: ${count ? `${count} zdrojů` : "zatím bez datovaných zdrojů"}${stanceShift ? ". Možný posun ve veřejných formulacích nebo postoji podle dostupných výňatků." : ""}`;
    button.innerHTML = `<span>${undated ? "bez data" : year}</span><small>${count ? `${count} zdrojů` : "bez dat"}</small>${stanceShift ? "<em>změna?</em>" : ""}`;
    yearFilter.append(button);
  });

  yearSection.classList.remove("hidden");
}

function renderYearChangeDetail(year, records) {
  yearChangeDetail.replaceChildren();

  const details = stanceRecordsForYear(records, year);
  if (!details.length) {
    yearChangeDetail.classList.add("hidden");
    return;
  }

  const title = document.createElement("strong");
  const note = document.createElement("p");
  const list = document.createElement("ul");
  title.textContent = `Co ukazuje rok ${year}`;
  note.textContent = "Níže jsou pasáže, kvůli kterým je rok označen jako možný posun ve formulaci nebo postoji. Nejde o verdikt, jen o vodítko k přečtení zdrojů.";

  details.forEach(({ record, signal, excerpt }) => {
    const item = document.createElement("li");
    const meta = document.createElement("span");
    const text = document.createElement("p");
    meta.textContent = `${record.date ? formatDate(record.date) : "datum nezjištěno"} · ${record.source} · ${stanceSignalLabel(signal)}`;
    text.textContent = excerpt;
    item.append(meta, text);
    list.append(item);
  });

  yearChangeDetail.append(title, note, list);
  yearChangeDetail.classList.remove("hidden");
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
    .filter((record) => record.statementQuote || record.quote || record.excerpt || record.type === "Rozhovor")
    .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
    .slice(0, 8);

  if (!statements.length) {
    const empty = document.createElement("div");
    const title = document.createElement("strong");
    const note = document.createElement("p");
    empty.className = "statement-item";
    title.textContent = "Zatím nejsou k dispozici použitelné výňatky.";
    note.textContent = "Jakmile vyhledávání vrátí články se snippetem nebo citací, zobrazí se zde chronologický přehled pasáží ze zdrojů.";
    empty.append(title, note);
    statementsList.append(empty);
    statementsSection.classList.remove("hidden");
    return;
  }

  statements.forEach((record) => {
    const item = document.createElement("div");
    const title = document.createElement("strong");
    const quote = document.createElement("p");
    const published = record.date ? formatDate(record.date) : "datum nezjištěno";
    item.className = "statement-item";
    title.textContent = `${published} · ${record.source}`;
    quote.textContent = record.statementQuote || record.quote || excerptFor(record) || "Výňatek zatím není doplněn";
    item.append(title, quote);
    statementsList.append(item);
  });

  statementsSection.classList.remove("hidden");
}

function yearCounts(records) {
  const counts = new Map();
  records.forEach((record) => {
    if (!record.date) return;
    const year = new Date(`${record.date}T12:00:00`).getFullYear();
    if (!Number.isNaN(year)) counts.set(year, (counts.get(year) || 0) + 1);
  });
  return counts;
}

function strongestYearText(records) {
  const counts = yearCounts(records);
  if (!counts.size) return "";
  const [year, count] = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0];
  return `Nejvíce dohledaných textů je zatím z roku ${year} (${count}).`;
}

function debateDevelopmentText(filters, records) {
  const period = periodFromRecords(records);
  const datedRecords = records.filter((record) => record.date).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const first = datedRecords[0];
  const last = datedRecords[datedRecords.length - 1];
  const sourceTypes = uniqueTerms(records.map((record) => record.type).filter(Boolean)).slice(0, 4).join(", ").toLowerCase();
  const highlight = strongestYearText(records);
  const person = displayPersonName(filters.person);

  if (!records.length) {
    return `K tématu "${filters.keywords}" u osoby ${person} zatím nejsou v tomto výběru konkrétní články. Zkuste rozšířit téma nebo odstranit filtr zdroje a období.`;
  }

  if (first && last && first !== last) {
    return `K tématu "${filters.keywords}" u osoby ${person} se podařilo dohledat zdroje z období ${period}; první zachycený text je z roku ${new Date(`${first.date}T12:00:00`).getFullYear()}, poslední z roku ${new Date(`${last.date}T12:00:00`).getFullYear()}. ${highlight} Výňatky níže ukazují, jak se v čase měnily důrazy veřejné debaty a citované formulace.`;
  }

  return `K tématu "${filters.keywords}" u osoby ${person} je zatím k dispozici ${records.length} zdrojů typu ${sourceTypes || "články a rozhovory"}. ${highlight || "Časové srovnání bude přesnější po doplnění dalších datovaných zdrojů."} Níže jsou nejdřív zdroje, které nejvíc pomáhají pochopit kontext.`;
}

function renderSummary(filters, records) {
  summaryText.textContent = debateDevelopmentText(filters, records);
  summaryCard.classList.remove("hidden");
}

function runSearch(filters, records = sampleRecords) {
  currentRecords = records;
  const filteredRecords = filterRecords(records, filters);
  resultTitle.textContent = `${filters.person}: ${filters.keywords}`;
  renderSourceLinks(filters);
  renderPersonProfile(filters, filteredRecords);
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
  const baseRecords = currentRecords.length ? currentRecords : buildGeneratedRecords(collectFilters());
  if (button.classList.contains("has-stance-shift")) {
    renderYearChangeDetail(year, baseRecords);
  } else {
    yearChangeDetail.replaceChildren();
    yearChangeDetail.classList.add("hidden");
  }
  dateFromInput.value = `${year}-01-01`;
  dateToInput.value = `${year}-12-31`;
  runSearch(collectFilters(), baseRecords);
  if (button.classList.contains("has-stance-shift")) {
    renderYearChangeDetail(year, baseRecords);
  }
});

relatedTopics.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-topic]");
  if (!button) {
    return;
  }

  keywordsInput.value = button.dataset.topic;
  runSearch(collectFilters(), buildGeneratedRecords(collectFilters()));
});

personCandidates.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-person]");
  if (!button) {
    return;
  }

  personInput.value = button.dataset.person;
  form.requestSubmit();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const filters = collectFilters();

  if (!filters.person || !filters.keywords) {
    return;
  }

  const aiRecords = await fetchAiRecords(filters);
  if (aiRecords) {
    runSearch(filters, aiRecords);
  } else if (window.location.protocol === "file:") {
    runSearch(filters, buildGeneratedRecords(filters));
  } else {
    runSearch(filters, []);
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
  currentRecords = [];
  resultTitle.textContent = "Zadejte osobu, výrok a téma";
  summaryCard.classList.add("hidden");
  topicIntro.classList.add("hidden");
  personProfile.classList.add("hidden");
  personStanceSummary.replaceChildren();
  personCandidates.replaceChildren();
  yearChangeDetail.replaceChildren();
  yearChangeDetail.classList.add("hidden");
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
