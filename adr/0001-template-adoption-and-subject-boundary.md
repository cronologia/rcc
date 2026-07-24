# ADR-0001 — Template adoption, single source of truth, and the tl boundary

- **Status:** accepted (2026-07-24)
- **Context repo:** `cronologia/rcc`
- **Builds on:** `cronologia/core` ADR-0001 (shared renderer contract),
  ADR-0002 (vendored glossary and skills), ADR-0003 (preservation and
  link-health split); `cronologia/archive` ADR-0001 (shared source vault)

## Context

This repo is one chronology in the Cronologia family. It documents the
Catholic Charismatic Renewal: global origins plus the Brazilian movement.
Three things about it needed writing down, because agents keep rediscovering
them: what it takes from the shared template (and what it deliberately does
not), which file is authoritative, and where its subject stops.

The subject boundary is the sharpest of the three. The RCC's relationship to
the base ecclesial communities and to liberation theology is a live
sociological argument (Prandi's "pentecostalization", Carranza, the Pew
surveys). It is also `cronologia/tl`'s subject. Without a written boundary,
every wave of work drifts into re-litigating it here.

The numbers are the second sharp edge. Brazilian participation figures come
from the movement's own reporting; Pew's "renewalist" figure is an external
survey of a different population, in a different unit, by a different method.
Any chart that puts them on one axis manufactures a comparison neither source
supports.

## Decision

1. **This repo consumes the `cronologia/core` template; it does not fork it.**
   Adopted from the template, and kept in sync via the `adopt-template`
   method: `build.js` (citation/reference rendering with archived-fallback
   links, the `disambiguation` block, and the three optional visualization
   renderers — `branchTimeline`, `lineage`, `numbersChart`),
   `scripts/validate-data.js`, `scripts/archive-refs.js`,
   `scripts/check-links.js`, `src/styles.css`, the `test/` suites, and the
   `deploy.yml` / `wayback.yml` / `link-health.yml` workflows.
   **Not adopted:** the template's `scripts/translate.js` (this site is
   single-locale, English) and `scripts/sync-glossary-terms.js` (no
   `[[term-id]]` glossary cross-links yet). Renderer fixes go **up** to
   `core` first, then come back down — they are never patched only here.
   *Known partial adoption (2026-07-24):* the three visualization renderers
   were taken without the template's matching validator rules for `lineage`,
   `branchTimeline` and `numbersChart`, and without its `viz-renderers` and
   `link-health` test suites. Closing that gap is the next `adopt-template`
   pass; until then the viz blocks are unvalidated and the renderers'
   geometry is untested here.
2. **`data/chronology.json` is the single source of truth.** `docs/` is
   compiled output, committed so GitHub Pages can serve it, and CI fails the
   build if it drifts. `data/archives.json` is likewise generated (by
   `scripts/archive-refs.js`). Neither is ever hand-edited: change the data,
   run `node scripts/validate-data.js && node --test && node build.js`, and
   commit the regenerated output in the same change.
3. **Contested numbers are never silently unified.** The `numbersChart`
   renderer draws each series on its own axis, with its own unit, its own
   cited caption, and a required `unitNote` banner stating that the series
   are not directly comparable. A movement self-report and an external survey
   never share a scale. A future series must arrive with its own unit and its
   own sources, or it does not get drawn.
4. **The standing subject boundary is with `cronologia/tl`.** CEBs,
   liberation theology and the sociological framings of RCC-vs-CEBs belong to
   `tl`. Here they appear only as attributed positions ("Prandi reads this
   as…", "Pew's 2006 survey finds…"), cross-linked to `tl` — never argued,
   never adjudicated, and never duplicated as a parallel dataset. The same
   peer rule governs `fsspx` (Catholic traditionalism) for shared Vatican
   documents and dates: cross-reference, don't copy.
5. **Preservation runs out of band.** The build is network-free. Wayback
   capture and link-health checking happen in scheduled CI only; a 403, 429
   or 5xx is INCONCLUSIVE, not "dead". Sources cited by two or more family
   projects belong in `cronologia/archive` per its ADR-0001; single-project
   sources stay here. Reader-facing citations are always the original URL
   plus its Wayback snapshot — never a raw archive URL.

## Consequences

- Adopting a new template capability is a copy-plus-port, not a rewrite: the
  renderer, its validator rules, its tests and its styles are meant to move
  together, and the addition stays optional so `docs/` is byte-identical when
  the data key is absent. Where that did not happen (decision 1), it is
  recorded as debt rather than quietly accepted.
- The dataset's shape is fixed by the template contract, so `core/tools/`
  (`dataset-query.py`, `unverified-report.py`, `xref.py`) work here unchanged.
- Arguments about the RCC's political or ecclesial meaning are resolved by
  citing who makes them, not by this repo taking a position — and the reader
  is pointed at `tl` for that argument's own chronology.
- The numbers page will always look less tidy than a single merged chart.
  That is the point; the tidiness would be a fabrication.
- Two template capabilities remain unadopted (i18n, glossary term ids). If
  either is wanted, it comes down from `core` via `adopt-template` rather
  than being invented here, and this ADR is superseded or amended.
