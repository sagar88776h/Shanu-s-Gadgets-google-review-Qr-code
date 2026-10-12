import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildDraft, joinList } from '../src/lib/draft.js';
import { getStrings, fill, LANGS } from '../src/lib/i18n.js';
import { strings, tagGroups } from '../src/strings.js';

const shopName = "Shanu's Gadgets";

test('5★ English draft reads naturally', () => {
  const draft = buildDraft({ rating: 5, tagIds: ['genuine', 'fairPrice', 'helpfulStaff'], s: getStrings('en'), shopName });
  assert.equal(
    draft,
    "Great experience at Shanu's Gadgets. The products are genuine, the prices are fair and the staff were helpful. Would recommend.",
  );
});

test('low-rating draft uses the "what went wrong" phrases', () => {
  const draft = buildDraft({ rating: 2, tagIds: ['longWait'], s: getStrings('en'), shopName });
  assert.equal(draft, "Not a great experience at Shanu's Gadgets. I had to wait a long time. Hope they can fix this.");
});

test('Hindi draft uses Hindi joiner and full stop', () => {
  const draft = buildDraft({ rating: 4, tagIds: ['genuine', 'fairPrice'], s: getStrings('hi'), shopName });
  assert.equal(draft, "Shanu's Gadgets पर अच्छा अनुभव रहा। प्रोडक्ट असली हैं और दाम सही हैं। आप भी ज़रूर आज़माएँ।");
});

test('no tags still gives a short draft', () => {
  assert.equal(buildDraft({ rating: 3, tagIds: [], s: getStrings('en'), shopName }), "Mixed experience at Shanu's Gadgets. Hope they can improve this.");
});

test('joinList', () => {
  assert.equal(joinList(['a'], 'and'), 'a');
  assert.equal(joinList(['a', 'b'], 'and'), 'a and b');
  assert.equal(joinList(['a', 'b', 'c'], 'और'), 'a, b और c');
});

test('every language has every tag and both rating word lists', () => {
  for (const lang of LANGS) {
    const s = strings[lang];
    for (const id of [...tagGroups.positive, ...tagGroups.negative]) {
      assert.ok(s.tags[id]?.label && s.tags[id]?.phrase, `${lang}: tag ${id}`);
    }
    assert.equal(s.ratingWords.length, 6, `${lang}: ratingWords`);
    for (const rating of [1, 2, 3, 4, 5]) {
      assert.ok([s.draft.openers[rating]].flat().filter(Boolean).length, `${lang}: opener for ${rating}★`);
      assert.ok([s.draft.closers[rating]].flat().filter(Boolean).length, `${lang}: closer for ${rating}★`);
    }
  }
});

test('missing strings fall back to English', () => {
  strings.xx = { langName: 'Test' };
  try {
    const s = getStrings('xx');
    assert.equal(s.openReviewBtn, 'Open Google Review');
    assert.equal(s.tags.genuine.label, 'Genuine products');
  } finally {
    delete strings.xx;
  }
});

test('fill', () => {
  assert.equal(fill('{a} and {b} {c}', { a: 1, b: 'two' }), '1 and two {c}');
});

test('no incentive wording anywhere in the text', () => {
  const all = JSON.stringify(strings).toLowerCase();
  for (const word of ['discount', 'free gift', 'coupon', 'offer', 'cashback', 'reward', 'छूट', 'इनाम', 'कूपन']) {
    assert.ok(!all.includes(word), word);
  }
});

test('"New suggestion" variants give different wording for the same tags', () => {
  for (const lang of ['en', 'hi']) {
    for (const rating of [1, 2, 3, 4, 5]) {
      for (const tagIds of [[], rating >= 4 ? ['genuine', 'fairPrice'] : ['longWait', 'highPrice']]) {
        const drafts = [0, 1, 2].map((variant) => buildDraft({ rating, tagIds, s: getStrings(lang), shopName, variant }));
        assert.equal(new Set(drafts).size, 3, `${lang} ${rating}★ ${tagIds.join('+') || 'no tags'}: ${drafts.join(' | ')}`);
        for (const d of drafts) {
          assert.ok(d.includes(shopName), `${lang} ${rating}★: shop name in "${d}"`);
          assert.ok(!/undefined|\{\w+\}/.test(d), `${lang} ${rating}★: no leftovers in "${d}"`);
        }
      }
    }
  }
});

test('variants keep every selected tag and only reorder them', () => {
  const s = getStrings('en');
  const tagIds = ['genuine', 'fairPrice', 'helpfulStaff'];
  for (const variant of [0, 1, 2, 3, 7]) {
    const draft = buildDraft({ rating: 5, tagIds, s, shopName, variant }).toLowerCase();
    for (const id of tagIds) assert.ok(draft.includes(s.tags[id].phrase), `variant ${variant}: ${id}`);
  }
  assert.equal(
    buildDraft({ rating: 5, tagIds, s, shopName, variant: 1 }),
    "Really happy with my visit to Shanu's Gadgets. The prices are fair, the staff were helpful and the products are genuine. Thank you!",
  );
});

test('a single string still works as an opener/closer (older custom strings)', () => {
  const s = { ...getStrings('en'), draft: { openers: { 5: 'Hi {shop}.' }, closers: { 5: 'Bye.' }, and: 'and', stop: '.' } };
  assert.equal(buildDraft({ rating: 5, tagIds: ['genuine'], s, shopName, variant: 4 }), "Hi Shanu's Gadgets. The products are genuine. Bye.");
});
