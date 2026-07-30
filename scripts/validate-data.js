#!/usr/bin/env node
'use strict';
/**
 * validate-data.js — zero-dependency schema check for data/chronology.json.
 *
 * Validates required fields, types, and that every `sources` entry resolves to
 * a reference id (raw http(s) URLs are allowed as a migration path). Prints all
 * problems and exits non-zero if any are found, so CI can gate on it.
 *
 * Usage: node scripts/validate-data.js
 */

const fs = require('fs');
const path = require('path');
const { placeIndex, resolvePlaceString } = require('../build.js');

const ROOT = path.join(__dirname, '..');
const FILE = 'data/chronology.json';
const PLACES_FILE = 'data/places.json';
const errors = [];

const isStr = (v) => typeof v === 'string' && v.length > 0;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isArr = (v) => Array.isArray(v);

function err(msg) {
  errors.push(`${FILE}: ${msg}`);
}

let d;
try {
  d = JSON.parse(fs.readFileSync(path.join(ROOT, FILE), 'utf8'));
} catch (e) {
  console.error(`${FILE}: invalid JSON — ${e.message}`);
  process.exit(1);
}

// ---- meta -----------------------------------------------------------------
if (!d.meta) err('meta missing');
else {
  for (const k of ['title', 'subtitle', 'description', 'language', 'lastUpdated', 'dataQualityNote']) {
    if (!isStr(d.meta[k])) err(`meta.${k} missing`);
  }
  if (d.meta.lastUpdated && !/^\d{4}-\d{2}-\d{2}$/.test(d.meta.lastUpdated)) {
    err(`meta.lastUpdated must be YYYY-MM-DD, got ${d.meta.lastUpdated}`);
  }
}

// ---- references (validated first so sources[] can be checked against ids) --
const refIds = new Set();
if (!isArr(d.references) || d.references.length === 0) {
  err('references[] missing or empty');
} else {
  d.references.forEach((r, i) => {
    const at = `references[${i}]`;
    if (!isStr(r.id)) err(`${at}.id missing`);
    else if (refIds.has(r.id)) err(`${at}.id duplicated: ${r.id}`);
    else refIds.add(r.id);
    if (!isStr(r.title)) err(`${at}.title missing`);
    if (!isStr(r.url) || !/^https?:\/\//.test(r.url)) err(`${at}.url must be an http(s) URL`);
    if (!isStr(r.publisher)) err(`${at}.publisher missing`);
    if (!isStr(r.type)) err(`${at}.type missing`);
  });
}

function checkSources(at, sources, required) {
  if (sources === undefined) {
    if (required) err(`${at}.sources missing (every fact must be cited)`);
    return;
  }
  if (!isArr(sources)) return err(`${at}.sources must be an array`);
  if (required && sources.length === 0) err(`${at}.sources empty (every fact must be cited)`);
  for (const s of sources) {
    if (!refIds.has(s) && !/^https?:\/\//.test(s)) {
      err(`${at}.sources: unknown reference id "${s}"`);
    }
  }
}

// ---- facts ----------------------------------------------------------------
if (!isArr(d.facts) || d.facts.length === 0) err('facts[] missing or empty');
else {
  d.facts.forEach((f, i) => {
    const at = `facts[${i}]`;
    if (!isStr(f.label)) err(`${at}.label missing`);
    if (!isStr(f.value)) err(`${at}.value missing`);
    checkSources(at, f.sources, true);
  });
}

// ---- events ---------------------------------------------------------------
if (!isArr(d.events) || d.events.length === 0) err('events[] missing or empty');
else {
  d.events.forEach((ev, i) => {
    const at = `events[${i}]`;
    if (!isNum(ev.year) || ev.year < 1500 || ev.year > 2100) err(`${at}.year must be a plausible number`);
    if (!isStr(ev.title)) err(`${at}.title missing`);
    if (ev.date !== undefined && !isStr(ev.date)) err(`${at}.date must be a string`);
    if (typeof ev.dateVerified !== 'boolean') err(`${at}.dateVerified must be boolean`);
    checkSources(at, ev.sources, true);
  });
}

// ---- figures --------------------------------------------------------------
if (!isArr(d.figures) || d.figures.length === 0) err('figures[] missing or empty');
else {
  d.figures.forEach((f, i) => {
    const at = `figures[${i}]`;
    if (!isStr(f.name)) err(`${at}.name missing`);
    if (!isStr(f.role)) err(`${at}.role missing`);
    checkSources(at, f.sources, true);
  });
}

// ---- organizations --------------------------------------------------------
if (d.organizations !== undefined) {
  if (!isArr(d.organizations)) err('organizations must be an array');
  else d.organizations.forEach((o, i) => {
    const at = `organizations[${i}]`;
    if (!isStr(o.name)) err(`${at}.name missing`);
    if (!isStr(o.relation)) err(`${at}.relation missing`);
    checkSources(at, o.sources, true);
  });
}

// ---- placesMap (gazetteer-driven map) --------------------------------------
// Design principles (core#24): a place string resolves to a LIST of gazetteer
// ids (compound " / " strings are one event in several places); an unresolved
// place string is a WARNING, never a hard error — the dataset must stay
// editable without a coordinate lookup blocking a commit. The vendored
// gazetteer itself, however, must be well-formed when the map is declared.
if (d.placesMap !== undefined) {
  const pm = d.placesMap;
  const at = 'placesMap';
  if (pm === null || typeof pm !== 'object' || Array.isArray(pm)) {
    err(`${at} must be an object`);
  } else {
    for (const k of ['heading', 'navLabel', 'note']) {
      if (pm[k] !== undefined && !isStr(pm[k])) err(`${at}.${k} must be a string`);
    }
  }

  let gaz = null;
  try {
    gaz = JSON.parse(fs.readFileSync(path.join(ROOT, PLACES_FILE), 'utf8'));
  } catch (e) {
    err(`${at} is declared but ${PLACES_FILE} is missing or unreadable (${e.message}). Run: node scripts/sync-places.js`);
  }
  if (gaz) {
    if (!isArr(gaz.places) || gaz.places.length === 0) {
      err(`${PLACES_FILE}: places must be a non-empty array`);
    } else {
      const seen = new Set();
      gaz.places.forEach((p, i) => {
        const pAt = `${PLACES_FILE}: places[${i}]`;
        if (!isStr(p.id)) err(`${pAt}.id missing`);
        else if (seen.has(p.id)) err(`${pAt}.id "${p.id}" duplicated`);
        else seen.add(p.id);
        if (!isStr(p.name)) err(`${pAt}.name missing`);
        if (p.kind === 'non-geographic') {
          // Scopes ("Worldwide") deliberately carry no coordinates — and so
          // have no coordinate source to cite.
          if (p.lat !== undefined || p.lon !== undefined) err(`${pAt}: non-geographic entries must not carry lat/lon`);
        } else {
          // Coordinates are cited like everything else in this family.
          if (!isStr(p.source)) err(`${pAt}.source missing (coordinates are cited like any other fact)`);
          if (!isNum(p.lat) || p.lat < -90 || p.lat > 90) err(`${pAt}.lat must be a number in [-90, 90]`);
          if (!isNum(p.lon) || p.lon < -180 || p.lon > 180) err(`${pAt}.lon must be a number in [-180, 180]`);
        }
        if (p.variants !== undefined && (!isArr(p.variants) || p.variants.some((v) => !isStr(v)))) {
          err(`${pAt}.variants must be an array of strings`);
        }
      });
    }

    // Unresolved place strings: warn, never fail (core#24).
    const index = placeIndex(gaz);
    const unresolved = new Map(); // string -> event count
    for (const ev of d.events || []) {
      if (!ev.place) continue;
      const { missing } = resolvePlaceString(ev.place, index);
      for (const m of missing) unresolved.set(m, (unresolved.get(m) || 0) + 1);
    }
    if (unresolved.size) {
      console.warn(
        `⚠ ${unresolved.size} place string(s) not in the gazetteer (events stay valid; they will not be mapped):\n`
        + [...unresolved.entries()].map(([s, n]) => `  - "${s}" (${n} event${n === 1 ? '' : 's'})`).join('\n')
        + '\n  Add them to cronologia/core data/places.json and re-run scripts/sync-places.js.'
      );
    }
  }
}

// ---- disambiguation -------------------------------------------------------
if (d.disambiguation !== undefined) {
  const items = d.disambiguation.items;
  if (!isArr(items)) err('disambiguation.items must be an array');
  else items.forEach((it, i) => {
    const at = `disambiguation.items[${i}]`;
    if (!isStr(it.title)) err(`${at}.title missing`);
    if (!isStr(it.text)) err(`${at}.text missing`);
    checkSources(at, it.sources, false);
  });
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n` + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ ${FILE} is valid (${d.events.length} events, ${d.figures.length} figures, ${d.references.length} references).`);
