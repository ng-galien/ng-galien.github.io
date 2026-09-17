(() => {
  const list = document.querySelector('[data-stream-list]');
  const filterButtons = Array.from(document.querySelectorAll('[data-stream-filter]'));
  const sortButton = document.querySelector('[data-stream-sort]');
  const status = document.querySelector('.voice-console__status');
  const empty = document.querySelector('[data-stream-empty]');
  const pagination = document.querySelector('[data-stream-pagination]');
  const more = document.querySelector('[data-stream-more]');
  const moreButton = document.querySelector('[data-stream-more-button]');
  const remaining = document.querySelector('[data-stream-remaining]');

  if (!list || filterButtons.length === 0 || !sortButton || !status || !empty || !pagination || !more || !moreButton || !remaining) return;

  const entries = Array.from(list.querySelectorAll('[data-stream-entry]'));
  const pageSize = Math.max(1, Number(list.dataset.streamPageSize) || 20);
  const rootPath = new URL(list.dataset.streamRootUrl, window.location.href).pathname;
  const legacyPagePaths = Array.from({ length: Math.ceil(entries.length / pageSize) }, (_, index) =>
    index === 0 ? rootPath : new URL(list.dataset.streamPageUrl.replace(':num', index + 1), window.location.href).pathname
  );
  const filterLabels = new Map(filterButtons.map((button) => [
    button.dataset.streamFilter,
    Array.from(button.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent).join('').trim()
  ]));
  let activeFilter;
  let sortDirection;
  let shownCount;

  const readLocation = () => {
    const url = new URL(window.location.href);
    activeFilter = filterLabels.has(url.searchParams.get('filter')) ? url.searchParams.get('filter') : 'all';
    sortDirection = url.searchParams.get('order') === 'asc' ? 'asc' : 'desc';
    const path = url.pathname.replace(/\/$/, '') || '/';
    const legacyPage = legacyPagePaths.findIndex((candidate) =>
      (candidate.replace(/\/$/, '') || '/') === path) + 1;
    const requestedCount = Number(url.searchParams.get('shown'));
    shownCount = Number.isInteger(requestedCount) && requestedCount > pageSize
      ? requestedCount
      : Math.max(1, legacyPage) * pageSize;
    shownCount = Math.ceil(shownCount / pageSize) * pageSize;
  };

  const stateUrl = () => {
    const url = new URL(window.location.href);
    url.pathname = rootPath;
    if (activeFilter === 'all') url.searchParams.delete('filter');
    else url.searchParams.set('filter', activeFilter);
    if (sortDirection === 'desc') url.searchParams.delete('order');
    else url.searchParams.set('order', sortDirection);
    if (shownCount <= pageSize) url.searchParams.delete('shown');
    else url.searchParams.set('shown', shownCount);
    return url;
  };

  const matchesFilter = (entry) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'agents') return entry.dataset.streamKind === 'agent';
    if (activeFilter === 'human') return entry.dataset.streamKind === 'human';
    return entry.dataset.streamKind === 'agent' && entry.dataset.streamProject === activeFilter;
  };

  const render = (historyMode = 'replaceState') => {
    const matches = entries.filter(matchesFilter).sort((left, right) => {
      const delta = Date.parse(left.dataset.streamDate) - Date.parse(right.dataset.streamDate);
      return sortDirection === 'asc' ? delta : -delta;
    });
    shownCount = Math.min(shownCount, Math.max(pageSize, Math.ceil(matches.length / pageSize) * pageSize));
    const visibleEntries = matches.slice(0, shownCount);
    const visibleSet = new Set(visibleEntries);

    entries.forEach((entry) => {
      entry.hidden = !visibleSet.has(entry);
      if (entry.hidden) {
        const details = entry.querySelector('details');
        if (details) details.open = false;
      }
    });
    visibleEntries.forEach((entry, index) => {
      list.append(entry);
      const number = entry.querySelector('.voice-entry__number');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });

    filterButtons.forEach((button) => {
      const active = button.dataset.streamFilter === activeFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    sortButton.dataset.streamSort = sortDirection;
    sortButton.querySelector('span').textContent = sortDirection === 'desc' ? "Récentes d'abord" : "Anciennes d'abord";
    sortButton.querySelector('i').textContent = sortDirection === 'desc' ? '↓' : '↑';
    sortButton.setAttribute('aria-label', sortDirection === 'desc'
      ? 'Afficher les plus anciennes publications en premier'
      : 'Afficher les plus récentes publications en premier');

    empty.hidden = matches.length !== 0;
    const range = visibleEntries.length ? `${visibleEntries.length} sur ` : '';
    const noun = matches.length > 1 ? 'publications' : 'publication';
    status.textContent = `${range}${matches.length} ${noun} · ${filterLabels.get(activeFilter)}`;
    const left = matches.length - visibleEntries.length;
    more.hidden = left === 0;
    moreButton.textContent = `Afficher ${Math.min(pageSize, left)} de plus`;
    remaining.textContent = `${left} restante${left > 1 ? 's' : ''}`;
    pagination.hidden = true;
    const url = stateUrl();
    if (url.href !== window.location.href) window.history[historyMode](null, '', url);
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.streamFilter;
      shownCount = pageSize;
      render('pushState');
    });
  });

  sortButton.addEventListener('click', () => {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    shownCount = pageSize;
    render('pushState');
  });

  moreButton.addEventListener('click', () => {
    shownCount += pageSize;
    render('pushState');
  });

  window.addEventListener('popstate', () => {
    readLocation();
    render();
  });

  entries.forEach((entry) => {
    const details = entry.querySelector('details');
    if (!details) return;
    details.addEventListener('toggle', () => {
      const label = details.querySelector('.voice-entry__toggle-label');
      if (label) label.textContent = details.open ? 'Refermer' : 'Lire ici';
      entry.classList.toggle('is-open', details.open);
    });
  });

  readLocation();
  render();
})();
