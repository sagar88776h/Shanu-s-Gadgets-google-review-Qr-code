import { fill } from './i18n.js';

/** Joins items as "a, b and c" using the language's word for "and". */
export function joinList(items, and) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Builds a short, plain review draft from the rating and selected tags.
 * @param {{ rating: number, tagIds: string[], s: object, shopName: string }} input
 */
export function buildDraft({ rating, tagIds, s, shopName }) {
  const { openers, closers, and, stop } = s.draft;
  const phrases = tagIds.map((id) => s.tags[id]?.phrase).filter(Boolean);
  const parts = [fill(openers[rating] || '', { shop: shopName })];
  if (phrases.length) parts.push(capitalize(joinList(phrases, and)) + stop);
  parts.push(closers[rating] || '');
  return parts.filter(Boolean).join(' ');
}
