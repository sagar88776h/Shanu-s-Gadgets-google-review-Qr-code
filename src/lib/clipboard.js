// Copies text in a way that finishes before a link opens a new tab.
// The synchronous execCommand path runs first because the async Clipboard API
// can fail once the new tab has taken focus.

function legacyCopy(text) {
  const span = document.createElement('span');
  span.textContent = text;
  span.style.cssText = 'position:fixed;top:0;left:0;white-space:pre-wrap;user-select:text;-webkit-user-select:text;opacity:0;pointer-events:none;';
  document.body.appendChild(span);
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(span);
  selection.removeAllRanges();
  selection.addRange(range);
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  selection.removeAllRanges();
  span.remove();
  return ok;
}

/** @returns {Promise<boolean>} whether the text reached the clipboard */
export function copyText(text) {
  if (legacyCopy(text)) return Promise.resolve(true);
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false,
    );
  }
  return Promise.resolve(false);
}
