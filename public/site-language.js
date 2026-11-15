// Plain language links work without JavaScript; enhance them with the current view and section.
function syncLanguageLinks() {
 for (const link of document.querySelectorAll('.language-link')) {
  const target = new URL(link.href);
  target.search = location.search;
  target.hash = location.hash;
  link.href = target.href;
 }
}
syncLanguageLinks();
addEventListener('hashchange', syncLanguageLinks);
addEventListener('popstate', syncLanguageLinks);
