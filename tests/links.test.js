import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveReviewLink, buildReviewUrl, isStorePageUrl, whatsappUrl, telUrl, directionsUrl } from '../src/lib/links.js';
import shop from '../shop.config.js';

test('placeId builds the "Write a review" URL', () => {
  const link = resolveReviewLink({ placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' });
  assert.equal(link.url, 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4');
  assert.equal(link.source, 'placeId');
});

test('reviewUrl is used as is, and wins over placeId', () => {
  const link = resolveReviewLink({ reviewUrl: 'https://g.page/r/CabcDEF123/review', placeId: 'ChIJxyz' });
  assert.equal(link.url, 'https://g.page/r/CabcDEF123/review');
  assert.equal(link.source, 'reviewUrl');
});

test('reviewUrl without https:// still works', () => {
  assert.equal(buildReviewUrl({ reviewUrl: 'g.page/r/CabcDEF123/review' }), 'https://g.page/r/CabcDEF123/review');
});

test('store-page links are rejected for the review button', () => {
  for (const url of [
    'https://www.google.com/maps/place/Shanu%27s+Gadgets/@23.7,91.3,17z',
    'https://maps.app.goo.gl/abc123',
    'https://goo.gl/maps/abc123',
    'https://share.google/IpLBwbsm6F8jadyfW',
    'https://maps.google.com/?cid=123',
  ]) {
    assert.ok(isStorePageUrl(url), url);
    const link = resolveReviewLink({ reviewUrl: url });
    assert.equal(link.url, '', url);
    assert.match(link.problem, /store page/);
  }
  // Falls back to placeId when the reviewUrl is a store page.
  assert.equal(
    buildReviewUrl({ reviewUrl: 'https://maps.app.goo.gl/abc', placeId: 'ChIJxyz' }),
    'https://search.google.com/local/writereview?placeid=ChIJxyz',
  );
});

test('nothing configured gives no link instead of an invented one', () => {
  assert.deepEqual(resolveReviewLink({}), {
    url: '',
    source: null,
    problem: 'Neither reviewUrl nor placeId is set in shop.config.js.',
  });
});

test('shop.config.js never points the review button at a store page', () => {
  const url = buildReviewUrl(shop);
  if (url) assert.ok(!isStorePageUrl(url));
});

test('shop.config.js siteUrl is a website address, not the GitHub page', () => {
  if (!shop.siteUrl) return;
  const { hostname, protocol } = new URL(shop.siteUrl);
  assert.notEqual(hostname, 'github.com');
  assert.equal(protocol, 'https:');
});

test('contact links', () => {
  assert.equal(telUrl('+91 70058 38381'), 'tel:+917005838381');
  assert.equal(whatsappUrl('91 7005-838381', 'Hi there'), 'https://wa.me/917005838381?text=Hi%20there');
  assert.equal(directionsUrl({ mapsUrl: 'https://share.google/x' }), 'https://share.google/x');
  assert.equal(
    directionsUrl({ shopName: 'Shop', address: 'Road 1', placeId: 'ChIJxyz' }),
    'https://www.google.com/maps/dir/?api=1&destination=Shop%2C+Road+1&destination_place_id=ChIJxyz',
  );
});
