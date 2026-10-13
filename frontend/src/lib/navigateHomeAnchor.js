/** Preserve native fragment replacement when a Next Link stays on the homepage. */
export default function navigateHomeAnchor(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const destination = new URL(event.currentTarget.href, window.location.href);
  if (destination.origin !== window.location.origin || window.location.pathname !== '/' || destination.pathname !== '/') return;
  event.preventDefault();
  const oldURL = window.location.href;
  if (oldURL !== destination.href) {
    // Next integrates this API with its canonical URL and navigation state.
    window.history.pushState(null, '', destination.pathname + destination.search + destination.hash);
  }
  if (destination.hash) window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL, newURL: destination.href }));
  else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}
