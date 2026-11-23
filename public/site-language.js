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

const downloadControl = document.querySelector(".site-download");
if (downloadControl) {
 const trigger = downloadControl.querySelector("summary");
 function closeDownloadOnExit(event) {
  if (downloadControl.open && !downloadControl.contains(event.target)) downloadControl.open = false;
 }
 document.addEventListener("click", closeDownloadOnExit);
 document.addEventListener("focusin", closeDownloadOnExit);
 downloadControl.addEventListener("keydown", event => {
  if (event.key !== "Escape" || !downloadControl.open) return;
  event.preventDefault();
  downloadControl.open = false;
  trigger.focus({preventScroll:true});
 });
 downloadControl.addEventListener("click", event => {
  if (!event.target.closest("a[download]")) return;
  downloadControl.open = false;
  trigger.focus({preventScroll:true});
 });
}
