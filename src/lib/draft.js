import { fill } from './i18n.js';

/** Joins items as "a, b and c" using the language's word for "and". */
export function joinList(items, and) {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** An opener/closer entry is one sentence or a list of alternatives. */
function pick(entry, variant) {
  if (Array.isArray(entry)) return entry.length ? entry[variant % entry.length] : '';
  return entry || '';
}

/**
 * Builds a short, plain review draft from the rating and selected tags.
 * `variant` picks a different wording (and tag order) for the same tags,
 * so "New suggestion" always has something new to show.
 * @param {{ rating: number, tagIds: string[], s: object, shopName: string, variant?: number }} input
 */
export function buildDraft({ rating, tagIds, s, shopName, variant = 0 }) {
  const { openers, closers, and, stop } = s.draft;
  const phrases = tagIds.map((id) => s.tags[id]?.phrase).filter(Boolean);
  const shift = phrases.length ? variant % phrases.length : 0;
  const ordered = [...phrases.slice(shift), ...phrases.slice(0, shift)];
  const parts = [fill(pick(openers[rating], variant), { shop: shopName })];
  if (ordered.length) parts.push(capitalize(joinList(ordered, and)) + stop);
  parts.push(pick(closers[rating], variant));
  return parts.filter(Boolean).join(' ');
}
