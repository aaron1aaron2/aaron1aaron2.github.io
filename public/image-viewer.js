(() => {
 'use strict';
 if (typeof HTMLDialogElement === 'undefined' || !HTMLDialogElement.prototype.showModal) return;
 const en = document.documentElement.lang === 'en';
 const text = {
  title: en ? 'Image preview' : '圖片預覽',
  close: en ? 'Close image preview' : '關閉圖片預覽',
  enlarge: en ? 'Enlarge image: ' : '放大圖片：'
 };
 // Preserve normal image links as the fallback and for Ctrl/Cmd-click.
 for (const image of document.querySelectorAll('main img')) {
  const existing = image.closest('a');
  if (existing) {
   const source = new URL(existing.href, location.href);
   if (source.origin === location.origin && /\.(svg|png|jpe?g|webp)$/i.test(source.pathname)) existing.classList.add('original-media');
   continue;
  }
  const link = document.createElement('a');
  link.className = 'original-media';
  link.href = image.getAttribute('src');
  link.setAttribute('aria-label', text.enlarge + image.alt);
  image.replaceWith(link);
  link.append(image);
 }
 let dialog, preview, caption, closeButton, opener, position, bodyStyles, outsideStart = false;
 function outside(event) {
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right ||
   event.clientY < rect.top || event.clientY > rect.bottom;
 }
 function createViewer() {
  dialog = document.createElement('dialog');
  dialog.className = 'image-lightbox';
  dialog.setAttribute('aria-labelledby', 'image-lightbox-title');
  const panel = document.createElement('div');
  panel.className = 'image-lightbox-panel';
  const header = document.createElement('div');
  header.className = 'image-lightbox-header';
  const title = document.createElement('h2');
  title.id = 'image-lightbox-title';
  title.textContent = text.title;
  closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'image-lightbox-close';
  closeButton.setAttribute('aria-label', text.close);
  closeButton.textContent = '×';
  header.append(title, closeButton);
  const stage = document.createElement('div');
  stage.className = 'image-lightbox-stage';
  preview = document.createElement('img');
  preview.className = 'image-lightbox-image';
  preview.decoding = 'async';
  stage.append(preview);
  caption = document.createElement('p');
  caption.className = 'image-lightbox-caption';
  panel.append(header, stage, caption);
  dialog.append(panel);
  document.body.append(dialog);
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
   if (event.key !== 'Tab') return;
   const controls = [...dialog.querySelectorAll('button, [tabindex="0"]')];
   const first = controls[0], last = controls.at(-1);
   const focused = document.activeElement;
   if (event.shiftKey && (focused === first || !dialog.contains(focused))) {
    event.preventDefault(); last.focus();
   } else if (!event.shiftKey && (focused === last || !dialog.contains(focused))) {
    event.preventDefault(); first.focus();
   }
  });
  dialog.addEventListener('cancel', event => {
   event.preventDefault();
   dialog.close();
  });
  dialog.addEventListener('pointerdown', event => {
   outsideStart = event.target === dialog && outside(event);
  });
  dialog.addEventListener('click', event => {
   if (outsideStart && event.target === dialog && outside(event)) dialog.close();
   outsideStart = false;
  });
  dialog.addEventListener('close', () => {
   document.body.style.overflow = bodyStyles.overflow;
   document.body.style.paddingRight = bodyStyles.paddingRight;
   document.body.classList.remove('image-preview-open');
   preview.removeAttribute('src');
   opener?.focus({preventScroll: true});
   window.scrollTo({left: position.x, top: position.y, behavior: 'instant'});
  });
 }
 document.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey ||
      event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
  const link = event.target.closest('a.original-media');
  const image = link?.querySelector('img');
  if (!image) return;
  const source = new URL(image.closest('picture') && image.currentSrc ? image.currentSrc : link.href, location.href);
  if (source.origin !== location.origin || !/\.(svg|png|jpe?g|webp)$/i.test(source.pathname)) return;
  event.preventDefault();
  if (!dialog) createViewer();
  opener = link;
  position = {x: window.scrollX, y: window.scrollY};
  bodyStyles = {overflow: document.body.style.overflow, paddingRight: document.body.style.paddingRight};
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  if (scrollbar > 0) {
   document.body.style.paddingRight = (parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar) + 'px';
  }
  document.body.style.overflow = 'hidden';
  document.body.classList.add('image-preview-open');
  preview.alt = image.alt;
  preview.src = source.href;
  const portrait = /-core-mobile(?:-en)?\.svg$/i.test(source.pathname);
  dialog.classList.toggle('image-lightbox--portrait',portrait);
  const stage = preview.parentElement;
  stage.tabIndex = portrait ? 0 : -1;
  stage.scrollTop = 0;
  const description = link.closest('figure')?.querySelector('figcaption')?.textContent.trim();
  caption.textContent = description || image.alt;
  caption.hidden = !caption.textContent;
  outsideStart = false;
  dialog.showModal();
  caption.tabIndex = caption.scrollHeight > caption.clientHeight ? 0 : -1;
  closeButton.focus({preventScroll: true});
 });
})();
