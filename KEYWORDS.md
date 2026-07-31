# KEYWORDS — RCC — Cronologia

**What this file is.** A finding aid for *searching sources* about the Catholic
Charismatic Renewal — the strings worth typing into a grep, a corpus index, an
archive manifest or a search box, and the strings that look obvious but fail.
It is partly regenerable: everything between the `BEGIN/END GENERATED` markers
is read mechanically out of `data/chronology.json` by
`core/tools/build-keywords.py` and is rewritten wholesale on the next run;
everything outside those markers — above all the **Search traps** section — is
hand-written from what agents actually observed while searching this repo's
data, its tickets and the vaulted sources in `cronologia/archive`. **What this
file is not: a dataset.** It makes no claims about the world. Listing a term
asserts nothing — a hostile source's vocabulary is recorded here so its pages
can be *found*, not because the term is accepted, and a word like
`pentecostalization` appearing below does not make it the site's word for
anything. Every claim about the subject lives in `data/chronology.json`,
attributed to whoever makes it and cited (`sourcing-rules` #1, #2). Nothing
below is remembered or invented: each variant was observed in this repo's data,
in `cronologia/archive`, in a mining report on a `cronologia/rcc` ticket, or in
a check run while writing this file.

## Search traps

Hand-written; **outside the generated markers on purpose** so regeneration
leaves it alone. Each entry is a trap and the term that actually works. Two
corpora are referred to throughout, both in the private `cronologia/archive`:

- **the transcript vault** — `archive/transcripts/`, 121 cleaned
  auto-caption transcripts, of which **7 are tagged `projects: ["rcc"]`**
  (`transcript-83` … `transcript-89`, mined on tickets rcc#3–#7). All seven
  are **English**.
- **the COF corpus** — `archive/cof/`, 589 Portuguese documents, ~6.98M words
  (`wc -w`). It is *not* an RCC corpus; it is a sibling project's, and that is
  exactly why its negative results below are worth knowing.

### The corpus is incomplete — a zero can mean "not transcribed"

A zero in the COF corpus is only evidence of absence if that aula was
transcribed in full, and **31 of 585 were not**. Measured 2026-07-26 by comparing
each transcript's word count against the archived audio duration
(`archive/webcaptures/cof-audio-durations.json`, from the archive.org metadata
API):

| estimated coverage | aulas |
|---|---|
| 90–115% — effectively complete | **419** |
| 75–90% | 107 |
| 50–75% | 24 |
| **below 50%** | **7** |

The 31 below 75%, worst first:

`COF513`(18%) `COF534`(34%) `COF154`(36%) `COF514`(38%) `COF157`(46%)
`COF254`(47%) `COF571`(48%) `COF351`(52%) `COF523`(57%) `COF034`(58%)
`COF525`(61%) `COF517`(61%) `COF462`(63%) `COF526`(63%) `COF528`(63%)
`COF542`(63%) `COF453`(64%) `COF529`(65%) `COF389`(65%) `COF498`(65%)
`COF175`(66%) `COF535`(66%) `COF543`(67%) `COF530`(69%) `COF267`(69%)
`COF079`(70%) `COF524`(70%) `COF545`(70%) `COF516`(70%) `COF473`(71%)
`COF531`(72%)

**This qualifies every "measured zero" already published in this family** —
`FSSPX` = 0, `Renovação Carismática` = 0, `Sociedade de São Pio X` = 3 and the
rest. Those counts are over a corpus that is materially incomplete in at least
31 places. Re-state such a result as *"not found in the transcribed portion"*
rather than as absence, and check whether any low-coverage aula is in scope
before concluding a topic is missing.

**The reverse case exists too.** 28 aulas exceed 115%, which is impossible —
there the *audio* is short, not the transcript. `COF229` is the extreme: 13,042
transcript words against 41 minutes of archived audio, while the community index
duration (1:38:35) agrees with the transcript and both archive.org mirrors carry
the same truncated file. A preservation gap, not a transcription gap.

**Method, stated because the numbers invite over-reading.** Coverage is
`words / (audio minutes × 130)`, where 130 wpm is the *observed median* across
585 aulas (stdev 19), not a constant — real rate varies with format (reading
aloud, Q&A, dictation). **Treat 0.75–1.15 as within noise.** Only the extremes
are robust: 18% and 239% cannot be explained by delivery style.

**Directly relevant to this repo:** the corpus is not an RCC source
(`Renovação Carismática` = 0 files), and this trap is why that zero is stated as
*not found in the transcribed portion* rather than as proof of absence.


### Terms that return nothing

| Search | Result | Search this instead |
|---|---|---|
| `Renovação Carismática` in the **COF corpus** | **0 hits in 589 files / ~6.98M words** | `carismátic` (~11 files) — but read the false-friend row below before trusting it; and `RCC`, which hits exactly **once** (COF030, "missas da RCC") |
| `Duquesne` in the **COF corpus** | **0** | nothing works — the corpus does not cover the origin story. Go to the transcript vault. |
| `ICCRS`, `ICCRO` | **0** in the COF corpus **and 0 across all 121 transcripts** | in the dataset, `organizations[5]` is one record named `ICCRO → ICCRS → CHARIS`; in sources, search the expansion `International Catholic Charismatic Renewal Office/Services` |
| `CHARIS` as a whole word (`grep -w`) | **0 files in the whole transcript vault** — every one of the ~449 case-insensitive `charis` hits is a substring of `charismatic`/`charismatics` (and, in COF228, of `Eucharistic`) | `grep -w CHARIS` case-**sensitive**, or search `Dicastery for Laity` / `new service, not fusion` |
| `Cantalamessa`, `Suenens`, `Dougherty`, `Haroldo`, `Jonas Abib`, `Marcelo Rossi`, `Shalom` | **0** across all 121 transcripts (and 0 in COF) — yet Cantalamessa and Suenens are both *spoken about at length* in transcripts 83, 84 and 87 | the ASR forms: `canel Mesa` / `Canal Mesa` (3 + 1 hits), `sunnin` (14 hits). See the ASR table. |
| `FSSPX` | 0 in the COF corpus (the family's standing example, recorded in `cronologia/fsspx`) | the same lesson applies here: acronyms are the *least* portable string in a corpus. |

**The general shape of it:** the acronym almost never survives into a source's
prose, and the auto-caption almost never survives a proper name. Search the
descriptive phrase, then the mangling, then the acronym — in that order.

### The institutional name changed by date — one body, three names

The international service body has had **three successive names**, so a search
for any one of them silently drops the other two periods. From `lineage.trees[0]`
and `organizations[5]` in this repo's data:

| Name | Period the sources use it for | Note in the data |
|---|---|---|
| **ICCRO** — International Catholic Charismatic Renewal Office | Brussels, then Rome; pre-1993 | `lineage` root |
| **ICCRS** — …Renewal *Services* | statutes approved by the Pontifical Council for the Laity, **14 September 1993** | `events` 1993-09-14 |
| **CHARIS** | instituted **2019** by the Dicastery for Laity, Family and Life; ICCRS and the Catholic Fraternity ceased at Pentecost 2019 | `events` 2018-12-08/2019-06-09 |

Consequences for searching:

- A pre-1993 source **cannot** say ICCRS, and a pre-2019 source **cannot** say
  CHARIS. A 1975 or 1981 document about "the international office" is about the
  same body under a name that no longer exists. Date-bound your expectations.
- The step ICCRS → CHARIS is drawn as an **indirect** edge with the edge label
  `new service, not fusion`. Press accounts of 2019 used **"fusion"** — the
  `disambiguation` block records this explicitly. So `fusion` / `fusão` is a
  live search term for the press coverage even though the site does not adopt
  the word.
- Beware the ICCRO founding dates: the mining report on **rcc#3** found the
  sedevacantist video giving "Brussels 1980 / Rome 1985" and marked it
  **CONTRADICTED** against the ICO Ann Arbor 1972 → Malines-Brussels 1976 →
  ICCRO 1978 → Rome 1981 sequence. Searching `ICCRO 1980` will find you a claim
  the repo has already rejected.

### The BRAZILIAN national body has also been called different things

Directly relevant to the open item on `rcc#1` (the National Council's formal
constitution date). Searching only `Conselho Nacional` will miss the earlier
record, because that is not what the primary sources of the period call it:

| Source | Date | What it calls the national body |
|---|---|---|
| CNBB **Doc. 53**, art. 21 (read in full this session) | 1994 | **`Coordenação Nacional da RCC`** |
| CNBB Doc. 53, *Apresentação* | 1994 | **`Comissão Nacional da RCC`** |
| The movement's own normative instructions | 2019–2021 | `Conselho Nacional do Movimento Eclesial Renovação Carismática Católica do Brasil` |

So in 1994 the CNBB addressed a *Coordenação*/*Comissão*; the *Conselho
Nacional* form (and the long formal name) belongs to the later period. Search
all three when hunting for the constitution date, and note that Doc. 53 art. 21
provides for a **bishop designated by the CNBB as Spiritual Assistant** to that
body — a formulation worth searching in diocesan and CNBB material.

Also useful: the movement's normative acts are numbered **`Instrução
Normativa`** (e.g. `IN 03/2019`, `IN 04/2021`), issued by *Assembleia Geral
Extraordinária* — a document class that is not indexed as "estatuto" and will
not surface on searches for one.

### Two person-name traps in the presidents list

- **`Reinaldo Reis` vs `Reinaldo Beserra`.** Oro & Alves (Religião e Sociedade
  33(1), 2013) cite **"Reinaldo Reis, membro fundador da RCC no Brasil,
  ex-presidente da RCC no Brasil" (Reis 2010:29)**. This repo's presidents list
  has **Reinaldo Beserra (2000–2004)**. These *may* be the same person under
  different surnames — Brazilian naming routinely drops a middle surname — but
  **nothing here asserts that**, and it must be verified before the two are
  merged. Search both, and search `Reis 2010` for the memoir.
- **`Reis 2010` — a lead, but a thin one.** The full citation is **REIS,
  Reinaldo. (2010), "A Renovação Carismática Católica no Brasil". *Revista
  Brasil Cristão*, maio: 29** — a **single magazine page**, not a memoir or a
  monograph (a companion piece, "Os Papas e a Renovação Carismática", runs
  pp. 29–30 of the same issue). An earlier note here called it the best
  remaining lead for the National Council's constitution date; that
  overstated it. One page in a Christian magazine is unlikely to carry a
  founding date, and *Revista Brasil Cristão* is not indexed in the usual
  academic databases. Worth reading if a copy surfaces — but the CNBB
  documentation archive and Prandi/Carranza in print remain the better bets.

### Naming variants across languages — and which source family uses which

- **The movement itself.** English `Catholic Charismatic Renewal` (13 hits in
  `chronology.json`) vs Portuguese `Renovação Carismática Católica` (4 hits) vs
  the bare acronym `RCC` (63 hits). The site's copy is English; **the Brazilian
  sources are Portuguese-only**. Two reference titles in this repo exist *only*
  in Portuguese — `cnbb-doc53` ("Orientações Pastorais sobre a Renovação
  Carismática Católica") and `veritatis-doc53` — so an English-only search of
  even this repo's own `references[]` misses the CNBB's own document.
- **Where each form actually appears.** In the transcript vault,
  `Renovação Carismática` appears in **5 files — and none of them is one of the
  7 rcc-tagged transcripts**. The five are sibling-project sources: two SSPX /
  traditionalist interviews (`transcript-1`, `transcript-7`), two liberation-
  theology-adjacent items (`transcript-10`, `transcript-8`), and a Brazilian
  priest's conversion account (`transcript-100`). **The Portuguese name of this
  subject lives in other projects' sources.** If you search only the rcc-tagged
  files for it you will find nothing and conclude, wrongly, that the vault has
  no Portuguese-language RCC material.
- **`RCC` the acronym is rare in speech.** Whole-word case-sensitive `RCC`:
  **1 hit in 121 transcripts** (`transcript-8`, a traditionalist video), **1 hit
  in 589 COF files**. Speakers say "renovação carismática" or just
  "carismáticos". Do not use the acronym as your primary probe of a spoken
  corpus.
- **Latin/liturgical.** `Veni Creator Spiritus` is the hinge of the movement's
  own origin narrative (Leo XIII 1901 and Duquesne 1967 — see rcc#5's report);
  it is quoted in Latin and should be searched in Latin.
- **Body names.** `Comunidade Católica Shalom` (PT) = "Shalom Catholic
  Community" (the Dicastery directory's EN form, ref `laityfamilylife-shalom`).
  `Associação do Senhor Jesus` and `Rede Século 21` are two names for
  `organizations[4]` and sources use one or the other. `CNBB` is never
  translated in sources; the expansion is *Conferência Nacional dos Bispos do
  Brasil*.
- **The CNBB document** goes by `Documento 53`, `Doc. 53`, and
  `Orientações Pastorais sobre a Renovação Carismática Católica` (27 Nov 1994).
  Searching "CNBB Document 53" in English finds the repo's own prose and almost
  nothing else.

### ASR manglings observed in the vaulted transcripts

All auto-caption tracks; several are **entirely lowercase**, which is why
`mine-prep.py`'s `PROPER NOUNS` pass returned **zero** candidates on
transcripts 85 and 86 (recorded in the rcc#5 and rcc#6 reports). Every form in
the left column was seen in the vault or recorded in a mining report on this
repo's tickets; none is invented. **These are search strings, not corrections
to the record** — the reports are explicit that none was verified against
audio.

| Correct name | ASR forms actually observed | Where |
|---|---|---|
| Duquesne | `Duane University`, `Ducane`, `Duan students`, `Duane outpouring`, `Decay weekend` | 20 hits in transcript-83, 4 in transcript-87 (correctly spelled `Duquesne` only in transcripts 85 and 86) |
| Kevin and Dorothy Ranaghan | `ranahan`, `ranah hands`, `darthy ranahan`, `Kevin ranigan` | transcript-87; rcc#3 report |
| Raniero Cantalamessa | `canel Mesa`, `Canal Mesa`, `Reiero Canal Mesa`, bare `Mesa` | transcripts 83 (3×), 84 (1×); rcc#3, rcc#4 reports |
| Léon-Joseph Suenens | `sunnin`, `Cardinal sunnin` | transcripts 83 (11×), 87 (3×) |
| Steubenville / Michael Scanlan | `Stubenville` (28 hits vs 7 for the correct spelling), `skanland`, `scandin`, `scanland` | transcripts 83, 84, 89; rcc#3 report |
| Patti Gallagher Mansfield | `Patty Mansfield` — and "Mansfield" **without** the "Gallagher" the dataset uses | transcripts 83, 85 |
| Azusa Street | `isua Street` | transcript-83; rcc#7 report |
| Charles Fox Parham | `charles parham charles foxborough` | transcript-86 |
| Harald Bredesen | `Harold bradeson`, `Pastor bredis`, `brison`, `bredeson` | transcripts 83, 87; rcc#3, rcc#7 reports |
| Agnes Ozman | `osmond` | rcc#5 report |
| Francis MacNutt | `father mcnut` | rcc#3 report |
| Fr George Montague | `father George migu`, `monteu` | rcc#7 report |
| Fernando Nascimento | `Fernando nasimo` | rcc#7 report |
| Fr Bob Bedard | `Bob badad` | rcc#4 report |
| Cursillo | `CIO` | rcc#3 report — a *plausible-looking acronym* is the worst kind of mangling |
| Lusaka (Milingo's see) | `Osaka` | rcc#6 report |
| *Humanae Vitae* | `Himanovite` | rcc#6 report |
| Medjugorje · La Salette · Peoria · Amorth · Msgr. | `magigoria` · `LEL at France` · `peia dicese` · `Amor` · `monsor` | rcc#3 report |
| Kibeho · Gladys · Mary Healy · Peter Herbeck | `Keo`/`Cabo` · `glattus` · `Healey` · `Herbach` | rcc#4 report |

Two ASR failures that are *not* name manglings and will mislead a date search:

- **Dates get mangled too.** transcript-83 renders a 2019 Francis address as
  **"June 88th 2019"** (rcc#3 report); transcript-86's telling puts Leo XIII
  "in the 1890s in 1996" (rcc#6). Never harvest a date from a caption.
- **A bare lowercase `ecc`** appears in `transcript-8` and `transcript-10`
  exactly where a Brazilian movement acronym belongs. The caption cannot tell
  you which acronym it heard, and neither can this file — verify against audio
  before treating it as `RCC`, `CEB` or anything else.

### Ambiguous referents / false friends

- **`carismátic*` in Portuguese is usually the ordinary adjective.** In the COF
  corpus almost every hit is "charismatic" in the everyday sense — a magnetic
  politician (COF053, on Lula), an absent but charming father (COF014), a
  Weberian "relação carismática" between master and pupil (COF150). Only COF030
  ("missas da RCC") is about the movement. Expect a high noise floor and pair
  the search with `renovação`, `RCC` or a community name.
- **`Obra de Maria`.** The Recife community (`organizations[3]`) collides with
  the ordinary Portuguese noun phrase: the single COF hit is "a totalidade da
  **obra de Maria** Rita Kehl" — *the work of* Maria Rita Kehl, nothing to do
  with the movement. Search `Obra de Maria` together with `Recife`,
  `missionários` or `peregrinação`.
- **`Shalom`.** `Comunidade Católica Shalom` is Fortaleza, 1982. The bare word
  is a greeting and a hundred other organizations. Always search the full
  `Comunidade Católica Shalom` or `comshalom`.
- **`charis` as a substring** matches `charismatic`, `charismatics`,
  `Eucharist`, `Eucharistic`. Transcript-83's ASR even splits the word —
  `Charis matics` — and transcript-89 has `Charis Maniacs` (Goring's own coinage
  for the movement's excesses, per the rcc#4 report). `grep -i charis` for the
  Vatican body CHARIS returns essentially 100% false positives.
- **`Rahm`.** Searching the transcript vault for `rahm` returns 15 hits and
  **not one is Fr. Haroldo Rahm** — every one is inside `brahman` / `Brahmans` /
  `Brahmin` in the perennialism transcripts (43, 52). Search `Haroldo`.
- **`Renewal` / `renovação` alone** collides with liturgical renewal, conciliar
  renewal and "renovação" in its ordinary sense. In the traditionalist sources
  (`transcript-1`) "renovação carismática" is used as a *contrast class* to the
  Fraternity, not as the topic.
- **`vaticancatholic.com` ≠ SSPX.** The rcc#3 ticket and its report both flag
  this: the source of `transcript-83` is Most Holy Family Monastery (the Dimond
  brothers), **sedevacantist** — a different position from the SSPX documented
  in `cronologia/fsspx`. Readers and searchers conflate them.
- **Two different Hickeys and two different sees**, per the rcc#6 report: the
  Mother of God Community was addressed by Cardinal **James A. Hickey** of
  **Washington** (Sept 1995), not "Nathan Hickey" of "Baltimore" as the lecture
  says. Searching the mangled form finds only the mangled source.
- **`Word of God`** is both a community (Ann Arbor, 1967) and an ordinary
  religious phrase; **`New Covenant`** is both Ralph Martin's magazine and a
  theological term. Pair with `Ann Arbor` and `magazine` respectively.

### Contested numbers — the two vocabularies must not be merged

This repo deliberately keeps membership figures on **separate axes with
separate units and separate source labels** (`numbersChart`, and `adr/0001-*`).
When searching, keep the two vocabularies apart, because merging them is
precisely the error the dataset is built to avoid:

- **Self-report vocabulary** (the movement counting itself): `participantes`,
  `membros`, "milhões de participantes", "according to the movement",
  `RCC Brasil — movement self-report`, `~5,000 missionaries (self-declared)`.
  The dataset's series is *"Brazilian participants — the movement's own
  estimate"*, ≈3.8 million (1994).
- **Survey vocabulary** (an outside instrument measuring a population):
  `renewalist` (Pew's own coinage — 3 hits in the dataset and the term to search
  in Pew's reports), `charismatic Catholics`, `share of population`,
  `Spirit and Power` (Pew 2006), `Religion in Latin America` (Pew 2014). The
  series is a **percentage**, not a count.
- **Floating figures with no method**, recorded in the mining reports and
  explicitly *not* adopted: `120 million` and `240 countries` (CBN, rcc#7 —
  "do not adopt"), `160 million members as of 2017` (vaticancatholic, rcc#3 —
  unsourced on air), `~1,700 members` for People of Praise (rcc#6 — the speaker
  hedges). If a search surfaces one of these round numbers, the repo has already
  seen it and declined it; don't re-mine it as new.
- The banner text to search for in the built site is `not directly comparable`.

### Terms of art — do not translate when searching

These have glossary ids in `cronologia/glossary` (`data/glossary.json`). **This
repo does not yet consume glossary ids** — there are no `[[term-id]]` markers in
`chronology.json`, which is why the generated "Terms of art" section below is
empty. The ids are still the right handle for looking a term up.

| Term as sources write it | Glossary id | Searching note |
|---|---|---|
| `Batismo no Espírito Santo` / `baptism in the Holy Spirit` / `efusão do Espírito` | `batismo-no-espirito` | 21 hits for the English form across the transcript vault; the movement's central experience term. Not a rebaptism — sources that treat it as one are arguing, not describing. |
| `Carisma` / `charism` / `carismas` / `charismata` | `carisma` | the technical sense (1 Cor 12:8–10 gifts). Distinguish hard from the everyday adjective — see the false-friends section. |
| `CNBB` | `cnbb` | never translated; expand to `Conferência Nacional dos Bispos do Brasil` only when searching formal prose. |
| `CEBs` / `comunidades eclesiais de base` | `cebs` | tagged to `tl` and `fsp`, **not** to this repo — see the boundary below. |
| `Veni Creator Spiritus` | *(no id)* | Latin, quoted verbatim by movement sources; search in Latin. |
| `Pia unio`, `latae sententiae`, `motu proprio` | `pia-unio`, `latae-sententiae`, `motu-proprio` | Latin canonical terms tagged to `fsspx`; they surface here only when a community's canonical status is discussed. Never translate them in a search. |

### Where else to look — sibling repos that own adjacent subjects

Per this repo's AGENTS.md ("Family map and this repo's boundaries") and the
glossary's `projects` tags:

- **CEBs, liberation theology, and the "RCC vs CEBs" / "conservative renewal" /
  "pentecostalization" argument → `cronologia/tl`.** This is the standing
  boundary and the most likely reason a searcher is in the wrong repo. Here
  those framings are **attributed** to Prandi, Carranza and Pew and cross-linked;
  the repo does not argue them and does not duplicate tl's dataset. If your
  query is about base communities, the Workers' Party, or the sociology of the
  competition between the two, **you are in the wrong repo** — go to `tl`. The
  glossary confirms it: `cebs` and `preferential-option` are tagged `tl`/`fsp`,
  never `rcc`.
- **Catholic traditionalism, the SSPX, sedevacantism → `cronologia/fsspx`.** The
  traditionalist-vs-charismatic reception thread (transcripts 83, 84, 88, 89)
  straddles the line: the *charismatic* side is this repo's, the traditionalist
  milieu is fsspx's. `sedevacantism`, `schism`, `latae-sententiae` are all
  fsspx-tagged glossary terms.
- **Guénonian Traditionalism, Schuon, the Maryamiyya → `cronologia/perennialism`
  and `cronologia/tariqa`.** Unrelated subject, overlapping vocabulary — this is
  where the `brahman`/`Rahm` collision comes from.
- **Shared and vaulted sources → `cronologia/archive`** (private). Transcripts,
  webcaptures and the COF corpus live there; the manifest
  `transcripts/index.json` carries a `projects` field, so
  `projects: ["rcc"]` is the fastest filter. Reader-facing citations stay
  original URL + Wayback, never a raw archive path.
- **Term definitions → `cronologia/glossary`.**
- **The generator and the shared tooling → `cronologia/core`** (`tools/`).

<!-- BEGIN GENERATED build-keywords.py -->
<!-- Generated by core/tools/build-keywords.py from rcc/data/chronology.json (meta.lastUpdated 2026-07-30).
     Regenerate: python3 core/tools/build-keywords.py rcc --out KEYWORDS.md
     Edits INSIDE this block are lost on regeneration; everything outside it is kept. -->

## How to use this list

**This block is a finding aid, not a dataset.** It lists strings worth
searching for — names, aliases, acronyms, spellings, and the vocabulary of
sources across the spectrum, hostile ones included. Listing a term asserts
nothing about the world: `schism` appearing in a search list does not claim
anyone is schismatic, and a critical source's word for something is listed so
its pages can be *found*, not endorsed. Every claim about the subject lives in
`data/`, attributed to whoever makes it and cited (`sourcing-rules` #1, #2).

Every string below was read out of this repo's dataset by the generator.
Nothing here is inferred or remembered. Variants seen elsewhere — in a corpus,
a transcript, an auto-caption — and terms that return **zero** hits belong in
the hand-written section outside this block, with a note on where they were
seen or searched.

## Subject names (7)

What the subject is called, from `meta` — plus every name the description puts in parentheses (acronyms, native-language forms, and whatever else it names in passing; the source field is on each line). A corpus may use exactly one of these and none of the others.

- `RCC — Cronologia` — meta.title
- `RCC` — meta.title
- `Renovação Carismática Católica` — meta.description (parenthetical)
- `Rahm` — meta.description (parenthetical)
- `Dougherty` — meta.description (parenthetical)
- `Canção Nova` — meta.description (parenthetical)
- `Shalom` — meta.description (parenthetical)

## People (14)

Every `figures[]` name, with the aliases and both sides of an `A — B` name. An `id` is that figure's own page — a permanent URL and a searchable handle.

- `Ralph Keifer and William Storey` · figures[0]
- `Patti Gallagher Mansfield` · figures[1]
- `Kevin and Dorothy Ranaghan` · figures[2]
- `Léon-Joseph Suenens` · figures[3]
- `Raniero Cantalamessa OFMCap` · figures[4]
- `Haroldo Rahm SJ` · figures[5]
- `Eduardo Dougherty SJ` · figures[6]
- `Jonas Abib` · figures[7]
- `Marcelo Rossi` · figures[8]
- `Moysés Azevedo and Gilberto Barbosa` · figures[9]
- `Michelle Moran, Pino Scafuro and Jean-Luc Moens` · figures[10]
- `Elena Guerra` · figures[11]
- `Francis MacNutt` · figures[12]
- `Michael Scanlan TOR` · figures[13]

## Organizations (7)

Every `organizations[]` name and alias. Acronym and full name are listed separately: sources use one or the other, rarely both.

- `RCC Brasil` · organizations[0]
- `Canção Nova` · organizations[1]
- `Comunidade Católica Shalom` · organizations[2]
- `Obra de Maria` · organizations[3]
- `Associação do Senhor Jesus / Rede Século 21` · organizations[4] · also: `Associação do Senhor Jesus`, `Rede Século 21`
- `ICCRO → ICCRS → CHARIS` · organizations[5]
- `Covenant communities (international)` · organizations[6] · also: `Covenant communities`

## Terms of art (0)

Glossary ids used in this dataset (`[[term-id]]` markers), with the visible text authors actually typed. These are *vocabulary*, including contested vocabulary — see the note at the top.

- (no `[[term-id]]` markers in this dataset)

## Places (26)

Place strings exactly as the dataset writes them, most-used first. Search a component (`Écône`) as well as the full string.

- `Rome` — 8× (events.place)
- `Brazil` — 7× (events.place,figures.country)
- `USA` — 5× (figures.country)
- `Cachoeira Paulista, Brazil` — 3× (events.place,organizations.place)
- `Campinas, Brazil` — 3× (events.place)
- `Fortaleza, Brazil` — 2× (events.place,organizations.place)
- `Italy` — 2× (figures.country)
- `USA/Brazil` — 2× (figures.country)
- `Valinhos, Brazil` — 2× (events.place,organizations.place)
- `Ann Arbor, Michigan, USA` — 1× (events.place)
- `Ann Arbor, USA / international` — 1× (events.place)
- `Belgium` — 1× (figures.country)
- `Gaithersburg, Maryland, USA` — 1× (events.place)
- `Gibsonia, Pennsylvania, USA` — 1× (events.place)
- `Latin America (survey)` — 1× (events.place)
- `Lucca, Italy / Rome` — 1× (events.place)
- `Malines, Belgium` — 1× (events.place)
- `Recife, Brazil` — 1× (organizations.place)
- `Rome (Circus Maximus)` — 1× (events.place)
- `South Bend, Indiana, USA` — 1× (events.place)
- `São Paulo, Brazil` — 1× (events.place)
- `Topeka / Los Angeles, USA` — 1× (events.place)
- `UK / Italy / Belgium` — 1× (figures.country)
- `USA (survey, 10 countries)` — 1× (events.place)
- `Valinhos / Recife, Brazil` — 1× (events.place)
- `Washington DC / Rome` — 1× (events.place)

## Dates coverage

The window this dataset spans. A source outside it is not necessarily irrelevant — it is not yet covered here.

| scope | records | years | note |
|---|---|---|---|
| events | 33 | 1895–2026 | 5 with dateVerified:false |
| figures.dates | 14 | 1904–2024 | years parsed from the field text |
| organizations.founded | 7 | 1978–1990 | years parsed from the field text |
| dataset (all of the above) | - | 1895–2026 | meta.lastUpdated 2026-07-30 |

<!-- END GENERATED build-keywords.py -->
