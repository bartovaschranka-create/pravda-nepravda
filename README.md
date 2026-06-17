# Zdroje v čase

Statické MVP webové aplikace pro GitHub Pages.

Aktuální verze: `0.3.18-person-disambiguation` ze dne `2026-06-17`.

## Cíl

Aplikace pomáhá dohledávat veřejné výroky známých osob hluboko do minulosti a řadí je do časového kontextu se zdroji. Neposuzuje osoby ani výroky. Ukazuje citace, souvislosti, návaznosti a odkazy na původní zdroje.

## Aktuální MVP

- filtr podle osoby,
- přesná citace,
- téma / klíčová slova,
- období od-do,
- zdroj / médium,
- typ zdroje: rozhovor, článek, tisková zpráva, sociální síť, investigativní web,
- odkazy pro vyhledávání v médiích, veřejných databázích, rozhovorech, tiskových zprávách, sociálních sítích a investigativních webech,
- viditelný souhrn počtu prohledávaných zdrojových okruhů a jejich kategorií,
- až 30 zdrojů řazených podle relevance: nahoře TOP zdroje, níže archivní a starší zdroje,
- funkce `expandSearchTerms(query)` pro technické rozšíření dotazu o související výrazy a varianty bez diakritiky,
- označení, zda je výsledek podle přesného dotazu nebo podle souvisejícího výrazu,
- karty hlavních zdrojů,
- pole `quote` pro přímou citaci výroku, `excerpt` pro hlavní krátký úryvek a `contextExcerpt` pro doplňující kontext ze stejného zdroje,
- dlouhé výňatky se v náhledu automaticky zkrátí, aby karta ukazovala jen zásadní část a ne celý článek,
- volitelné napojení `/api/research`, které dohledá zdroje, načte veřejně dostupný text článku a vrátí krátké citace, výňatky a body `sourceBrief`,
- časová osa zdrojů,
- časová osa ukazuje počet datovaných zdrojů v jednotlivých letech, aby bylo vidět období zvýšené mediální pozornosti,
- krátké neutrální shrnutí souvislostí.

## Právní a obsahové zásady

- Neukládat celé články.
- Nezobrazovat obsah za paywallem.
- Zobrazovat pouze krátkou relevantní citaci, název článku, médium, datum a odkaz.
- U každého zdroje uvádět krátké vysvětlení relevance.
- Nehodnotit osoby; zobrazovat pouze zdroje, citace a časový kontext.

## Omezení statické verze

GitHub Pages bez serverové části nemůže spolehlivě automaticky stahovat výsledky z médií, vyhledávačů a sociálních sítí. MVP proto generuje přesné vyhledávací dotazy a umí volitelně zavolat `/api/research`. Toto napojení má dohledat zdroje, zpracovat text, vybrat krátký výňatek a vrátit ho jako `excerpt`.

Kontrakt endpointu je v `api-research-contract.json`.

## Výtahy z článků

Skutečné výtahy z článků zajišťuje endpoint `api/research.js`. Je připravený pro Vercel nebo jiné Node serverless prostředí a používá Brave Search API.

Potřebná proměnná prostředí:

- `BRAVE_SEARCH_API_KEY`

Po nasazení serverové části frontend automaticky zavolá `/api/research` a karty se doplní o `quote`, `excerpt`, `contextExcerpt` a konkrétní body `sourceBrief` přímo ze zdrojů. Článek se celý neukládá ani nezobrazuje.

Backend používá konkrétní položky z Brave Search (`title`, `url`, `description/snippet`, dostupné datum). Karta proto reprezentuje konkrétní článek; obecné okruhy zdrojů slouží jen jako záložní odkazy a v živém režimu se nevykreslují jako výsledkové karty.

## Spuštění

Otevřete `index.html` v prohlížeči nebo nasaďte repozitář na GitHub Pages.

## Lokální režim s výtahy

Pro živé dohledávání zdrojů a výtahů nepouštějte stránku přímo jako soubor. Spusťte lokální server:

```bat
spustit-lokalne.bat
```

Nebo ručně:

```bat
node server.mjs
```

Potom otevřete:

```text
http://localhost:4173
```

Pro skutečné hledání v médiích je potřeba proměnná `BRAVE_SEARCH_API_KEY`. Bez ní aplikace dál zobrazí rozšířené odkazy a připravené redakční vodítko.

## Kontrola před předáním

Po každé úpravě spusťte:

```bat
zkontrolovat.bat
```

Kontrola ověřuje verzi v UI, cache-busting u CSS/JS, syntaxi JavaScriptu, viditelný fallback výňatku a zakázané hodnotící formulace.
