# Project context

Pair with `AGENTS.md`; family method in `cronologia/core`, vendored here at
`.claude/skills/` (load `sourcing-rules` first). Repo decisions: `adr/`.

## The subject

**The Catholic Charismatic Renewal (Renovação Carismática Católica, RCC)**:
born at the "Duquesne Weekend" (17–19 February 1967, Pennsylvania), spread
through Notre Dame and the covenant communities, received by every pope from
Paul VI ("a chance for the Church", 1975) to Leo XIV (30 May 2026). In Brazil
— the movement's largest national expression — it arrives with Fr. Haroldo
Rahm (Campinas, 1969, per the movement's account), goes national with
Fr. Eduardo Dougherty from 1972, and produces the new communities (Canção
Nova 1978, Shalom 1982, Obra de Maria 1990) and the mass-media wave (Padre
Marcelo Rossi's 1998 record album). Institutional arc: ICCRO → ICCRS
(statutes 1993) → CHARIS (2019, "new service, not fusion" per the Vatican).

## Scope and audience

Global origins plus the Brazilian movement, from the antecedents through to
the present. Written for readers who want a **dated, sourced spine** of the
movement — researchers, journalists, curious Catholics — not a devotional
history and not a polemic. Site copy is English; the sources are English and
Portuguese. Everything contested is attributed to whoever says it.

## The contested terrain

- **Numbers**: all membership figures are the movement's own — attribute.
  The numbers visualization enforces this: separate axes, separate units,
  per-series source labels, and an explicit "not directly comparable" banner
  (see `adr/0001-*.md`).
- **Brazil arrival**: 1969 (movement) vs mid-1970s (Prandi) — record both.
- **CNBB Document 53 (Nov 1994)**: the episcopate's cautions document —
  present as the bishops' position, with the movement's continuing growth.
- **RCC vs CEBs / liberation theology**: the "conservative renewal" and
  "pentecostalization" framings belong to sociologists (Prandi, Carranza,
  Pew) — attribute, and cross-link the tl project. That subject is **tl's**;
  this repo does not argue it.
- **Covenant-community controversies** (Word of God 1990): documented
  criticism, labeled.
- **Politics**: RCC-linked candidacies are analysts' case studies, with
  contested internal engagement — attribute.

## State of the dataset

`data/chronology.json` currently holds **28 events (1901–2026), 6 framing
facts, 11 figures, 7 organizations and 55 references**, plus a
disambiguation block. Every fact carries a non-empty `sources[]` — the
validator refuses anything less. Still a work in progress: the institutional
spine is reasonably covered, the diocesan and community-level detail in
Brazil much less so.

**Visualizations** — all data-driven, rendered by `build.js` from optional
top-level keys (omit the key and the section simply disappears):

- `branchTimeline` — the diffusion timeline: a trunk from Duquesne outward,
  with branches for the national and community offshoots.
- `lineage` — the institutional arc (ICCRO → ICCRS → CHARIS and the Brazilian
  bodies), with a legend distinguishing direct from indirect edges.
- `numbersChart` — the contested-numbers figure, deliberately *not* one
  chart: the movement's own Brazilian participant estimate and Pew's external
  "renewalist" share sit on separate axes with their own cited captions.

**Preservation.** `scripts/archive-refs.js` records a Wayback snapshot per
reference URL in `data/archives.json` (48 of the 55 references have one at
the last run) and `build.js` renders an "archived" fallback link beside each
citation; the weekly `wayback.yml` workflow keeps it current.
`scripts/check-links.js` and the weekly `link-health.yml` workflow report rot
and never edit data — 403 / 429 / 5xx are INCONCLUSIVE, only real 4xx count
as dead. Both are out-of-band / CI only; the build itself never touches the
network.

**Glossary.** This project does not yet consume `cronologia/glossary` term
ids — there are no `[[term-id]]` cross-links in the copy. Wiring them up is
open work, not something already in place.

## Known source gaps (flagged in the data)

Formal constitution date of RCC Brasil's National Council · list of national
presidents · independent confirmation of 1980 for Cantalamessa's appointment
· the "ENF" as an institutional milestone (unconfirmed) · CNBB Doc 53 full
text currently cited via a mirror — obtain the CNBB original.
(`core/tools/unverified-report.py` regenerates this queue from the data.)

## Finding the sources — `KEYWORDS.md`

Orienting to the sources is not the same as knowing what to type. **`KEYWORDS.md`**
is this repo's finding aid for searching them: the subject's names in English,
Portuguese and Latin; the fact that the institutional body changed name twice
(ICCRO → ICCRS 1993 → CHARIS 2019), so one term misses two periods; the terms
that return **zero** hits despite the subject being present (`ICCRS`, `ICCRO`,
`Cantalamessa`, `Suenens` across the whole vaulted transcript corpus); the ASR
manglings the auto-caption transcripts produce (`Duane University` for
Duquesne, `sunnin` for Suenens); the false friends (`carismátic*` in Portuguese
is usually the everyday adjective); and the boundary pointers — CEBs and
liberation theology belong to `cronologia/tl`. It is a finding aid, **not a
dataset**: it makes no claims about the world, and listing a hostile source's
vocabulary is not endorsement. Part of it is generated from
`data/chronology.json`; the `## Search traps` section is hand-written and
survives regeneration — extend it whenever a search misleads you.

## Key sources

vatican.va speeches (Paul VI 1975, JPII 1981, Francis 2017/2019, Leo XIV
2026) · Dicastery for Laity directory · CNBB Doc 53 · Prandi, *Um Sopro do
Espírito* (USP 1998) · Carranza's studies · Pew 2006 "Spirit and Power" ·
Brill *Transatlantic Charismatic Renewal* · movement sources labeled (RCC
Brasil, CHARIS, ICCRS, Canção Nova).
