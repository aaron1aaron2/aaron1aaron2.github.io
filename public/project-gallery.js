(() => {
  'use strict';

  // Loading the enhancement twice must not attach duplicate listeners.
  if (document.documentElement.hasAttribute('data-project-gallery-runtime')) return;
  document.documentElement.setAttribute('data-project-gallery-runtime', '');

  const en = /^en(?:-|$)/i.test(document.documentElement.lang);
  const words = {
    gallery: en ? 'Project images' : '專案圖片',
    carousel: en ? 'image carousel' : '圖片輪播',
    slide: en ? 'slide' : '圖片',
    previous: en ? 'Previous image' : '上一張圖片',
    next: en ? 'Next image' : '下一張圖片'
  };
  const viewerIsOpen = () => document.body.classList.contains('image-preview-open') ||
    Boolean(document.querySelector('.image-lightbox[open]'));

  function initialize(gallery) {
    if (gallery.hasAttribute('data-gallery-ready')) return;
    const stage = gallery.querySelector('.gallery-slides');
    if (!stage) return;
    const slides = [...stage.children].filter(node => node.matches('.gallery-slide'));
    if (!slides.length) return;
    const controls = gallery.querySelector('.gallery-controls');
    const previous = gallery.querySelector('[data-gallery-prev]');
    const next = gallery.querySelector('[data-gallery-next]');
    const count = gallery.querySelector('.gallery-count');
    // Incomplete markup keeps its readable, all-images fallback.
    if (slides.length > 1 && (!controls || !previous || !next || !count)) return;
    gallery.setAttribute('data-gallery-ready', '');
    if (!gallery.hasAttribute('role')) gallery.setAttribute('role', 'region');
    if (!gallery.hasAttribute('aria-label')) gallery.setAttribute('aria-label', words.gallery);
    if (slides.length > 1) gallery.setAttribute('aria-roledescription', words.carousel);
    previous?.setAttribute('aria-label', words.previous);
    next?.setAttribute('aria-label', words.next);
    if (count) {
      count.setAttribute('aria-live', 'polite');
      count.setAttribute('aria-atomic', 'true');
    }
    slides.forEach((slide, index) => {
      if (slides.length < 2) return;
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', words.slide);
      slide.setAttribute('aria-label', en ? `${index + 1} of ${slides.length}` :
        `第 ${index + 1} 張，共 ${slides.length} 張`);
    });

    let current = 0;
    function show(index) {
      const focused = document.activeElement;
      const moveImageFocus = slides[current].contains(focused);
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => { slide.hidden = position !== current; });
      if (count) count.textContent = `${current + 1} / ${slides.length}`;
      // An arrow key used on an image link must not leave focus in a hidden slide.
      if (moveImageFocus) slides[current].querySelector('a, button, [tabindex="0"]')?.focus({preventScroll: true});
    }
    show(0);
    if (controls) controls.hidden = slides.length < 2;
    if (slides.length < 2) return;
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    gallery.addEventListener('keydown', event => {
      if (viewerIsOpen() || event.defaultPrevented || event.altKey || event.ctrlKey ||
          event.metaKey || event.shiftKey || !(event.target instanceof Element) ||
          event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      show(current + (event.key === 'ArrowRight' ? 1 : -1));
    });

    // Only a deliberate horizontal touch gesture changes images. Vertical scroll
    // and pinch zoom remain native; an ordinary image tap still opens the viewer.
    let gesture = null;
    let suppressClickUntil = 0;
    stage.addEventListener('pointerdown', event => {
      if (!event.isPrimary || !['touch', 'pen'].includes(event.pointerType) || viewerIsOpen()) return;
      gesture = {id: event.pointerId, x: event.clientX, y: event.clientY};
    }, {passive: true});
    stage.addEventListener('pointermove', event => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const x = Math.abs(event.clientX - gesture.x);
      const y = Math.abs(event.clientY - gesture.y);
      if (y > 12 && y > x) gesture = null;
    }, {passive: true});
    stage.addEventListener('pointercancel', () => { gesture = null; }, {passive: true});
    stage.addEventListener('pointerup', event => {
      if (!gesture || event.pointerId !== gesture.id) return;
      const x = event.clientX - gesture.x;
      const y = event.clientY - gesture.y;
      gesture = null;
      if (viewerIsOpen() || Math.abs(x) < 40 || Math.abs(x) < Math.abs(y) * 1.5) return;
      suppressClickUntil = performance.now() + 400;
      show(current + (x < 0 ? 1 : -1));
    }, {passive: true});
    stage.addEventListener('click', event => {
      if (performance.now() >= suppressClickUntil) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);
  }

  function initializeWithin(root) {
    if (root instanceof Element && root.matches('[data-gallery]')) initialize(root);
    root.querySelectorAll?.('[data-gallery]').forEach(initialize);
  }
  function start() {
    initializeWithin(document);
    // Catalog switches move existing nodes: their state and listeners survive.
    // Newly inserted galleries can use the same component without another script.
    new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) initializeWithin(node);
        }
      }
    }).observe(document.body, {childList: true, subtree: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
