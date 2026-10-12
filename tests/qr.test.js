import { test } from 'node:test';
import assert from 'node:assert/strict';
import { qrGeometry, qrSvg } from '../src/lib/qr-svg.js';

const URL = 'https://shanus-gadgets.example/';

test('classic style: square modules only', () => {
  const g = qrGeometry(URL, { style: 'classic' });
  assert.ok(g.modules.length > 100);
  assert.equal(g.eyes, '');
  assert.equal(g.pupils, '');
  assert.ok(!g.modules.includes('A'), 'no arcs in classic modules');
});

test('premium style: rounded modules, 3 corner squares with centres', () => {
  const g = qrGeometry(URL, { style: 'premium' });
  assert.ok(g.modules.includes('A'), 'rounded module corners');
  assert.equal((g.eyes.match(/M/g) || []).length, 6, '3 outer + 3 inner outlines');
  assert.equal((g.pupils.match(/M/g) || []).length, 3);
});

test('logo: modules under the logo are cleared, and only premium gets the gold ring', () => {
  const plain = qrGeometry(URL, { style: 'premium', withLogo: false });
  const withLogo = qrGeometry(URL, { style: 'premium', withLogo: true });
  assert.equal(plain.logo, null);
  assert.ok(withLogo.logo && withLogo.logo.clearRadius > withLogo.logo.box / 2);
  const premiumSvg = qrSvg(URL, { style: 'premium', logoHref: 'logo.png' });
  const classicSvg = qrSvg(URL, { style: 'classic', logoHref: 'logo.png' });
  assert.ok(premiumSvg.includes('<image href="logo.png"') && classicSvg.includes('<image href="logo.png"'));
  assert.ok(premiumSvg.includes('stroke="#c99a2e"'));
  assert.ok(!classicSvg.includes('stroke="#c99a2e"'));
  assert.ok(premiumSvg.includes('fill-rule="evenodd"'));
});

test('margin sets the white quiet zone around the code', () => {
  const svg = qrSvg(URL, { margin: 4 });
  const [x, y, w] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
  const { size } = qrGeometry(URL);
  assert.deepEqual([x, y, w], [-4, -4, size + 8]);
});
