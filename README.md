# RCC — Cronologia

A compiled static website documenting the chronology of the **Catholic
Charismatic Renewal** (Renovação Carismática Católica): the 1967 Duquesne
origin, the papal receptions, the Brazilian movement (Rahm, Dougherty,
Canção Nova, Shalom, the 1998 media wave), the CNBB's 1994 guidelines, and
the ICCRS → CHARIS institutional arc.

Part of the [Cronologia](https://cronologia.github.io) family; built from the
[`core`](https://github.com/cronologia/core) template. Single JSON source of
truth (`data/chronology.json`), zero-dependency build, GitHub Pages.

## Languages

The site is published in three locales, each an independently indexable static
page:

| | |
|---|---|
| English (authoritative) | <https://cronologia.github.io/rcc/en/> |
| Português | <https://cronologia.github.io/rcc/pt/> |
| Español | <https://cronologia.github.io/rcc/es/> |

`https://cronologia.github.io/rcc/` redirects to the visitor's locale, so older
links keep working. **English is the version of record**; the Portuguese and
Spanish pages are machine-translated from committed caches
(`data/i18n/{pt,es}.json`, managed by `scripts/translate.js`) and say so in a
banner at the top of every page. See `adr/0002-multilingual-pt-es.md`.

```bash
node scripts/validate-data.js && node --test && node build.js
```

Publish: Settings → Pages → GitHub Actions + Actions variable
`ENABLE_PAGES=true` (with `main` as default).
