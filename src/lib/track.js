// Privacy-friendly click counting hook. Nothing is sent unless
// shop.config.js has an analyticsEndpoint. No cookies, no personal data.
//
// You can also listen in the browser:
//   window.addEventListener('shop:track', (e) => console.log(e.detail));

export function createTracker(endpoint) {
  return function track(event, data = {}) {
    const detail = { event, ...data };
    window.dispatchEvent(new CustomEvent('shop:track', { detail }));
    if (!endpoint) return;
    try {
      const body = new Blob([JSON.stringify(detail)], { type: 'text/plain' });
      navigator.sendBeacon?.(endpoint, body);
    } catch {
      // Counting must never break the page.
    }
  };
}
