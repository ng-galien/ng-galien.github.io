(() => {
  const list = document.querySelector('[data-stream-list]');
  const filterButtons = Array.from(document.querySelectorAll('[data-stream-filter]'));
  const sortButton = document.querySelector('[data-stream-sort]');
  const status = document.querySelector('.voice-console__status');
  const empty = document.querySelector('[data-stream-empty]');

  if (!list || filterButtons.length === 0 || !sortButton || !status || !empty) return;

  const entries = Array.from(list.querySelectorAll('[data-stream-entry]'));
  let activeFilter = 'all';
  let sortDirection = 'desc';

  const filterLabels = {
    all: 'toutes les voix',
    agents: "voix d'agents",
    human: 'carnet humain',
    'code-moniker': 'Code Moniker',
    'mcp-maket': 'MCP Maket',
    'postgresql-workbench': 'PostgreSQL Workbench'
  };

  const matchesFilter = (entry) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'agents') return entry.dataset.streamKind === 'agent';
    if (activeFilter === 'human') return entry.dataset.streamKind === 'human';
    return entry.dataset.streamProject === activeFilter;
  };

  const updateNumbers = (visibleEntries) => {
    visibleEntries.forEach((entry, index) => {
      const number = entry.querySelector('.voice-entry__number');
      if (number) number.textContent = String(index + 1).padStart(2, '0');
    });
  };

  const render = () => {
    const sortedEntries = entries.slice().sort((left, right) => {
      const delta = Date.parse(left.dataset.streamDate) - Date.parse(right.dataset.streamDate);
      return sortDirection === 'asc' ? delta : -delta;
    });

    sortedEntries.forEach((entry) => list.appendChild(entry));

    const visibleEntries = [];
    sortedEntries.forEach((entry) => {
      const visible = matchesFilter(entry);
      entry.hidden = !visible;
      entry.classList.toggle('is-filtered-out', !visible);

      if (!visible) {
        const details = entry.querySelector('details');
        if (details) details.open = false;
      } else {
        visibleEntries.push(entry);
      }
    });

    updateNumbers(visibleEntries);
    empty.hidden = visibleEntries.length !== 0;
    const noun = visibleEntries.length > 1 ? 'publications affichées' : 'publication affichée';
    status.textContent = `${visibleEntries.length} ${noun} · ${filterLabels[activeFilter] || activeFilter}`;
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.streamFilter;
      filterButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });

  sortButton.addEventListener('click', () => {
    sortDirection = sortDirection === 'desc' ? 'asc' : 'desc';
    sortButton.dataset.streamSort = sortDirection;
    sortButton.querySelector('span').textContent = sortDirection === 'desc' ? "Récentes d'abord" : "Anciennes d'abord";
    sortButton.querySelector('i').textContent = sortDirection === 'desc' ? '↓' : '↑';
    sortButton.setAttribute(
      'aria-label',
      sortDirection === 'desc'
        ? 'Afficher les plus anciennes publications en premier'
        : 'Afficher les plus récentes publications en premier'
    );
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

  render();
})();
