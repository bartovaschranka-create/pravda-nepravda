# Pravda-nepravda

Statické MVP webové aplikace pro GitHub Pages.

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
- karty nejdůležitějších relevantních citací,
- pole `excerpt` pro krátký výňatek přímo ze zdroje; pokud chybí, zobrazí se „Výňatek zatím není doplněn“,
- časová osa zdrojů,
- krátké neutrální shrnutí souvislostí.

## Právní a obsahové zásady

- Neukládat celé články.
- Nezobrazovat obsah za paywallem.
- Zobrazovat pouze krátkou relevantní citaci, název článku, médium, datum a odkaz.
- U každého zdroje uvádět krátké vysvětlení relevance.
- Neoznačovat osobu za lháře, manipulátora nebo podvodníka.

## Omezení statické verze

GitHub Pages bez backendu nemůže spolehlivě automaticky stahovat výsledky z médií, vyhledávačů a sociálních sítí. MVP proto generuje přesné vyhledávací dotazy a ukazuje strukturu, do které lze později napojit vyhledávací API nebo vlastní backend.

## Spuštění

Otevřete `index.html` v prohlížeči nebo nasaďte repozitář na GitHub Pages.
