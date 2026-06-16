# Zdroje v čase

Statické MVP webové aplikace pro GitHub Pages.

Aktuální verze: `0.3.0-editorial-archive` ze dne `2026-06-16`.

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
- až 30 zdrojů řazených podle relevance: nahoře TOP zdroje, níže archivní a starší zdroje,
- funkce `expandSearchTerms(query)` pro technické rozšíření dotazu o související výrazy a varianty bez diakritiky,
- označení, zda je výsledek podle přesného dotazu nebo podle souvisejícího výrazu,
- karty hlavních zdrojů,
- pole `excerpt` pro krátký výňatek přímo ze zdroje; pokud chybí, místo citace se nezobrazuje žádný zástupný text,
- dlouhé výňatky se v náhledu automaticky zkrátí, aby karta ukazovala jen zásadní část a ne celý článek,
- volitelná rešeršní část `/api/research`, která může automaticky dohledat zdroje a vrátit krátké výňatky do pole `excerpt`,
- časová osa zdrojů,
- krátké neutrální shrnutí souvislostí.

## Právní a obsahové zásady

- Neukládat celé články.
- Nezobrazovat obsah za paywallem.
- Zobrazovat pouze krátkou relevantní citaci, název článku, médium, datum a odkaz.
- U každého zdroje uvádět krátké vysvětlení relevance.
- Nehodnotit osoby; zobrazovat pouze zdroje, citace a časový kontext.

## Omezení statické verze

GitHub Pages bez backendu nemůže spolehlivě automaticky stahovat výsledky z médií, vyhledávačů a sociálních sítí. MVP proto generuje přesné vyhledávací dotazy a umí volitelně zavolat `/api/research`. Tato rešeršní část má dohledat zdroje, stáhnout text jen pro zpracování, vybrat krátký výňatek a vrátit ho jako `excerpt`.

Kontrakt endpointu je v `api-research-contract.json`.

## Spuštění

Otevřete `index.html` v prohlížeči nebo nasaďte repozitář na GitHub Pages.
