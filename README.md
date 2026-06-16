# Pravda-nepravda

Statické MVP webové aplikace pro GitHub Pages.

Aktuální verze: `0.4.0-ai-excerpts` ze dne `2026-06-16`.

## Cíl

Aplikace pomáhá dohledávat veřejné výroky známých osob hluboko do minulosti a řadí je do časového kontextu se zdroji. Neurčuje absolutní pravdu a nehodnotí osobu. Ukazuje dohledatelné rozpory, souvislosti, návaznosti a odkazy na původní zdroje.

## Aktuální MVP

- filtr podle osoby,
- přesná citace,
- téma / klíčová slova,
- období od-do,
- zdroj / médium,
- typ zdroje: rozhovor, článek, tisková zpráva, sociální síť, investigativní web,
- odkazy pro vyhledávání v médiích, veřejných databázích, rozhovorech, tiskových zprávách, sociálních sítích a investigativních webech,
- až 30 zdrojů řazených podle relevance: nahoře TOP zdroje, níže archivní a starší zdroje,
- funkce `expandSearchTerms(query)` pro technické rozšíření dotazu o související výrazy a varianty bez diakritiky,
- označení, zda je výsledek podle přesného dotazu nebo podle souvisejícího výrazu,
- karty nejdůležitějších relevantních zdrojů,
- pole `excerpt` pro krátký výňatek přímo ze zdroje; pokud chybí, zobrazí se „Výňatek zatím není doplněn“,
- dlouhé výňatky se v náhledu automaticky zkrátí, aby karta ukazovala jen zásadní část a ne celý článek,
- volitelný AI backend `/api/research`, který může automaticky dohledat zdroje a vrátit krátké výňatky do pole `excerpt`,
- časová osa zdrojů,
- krátké neutrální shrnutí souvislostí.

## Právní a obsahové zásady

- Neukládat celé články.
- Nezobrazovat obsah za paywallem.
- Zobrazovat pouze krátkou relevantní citaci, název článku, médium, datum a odkaz.
- U každého zdroje uvádět krátké vysvětlení relevance.
- Neoznačovat osobu za lháře, manipulátora nebo podvodníka.

## Omezení statické verze

GitHub Pages bez backendu nemůže spolehlivě automaticky stahovat výsledky z médií, vyhledávačů a sociálních sítí. MVP proto generuje přesné vyhledávací dotazy a umí volitelně zavolat `/api/research`. Tento backend má dohledat zdroje, stáhnout text jen pro analýzu, vybrat krátký výňatek a vrátit ho jako `excerpt`.

Kontrakt endpointu je v `api-research-contract.json`.

## Spuštění

Otevřete `index.html` v prohlížeči nebo nasaďte repozitář na GitHub Pages.
