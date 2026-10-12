import { strings } from '../strings.js';

export const LANGS = Object.keys(strings);

/** Strings for `lang`, with anything missing filled in from English. */
export function getStrings(lang) {
  const base = strings.en;
  const s = strings[lang] || base;
  return {
    ...base,
    ...s,
    tags: { ...base.tags, ...s.tags },
    draft: { ...base.draft, ...s.draft },
  };
}

/** Replaces {name} placeholders with values from `vars`. */
export function fill(template, vars = {}) {
  return String(template).replace(/\{(\w+)\}/g, (m, key) => (key in vars ? vars[key] : m));
}
