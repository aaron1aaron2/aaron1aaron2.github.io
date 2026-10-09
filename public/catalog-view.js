const categoryIds = new Set(['platform', 'data', 'research', 'collaboration']);

export function safeDecodeHash(hash) {
  const raw = String(hash || '').replace(/^#/, '');
  try { return decodeURIComponent(raw); } catch { return raw; }
}

export function chooseView(search, hash) {
  const anchor = safeDecodeHash(hash);
  if (categoryIds.has(anchor)) return 'type';
  return new URLSearchParams(search).get('view') === 'time' ? 'time' : 'type';
}

export function orderedYears(records) {
  const years = [...new Set(records.map(record => record.year).filter(Number.isInteger))].sort((a, b) => b - a);
  if (records.some(record => !Number.isInteger(record.year))) years.push(null);
  return years;
}

export function viewPlan(records, view) {
  const order = view === 'time' ? orderedYears(records) : [];
  return records.map((record, index) => {
    const year = Number.isInteger(record.year) ? record.year : null;
    return {
      id: record.id,
      destination: view === 'time' ? 'time-' + (year ?? 'unknown') : record.group,
      rank: view === 'time' ? order.indexOf(year) * records.length + index : index
    };
  }).sort((a, b) => a.rank - b.rank);
}

function init() {
  const typePanel = document.getElementById('catalog-type');
  const timePanel = document.getElementById('catalog-time');
  const typeButton = document.getElementById('view-type');
  const timeButton = document.getElementById('view-time');
  const status = document.getElementById('catalog-view-status');
  const toolbar = document.querySelector('.catalog-toolbar');
  if (!typePanel || !timePanel || !typeButton || !timeButton) return;

  const records = [...typePanel.querySelectorAll('.directory-item')].map(node => {
    const rawYear = node.dataset.recordYear;
    return {
      id: node.id,
      group: node.closest('.catalog-group').id,
      year: rawYear === 'unknown' ? null : Number(rawYear),
      node
    };
  });
  const byId = new Map(records.map(record => [record.id, record]));
  const groupLists = new Map([...typePanel.querySelectorAll('.catalog-group')].map(group =>
    [group.id, group.querySelector('.directory-list')]));
  const timeLists = new Map([...timePanel.querySelectorAll('.catalog-year')].map(group =>
    ['time-' + group.dataset.timeYear, group.querySelector('.timeline-list')]));
  let current = 'type';

  function setView(view, updateUrl = false) {
    const plan = viewPlan(records, view);
    for (const step of plan) {
      const destination = view === 'time' ? timeLists.get(step.destination) : groupLists.get(step.destination);
      if (!destination) throw new Error('Catalog destination missing: ' + step.destination);
      destination.append(byId.get(step.id).node);
    }
    typePanel.hidden = view !== 'type';
    timePanel.hidden = view !== 'time';
    typeButton.setAttribute('aria-pressed', String(view === 'type'));
    timeButton.setAttribute('aria-pressed', String(view === 'time'));
    current = view;
    if (status) status.textContent = view === 'time' ? '已切換為按時間' : '已切換為按類型';

    if (updateUrl) {
      const url = new URL(window.location.href);
      if (view === 'time') {
        url.searchParams.set('view', 'time');
        if (categoryIds.has(safeDecodeHash(url.hash))) url.hash = '';
      } else {
        url.searchParams.delete('view');
      }
      window.history.replaceState(null, '', url);
    }
  }

  typeButton.addEventListener('click', () => setView('type', true));
  timeButton.addEventListener('click', () => setView('time', true));
  window.addEventListener('hashchange', () => {
    if (chooseView(window.location.search, window.location.hash) === 'type' &&
        categoryIds.has(safeDecodeHash(window.location.hash)))
      setView('type', true);
  });
  window.addEventListener('popstate', () => setView(chooseView(window.location.search, window.location.hash)));

  if (toolbar) toolbar.hidden = false;
  const initial = chooseView(window.location.search, window.location.hash);
  setView(initial, initial === 'type' && new URLSearchParams(window.location.search).get('view') === 'time');
  if (initial === 'time' && window.location.hash) {
    window.requestAnimationFrame(() => document.getElementById(safeDecodeHash(window.location.hash))?.scrollIntoView());
  }
}

if (typeof document !== 'undefined') init();
