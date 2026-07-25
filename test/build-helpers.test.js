'use strict';
// Unit tests for build.js's pure helpers (zero-dependency; node --test).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  esc, formatArchiveTs, renderCites, decadeOf,
  translator, siteBase, alternates, localizeData, langSwitcher,
  renderNumbersChart, TRANSLATABLE_KEYS, UI, LOCALES,
} = require('../build.js');

test('esc escapes HTML metacharacters', () => {
  assert.equal(esc('<a href="x">&\'</a>'), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;');
  assert.equal(esc(null), '');
  assert.equal(esc(5), '5');
});

test('formatArchiveTs renders a Wayback timestamp as YYYY-MM-DD', () => {
  assert.equal(formatArchiveTs('20260714120000'), '2026-07-14');
  assert.equal(formatArchiveTs(''), '');
  assert.equal(formatArchiveTs(undefined), '');
});

test('renderCites links known ids, passes raw URLs through, drops unknowns', () => {
  const nums = new Map([['wiki', 1], ['official', 2]]);
  const html = renderCites(['wiki', 'official'], nums);
  assert.match(html, /#ref-1/);
  assert.match(html, /#ref-2/);
  assert.match(renderCites(['https://example.org/x'], nums), /\[web\]/);
  assert.equal(renderCites(['nope'], nums), '');
  assert.equal(renderCites([], nums), '');
  assert.equal(renderCites(undefined, nums), '');
});

test('decadeOf groups years into decades', () => {
  assert.equal(decadeOf(1970), '1970s');
  assert.equal(decadeOf(1979), '1970s');
  assert.equal(decadeOf(2026), '2020s');
});

/* --- i18n helpers (adopted from the cronologia/core template) ------------ */

test('translator returns the translation when present, else the English source', () => {
  const t = translator({ Hello: 'Olá' });
  assert.equal(t('Hello'), 'Olá');
  assert.equal(t('Missing'), 'Missing');
  assert.equal(t(null), null);
});

test('siteBase normalizes to exactly one trailing slash', () => {
  assert.equal(siteBase({ siteUrl: 'https://x.io/rcc' }), 'https://x.io/rcc/');
  assert.equal(siteBase({ siteUrl: 'https://x.io/rcc///' }), 'https://x.io/rcc/');
  assert.match(siteBase({}), /\/$/);
});

test('alternates emits a self canonical + hreflang for every locale + x-default', () => {
  const html = alternates('https://x.io/rcc/', 'a.html', 'pt');
  assert.match(html, /<link rel="canonical" href="https:\/\/x\.io\/rcc\/pt\/a\.html">/);
  assert.match(html, /hreflang="en" href="https:\/\/x\.io\/rcc\/en\/a\.html"/);
  assert.match(html, /hreflang="es" href="https:\/\/x\.io\/rcc\/es\/a\.html"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/x\.io\/rcc\/"/);
});

test('langSwitcher preserves the route and only swaps the locale segment', () => {
  const html = langSwitcher('', 'pt', UI.pt);
  assert.match(html, /class="lang-switch"/);
  assert.match(html, /<span class="lang-current" aria-current="true">PT<\/span>/);
  for (const l of LOCALES.filter((l) => l !== 'pt')) {
    assert.ok(html.includes(`href="../${l}/"`), `switcher missing ${l}`);
  }
});

test('localizeData translates whitelisted prose, sets lang, and never touches references', () => {
  const data = {
    meta: { title: 'T', description: 'Hello', language: 'en' },
    events: [{ year: 1970, title: 'Hello', place: 'Rome', date: '1970', dateVerified: true, sources: ['r'] }],
    figures: [{ name: 'Hello', role: 'Hello', sources: ['r'] }],
    lineage: { edgeLegend: { direct: 'Hello', indirect: 'Hello' }, trees: [] },
    references: [{ id: 'r', title: 'Hello', url: 'https://x', publisher: 'P', type: 'x' }],
  };
  const pt = localizeData(data, { Hello: 'Olá' }, 'pt');
  assert.equal(pt.meta.language, 'pt');
  assert.equal(pt.meta.description, 'Olá');       // description: translated
  assert.equal(pt.events[0].title, 'Olá');        // event title: translated
  assert.equal(pt.figures[0].name, 'Hello');      // proper name: NOT translated
  assert.equal(pt.references[0].title, 'Hello');  // reference title: NOT translated
  assert.equal(pt.events[0].date, '1970');        // dates untouched
  assert.equal(pt.lineage.edgeLegend.direct, 'Olá');   // typed-edge legend: translated
  assert.equal(pt.lineage.edgeLegend.indirect, 'Olá');
  // English (empty dict) is the identity transform on content.
  const en = localizeData(data, {}, 'en');
  assert.equal(JSON.stringify(en.events), JSON.stringify(data.events));
});

test('contested-numbers chart localizes its axis note and per-series source attribution', () => {
  // The figure's whole point is that the series are NOT comparable: the per-
  // series source label, unit and "reported by" caption must read as clearly in
  // pt/es as in English, or the honesty of the figure is lost in translation.
  const nc = {
    heading: 'H',
    unitNote: 'Not directly comparable.',
    series: [{
      label: 'L', sourceLabel: 'Movement self-report', unit: 'million participants',
      axisMax: 4, sources: [], points: [{ year: 1994, value: 3.8, display: 'D' }],
    }],
  };
  const nums = new Map();
  const en = renderNumbersChart(nc, nums, UI.en);
  assert.match(en, /axis: 0–4 million participants/);
  assert.match(en, / — reported by Movement self-report, in million participants/);
  assert.ok(en.includes('Not directly comparable.'), 'unitNote banner missing');
  for (const lang of ['pt', 'es']) {
    const html = renderNumbersChart(nc, nums, UI[lang]);
    assert.ok(!html.includes('axis: 0–'), `${lang}: axis note left in English`);
    assert.ok(!html.includes('reported by'), `${lang}: caption attribution left in English`);
    assert.ok(html.includes('Movement self-report'), `${lang}: source label dropped`);
    assert.ok(html.includes('Not directly comparable.'), `${lang}: unitNote banner dropped`);
  }
});

test('scripts/translate.js collects exactly build.js TRANSLATABLE_KEYS', () => {
  // The cache generator duplicates the key set (template shape); a drift there
  // would silently leave strings out of the caches.
  const src = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'translate.js'), 'utf8');
  const block = src.match(/const TRANSLATABLE_KEYS = new Set\(\[([\s\S]*?)\]\);/);
  assert.ok(block, 'translate.js TRANSLATABLE_KEYS literal not found');
  const keys = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]).sort();
  assert.deepEqual(keys, [...TRANSLATABLE_KEYS].sort());
});
