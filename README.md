# RCC — Cronologia

A compiled static website documenting the chronology of the **Catholic
Charismatic Renewal** (Renovação Carismática Católica): the 1967 Duquesne
origin, the papal receptions, the Brazilian movement (Rahm, Dougherty,
Canção Nova, Shalom, the 1998 media wave), the CNBB's 1994 guidelines, and
the ICCRS → CHARIS institutional arc.

Part of the [Cronologia](https://cronologia.github.io) family; built from the
[`core`](https://github.com/cronologia/core) template. Single JSON source of
truth (`data/chronology.json`), zero-dependency build, GitHub Pages.

```bash
node scripts/validate-data.js && node --test && node build.js
```

Publish: Settings → Pages → GitHub Actions + Actions variable
`ENABLE_PAGES=true` (with `main` as default).
