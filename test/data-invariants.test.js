'use strict';
// Invariants over the real committed data + a smoke test of the full render.
// Zero-dependency (node:test / node:assert).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  renderPage, renderRootStub, renderSitemap, renderRobots,
  siteBase, localizeData, loadDict, LOCALES, ROUTES, layoutPlacesMap,
} = require('../build.js');

const ROOT = path.join(__dirname, '..');
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'chronology.json'), 'utf8'));
// The build passes the vendored gazetteer + basemap into renderPage (placesMap);
// the drift check must render with the same inputs or it compares apples to oranges.
const places = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'places.json'), 'utf8'));
const world = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'world-land.json'), 'utf8'));

test('every sources[] entry resolves to a reference id or a URL', () => {
  const ids = new Set(data.references.map((r) => r.id));
  const check = (sources, at) => {
    for (const s of sources || []) {
      assert.ok(ids.has(s) || /^https?:\/\//.test(s), `${at}: unknown source "${s}"`);
    }
  };
  data.facts.forEach((f, i) => check(f.sources, `facts[${i}]`));
  data.events.forEach((e, i) => check(e.sources, `events[${i}]`));
  data.figures.forEach((f, i) => check(f.sources, `figures[${i}]`));
  (data.organizations || []).forEach((o, i) => check(o.sources, `organizations[${i}]`));
});

test('reference ids are unique', () => {
  const seen = new Set();
  for (const r of data.references) {
    assert.ok(!seen.has(r.id), `duplicate reference id ${r.id}`);
    seen.add(r.id);
  }
});

test('events are dated plausibly and titled', () => {
  for (const e of data.events) {
    assert.ok(Number.isFinite(e.year) && e.year > 1500 && e.year < 2100, `bad year ${e.year}`);
    assert.ok(e.title && e.title.length > 3, `event ${e.year} missing title`);
    assert.equal(typeof e.dateVerified, 'boolean', `event "${e.title}" missing dateVerified`);
  }
});

/** Mirror of build.js's esc(), for asserting on rendered HTML. */
const escd = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function archives() {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'archives.json'), 'utf8')).snapshots || {};
  } catch { return {}; /* no archive cache yet */ }
}

test('every locale renders a full page with the right lang, SEO and disclaimer', () => {
  const base = siteBase(data.meta);
  for (const lang of LOCALES) {
    const html = renderPage(localizeData(data, loadDict(lang), lang), archives(), { lang, base, route: '', places, world });
    assert.match(html, /<!DOCTYPE html>/);
    assert.match(html, /G-R9LV1QZHVE/, `${lang}: Google Analytics tag missing`);
    assert.match(html, new RegExp(`<html lang="${lang}"`), `${lang}: wrong <html lang>`);
    assert.match(html, new RegExp('id="chronology"'));
    assert.match(html, new RegExp('id="branch-timeline"'), `${lang}: diffusion timeline missing`);
    assert.match(html, new RegExp('id="lineage"'), `${lang}: institutional arc missing`);
    assert.match(html, new RegExp('id="numbers-chart"'), `${lang}: contested-numbers chart missing`);
    assert.match(html, new RegExp('id="references"'));
    assert.ok(html.includes(`<link rel="canonical" href="${base}${lang}/">`), `${lang}: canonical missing`);
    for (const l of LOCALES) assert.ok(html.includes(`hreflang="${l}"`), `${lang}: hreflang ${l} missing`);
    assert.ok(html.includes('hreflang="x-default"'), `${lang}: x-default missing`);
    assert.ok(html.includes('application/ld+json'), `${lang}: JSON-LD missing`);
    assert.ok(html.includes(`"inLanguage": "${lang}"`), `${lang}: JSON-LD inLanguage wrong`);
    assert.ok(html.includes('href="../styles.css"'), `${lang}: stylesheet path not locale-relative`);
    assert.match(html, /class="lang-switch"/, `${lang}: language switcher missing`);
    for (const l of LOCALES.filter((l) => l !== lang)) {
      assert.ok(html.includes(`href="../${l}/" hreflang="${l}"`), `${lang}: switcher missing ${l}`);
    }
    if (lang === 'en') assert.ok(!html.includes('i18n-disclaimer'), 'English page must not carry the disclaimer');
    else assert.match(html, /class="i18n-disclaimer"/, `${lang}: machine-translation disclaimer missing`);
    // Bibliographic data is passed through verbatim in every locale.
    for (const r of data.references) {
      assert.ok(html.includes(escd(r.url)), `${lang}: reference ${r.id} url not rendered`);
      assert.ok(html.includes(escd(r.title)), `${lang}: reference ${r.id} title was not passed through verbatim`);
      assert.ok(html.includes(escd(r.publisher)), `${lang}: reference ${r.id} publisher was not passed through verbatim`);
    }
  }
});

test('English render is the identity localization (content unchanged)', () => {
  const en = localizeData(data, loadDict('en'), 'en');
  assert.equal(JSON.stringify(en.events), JSON.stringify(data.events));
  assert.equal(JSON.stringify(en.figures), JSON.stringify(data.figures));
  assert.equal(JSON.stringify(en.references), JSON.stringify(data.references));
  assert.equal(JSON.stringify(en.numbersChart), JSON.stringify(data.numbersChart));
  assert.equal(JSON.stringify(en.branchTimeline), JSON.stringify(data.branchTimeline));
});

test('pt/es caches are complete and preserve dates, figures and glossary ids', () => {
  for (const lang of LOCALES.filter((l) => l !== 'en')) {
    const cache = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'i18n', `${lang}.json`), 'utf8'));
    const dict = cache.strings;
    assert.ok(Object.keys(dict).length > 0, `${lang}: empty cache`);
    for (const [src, translated] of Object.entries(dict)) {
      assert.ok(translated && translated.trim(), `${lang}: empty translation for "${src.slice(0, 50)}…"`);
      // Years and percentages are facts: they must survive the translation.
      const toks = new Set([...(src.match(/\b(1[5-9]\d\d|20\d\d)\b/g) || []), ...(src.match(/\b\d{1,3}%/g) || [])]);
      for (const tok of toks) {
        assert.ok(translated.includes(tok), `${lang}: "${tok}" dropped from "${src.slice(0, 50)}…"`);
      }
      // [[term-id]] glossary markers keep their ids verbatim (ids are URLs).
      const ids = (s) => [...s.matchAll(/\[\[([a-z0-9][a-z0-9-]*)(?:\|[^\]|]*)?\]\]/g)].map((m) => m[1]).sort();
      assert.deepEqual(ids(translated), ids(src), `${lang}: glossary marker ids changed in "${src.slice(0, 50)}…"`);
    }
    // The two sensitive figures must actually render translated, not fall back.
    const html = renderPage(localizeData(data, dict, lang), archives(), { lang, base: siteBase(data.meta), route: '' });
    assert.ok(html.includes(escd(dict[data.numbersChart.unitNote])), `${lang}: 'not directly comparable' banner not translated`);
    for (const s of data.numbersChart.series) {
      assert.ok(html.includes(escd(dict[s.sourceLabel])), `${lang}: numbers-chart source label not translated`);
      assert.ok(html.includes(escd(dict[s.unit])), `${lang}: numbers-chart unit not translated`);
    }
    const brazilFork = data.branchTimeline.branches.find((b) => b.id === 'brazil');
    assert.ok(html.includes(escd(dict[brazilFork.label])), `${lang}: 1969-vs-1972 fork label not translated`);
    assert.match(dict[brazilFork.label], /1969[\s\S]*1972/, `${lang}: 1969-vs-1972 divergence lost from the fork label`);
  }
});

test('sitemap lists every route × locale with alternates; robots points to it', () => {
  const base = siteBase(data.meta);
  const sitemap = renderSitemap(base, ROUTES);
  assert.match(sitemap, /<\?xml/);
  assert.match(sitemap, /xmlns:xhtml=/);
  for (const route of ROUTES) for (const lang of LOCALES) {
    assert.ok(sitemap.includes(`<loc>${base}${lang}/${route}</loc>`), `sitemap missing ${lang}/${route}`);
  }
  assert.ok(renderRobots(base).includes(`Sitemap: ${base}sitemap.xml`));
});

test('root stub redirects and declares alternates (no page content)', () => {
  const stub = renderRootStub(siteBase(data.meta));
  assert.match(stub, /location\.replace/);
  assert.match(stub, /hreflang="x-default"/);
  assert.ok(!stub.includes('id="chronology"'), 'root stub should not contain page content');
});

test('committed docs/ is the current render for every locale (no drift)', () => {
  const docs = path.join(ROOT, 'docs');
  const base = siteBase(data.meta);
  assert.equal(fs.readFileSync(path.join(docs, 'index.html'), 'utf8'), renderRootStub(base), 'root stub drift — run node build.js');
  assert.equal(fs.readFileSync(path.join(docs, 'sitemap.xml'), 'utf8'), renderSitemap(base, ROUTES), 'sitemap drift — run node build.js');
  assert.equal(fs.readFileSync(path.join(docs, 'robots.txt'), 'utf8'), renderRobots(base), 'robots drift — run node build.js');
  for (const lang of LOCALES) {
    assert.equal(
      fs.readFileSync(path.join(docs, lang, 'index.html'), 'utf8'),
      renderPage(localizeData(data, loadDict(lang), lang), archives(), { lang, base, route: '', places, world }),
      `docs/${lang}/ out of date — run node build.js`
    );
  }
});

/* -------------------------------------------------------------------------
 * Places map: the dataset-specific regression rcc#18 was opened about.
 * "Topeka / Los Angeles, USA" and "Lucca, Italy / Rome" are each ONE event
 * in TWO places; a one-pin-per-event map would drop the second and misplace
 * the origin of the movement. Every compound string must yield every marker.
 * ---------------------------------------------------------------------- */

test('compound place strings keep every location on the real dataset', () => {
  const layout = layoutPlacesMap(data.placesMap, data.events, places);
  assert.ok(layout, 'placesMap is declared, so the map must render');
  const ids = new Set(layout.pins.map((p) => p.id));
  for (const id of ['topeka', 'los-angeles', 'lucca', 'rome']) {
    assert.ok(ids.has(id), `marker "${id}" missing — a compound place string lost a location`);
  }
  // The gazetteer covers this dataset today; the validator only WARNS on new
  // unresolved strings (core#24), and this assertion documents current state.
  assert.equal(layout.unresolvedEvents, 0, `unresolved: ${layout.unresolvedStrings.join(', ')} — add to core data/places.json and re-run scripts/sync-places.js`);
});
