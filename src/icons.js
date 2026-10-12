// Inline SVG icons (line style, 24×24, stroke = currentColor).

const svg = (body, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"${extra}>${body}</svg>`;

export const icons = {
  star: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 2.9l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.7l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" stroke-linejoin="round"/></svg>`,
  phone: svg('<path d="M8.5 3h7A1.5 1.5 0 0 1 17 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 19.5v-15A1.5 1.5 0 0 1 8.5 3z"/><path d="M11 18h2"/>'),
  call: svg('<path d="M5 4h3l1.5 4-2 1.3a10.5 10.5 0 0 0 7.2 7.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  whatsapp: svg('<path d="M4 20l1.2-3.6A8 8 0 1 1 8 19z"/><path d="M9.2 8.6c0 3.2 2.9 6.1 6.1 6.1l1-1.5-1.8-.9-.8.8a4.6 4.6 0 0 1-2.4-2.4l.8-.8-.9-1.8z" stroke-width="1.4"/>'),
  pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
  heart: svg('<path d="M12 19.5s-7-4.3-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.1c0 5.1-7 9.4-7 9.4z"/>'),
  pen: svg('<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14 8l2 2"/>'),
  refresh: svg('<path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 4v4h4"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 20v-4h-4"/>'),
  external: svg('<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v4.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10"/>'),
  copy: svg('<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2"/><path d="M15.5 8.5V5.5A1.5 1.5 0 0 0 14 4H5.5A1.5 1.5 0 0 0 4 5.5V14a1.5 1.5 0 0 0 1.5 1.5h3"/>'),
  check: svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
};

// Decorative phone & accessory line art for the header background.
export const motif = `<svg class="motif" viewBox="0 0 400 180" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <g transform="translate(26 34) rotate(-12)"><rect x="0" y="0" width="34" height="62" rx="7"/><path d="M13 55h8"/><path d="M12 5h10"/></g>
  <g transform="translate(330 30) rotate(10)"><path d="M6 10a9 9 0 0 1 18 0v4"/><rect x="2" y="12" width="8" height="14" rx="4"/><rect x="20" y="12" width="8" height="14" rx="4"/></g>
  <g transform="translate(300 112) rotate(-8)"><rect x="6" y="8" width="22" height="26" rx="6"/><path d="M11 8V0h12v8M11 34v8h12v-8"/><path d="M17 16v5l3 2"/></g>
  <g transform="translate(70 118) rotate(14)"><rect x="0" y="6" width="22" height="18" rx="4"/><path d="M6 6V0M16 6V0"/><path d="M11 24v8c0 6 6 6 10 6h12"/></g>
  <g transform="translate(360 88)"><path d="M0 6l3-6 3 6-3 6z"/></g>
  <g transform="translate(18 104)"><circle cx="3" cy="3" r="2.5"/></g>
</svg>`;
