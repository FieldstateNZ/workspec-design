// Inline SVG icons used across frames.
const Icon = {
  check: (p) => <svg width={p.size||12} height={p.size||12} viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.4" fill="none"/></svg>,
  copy: (p) => <svg width={p.size||12} height={p.size||12} viewBox="0 0 12 12" fill="none"><rect x="3.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor"/><path d="M2 7.5V2.5A.5.5 0 0 1 2.5 2h5" stroke="currentColor"/></svg>,
  arrow: (p) => <svg width={p.size||10} height={p.size||10} viewBox="0 0 10 10"><path d="M2 5h6M5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>,
  user: () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="4" r="2" stroke="currentColor"/><path d="M2 11c0-2 2-3 4-3s4 1 4 3" stroke="currentColor" fill="none"/></svg>,
  users: () => <svg width="13" height="11" viewBox="0 0 14 12" fill="none"><circle cx="5" cy="4" r="2" stroke="currentColor"/><path d="M1 11c0-2 2-3 4-3s4 1 4 3" stroke="currentColor" fill="none"/><circle cx="10.5" cy="3.5" r="1.5" stroke="currentColor"/><path d="M9 8c1 0 4 .5 4 3" stroke="currentColor" fill="none"/></svg>,
  bolt: () => <svg width="11" height="11" viewBox="0 0 12 12"><path d="M7 1L3 7h2l-1 4 4-6H6z" fill="currentColor"/></svg>,
  plug: () => <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M4 1v3M8 1v3M3 4h6v3a3 3 0 0 1-6 0z M6 10v1.5" stroke="currentColor"/></svg>,
  cursor: (c) => <svg viewBox="0 0 16 16" fill={c||'currentColor'}><path d="M2 2 L2 13 L5.5 10 L8 14 L10 12.5 L7.5 9 L12 9 Z"/></svg>,
};
Object.assign(window, { Icon });
