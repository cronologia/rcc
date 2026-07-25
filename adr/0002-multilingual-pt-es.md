# ADR-0002 — Portuguese and Spanish locales with per-locale SEO

- **Status:** accepted (2026-07-25)
- **Context repo:** `cronologia/rcc`
- **Adopts:** `cronologia/core` ADR-0001 (multi-language sites), core#9, this
  repo's rcc#11
- **Builds on:** this repo's ADR-0001 (template adoption, single source of truth)

## Context

The site documents a movement whose primary audience is Brazilian, yet it was
English-only. Reaching Portuguese- and Spanish-speaking readers for a reference
site means being *found in those languages*, not merely offering a toggle.

The org-wide design was already decided and implemented in `core/template`
(core#9, core ADR-0001). This ADR records the **adoption** into `rcc` and the
two places where this repo deviates from the template.

## Decision

Adopt the template's multilingual pipeline as-is:

1. **Locales** `en` (authoritative, hand-written) + `pt` + `es`
   (machine-translated). No human-review gate — the visible disclaimer is what
   stands in for one.
2. **Locale after the project segment**: `/rcc/{en,pt,es}/…`. GitHub Pages only
   lets this repo control its own `/rcc/` subtree, so a locale-first path is
   impossible. `docs/index.html` becomes a redirect stub, so every existing
   `/rcc/` link keeps working; canonical English moves to `/rcc/en/`.
3. **Static per-locale pages.** Each (page × locale) is its own file — a pasted
   `/pt/` link opens in Portuguese with no client-side routing.
4. **Data-level localization** through `TRANSLATABLE_KEYS`, so the chronology,
   the diffusion branch timeline, the institutional-arc genealogy and the
   contested-numbers chart are all localized without touching their renderers.
   Reference titles, publishers, URLs, ids, dates and proper names are passed
   through verbatim (the whole `references` array is skipped).
5. **Per-locale SEO**: localized `<title>`/description, `<html lang>`,
   OG/Twitter, self canonical + `hreflang` (en/pt/es + `x-default`), JSON-LD
   `inLanguage`, plus generated `sitemap.xml` and `robots.txt`.
6. **A visible machine-translation banner on every non-English page.** This site
   carries contested claims that are deliberately *attributed* rather than
   asserted; a reader must be able to tell that the wording in front of them is
   auto-translated and that English is the version of record.

## Deviations from the template (to be ported back up — adopt-template rule 6)

1. `TRANSLATABLE_KEYS` adds **`direct`** and **`indirect`**, this site's typed-
   edge legend labels (`lineage.edgeLegend`). Without them the institutional-arc
   legend — which carries the Vatican's "new service, not a fusion" distinction
   — would stay in English on the translated pages.
2. The UI table adds **`founded`** (`renderOrgCard`'s hardcoded label) and two
   contested-numbers-chart strings, **`ncAxisNote`** and **`ncCaptionMeta`**
   (`axis: 0–N unit` and ` — reported by <source>, in <unit>`). These are
   compiler chrome, not data, so the data walk cannot reach them. Leaving them
   in English would have left the per-series source attribution — the thing that
   makes the figure honest — legible only to English readers.

## Consequences

- The build emits `docs/{en,pt,es}/index.html` + root stub + `sitemap.xml` +
  `robots.txt`. The drift test covers every locale.
- `/rcc/en/` is byte-identical to the previous single page apart from the SEO
  head, the locale-relative stylesheet path and the language switcher —
  localizing with an empty dictionary is the identity transform.
- `data/i18n/{pt,es}.json` are **generated data** owned by
  `scripts/translate.js`: re-author them when the English content changes, or a
  locale silently goes stale. `node scripts/translate.js --stats` reports
  coverage; missing strings fall back to English rather than breaking the build.
- The figures' SVG geometry is computed from years, so the diffusion timeline
  and the numbers chart render identically in all three locales; only the labels
  differ. The 1969-vs-1972 Brazil-arrival divergence stays a *flag on the
  figure* in every locale — translated, never resolved.
