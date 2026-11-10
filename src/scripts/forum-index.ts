export function initForumIndex(): void {
  const list = document.querySelector<HTMLElement>('.forum-post-list');
  if (!list || list.dataset.forumListBound === '1') return;
  list.dataset.forumListBound = '1';

  const cards = [...list.querySelectorAll<HTMLElement>('[data-forum-card]')];
  if (!cards.length) return;

  const sortButtons = [...document.querySelectorAll<HTMLButtonElement>('.forum-sort [data-forum-sort]')];
  const filterControls = [...document.querySelectorAll<HTMLElement>('[data-forum-filter]')];
  const pagination = document.querySelector<HTMLElement>('[data-forum-pagination]');
  const pageButtons = document.querySelector<HTMLElement>('[data-page-buttons]');
  const pageStatus = document.querySelector<HTMLElement>('[data-page-status]');
  const visibleCount = document.querySelector<HTMLElement>('[data-forum-visible-count]');
  const emptyState = document.querySelector<HTMLElement>('[data-forum-empty]');
  const previousButton = document.querySelector<HTMLButtonElement>('[data-page-previous]');
  const nextButton = document.querySelector<HTMLButtonElement>('[data-page-next]');
  const resultsSuffix = visibleCount?.dataset.resultsSuffix ?? 'discussions';
  const pageSize = 20;
  let currentPage = 1;
  let activeFilter = new URLSearchParams(window.location.search).get('category') ?? 'all';
  if (window.location.search) {
    history.replaceState(null, '', window.location.pathname);
  }

  function updateForum() {
    const sort =
      sortButtons.find((button) => button.getAttribute('aria-pressed') === 'true')?.dataset.forumSort ?? 'featured';
    const ordered = [...cards].sort((a, b) => {
      if (sort === 'latest') {
        return Number(b.dataset.published) - Number(a.dataset.published);
      }
      if (sort === 'top') {
        const aTitle = a.querySelector<HTMLAnchorElement>('.forum-post-title')?.textContent ?? '';
        const bTitle = b.querySelector<HTMLAnchorElement>('.forum-post-title')?.textContent ?? '';
        return aTitle.localeCompare(bTitle);
      }
      return Number(b.dataset.published) - Number(a.dataset.published) || Number(a.dataset.order) - Number(b.dataset.order);
    });
    const matching = ordered.filter((card) => activeFilter === 'all' || card.dataset.category === activeFilter);
    const pageCount = Math.max(1, Math.ceil(matching.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const firstVisible = (currentPage - 1) * pageSize;
    const visibleCards = new Set(matching.slice(firstVisible, firstVisible + pageSize));

    ordered.forEach((card) => {
      card.hidden = !visibleCards.has(card);
      list!.append(card);
    });

    if (visibleCount) {
      visibleCount.textContent = `${matching.length} ${resultsSuffix}`;
    }
    if (emptyState) emptyState.hidden = matching.length > 0;
    if (pagination) pagination.hidden = matching.length <= pageSize;
    if (pageStatus) {
      pageStatus.textContent = matching.length
        ? `Showing ${firstVisible + 1} to ${Math.min(firstVisible + pageSize, matching.length)} of ${matching.length}`
        : '0 discussions';
    }
    if (previousButton) previousButton.disabled = currentPage <= 1;
    if (nextButton) nextButton.disabled = currentPage >= pageCount;
    if (pageButtons) {
      pageButtons.replaceChildren(
        ...Array.from({ length: pageCount }, (_, index) => {
          const button = document.createElement('button');
          const page = index + 1;
          button.type = 'button';
          button.textContent = String(page);
          button.setAttribute('aria-label', `Page ${page}`);
          if (page === currentPage) button.setAttribute('aria-current', 'page');
          button.addEventListener('click', () => {
            currentPage = page;
            updateForum();
          });
          return button;
        }),
      );
    }
  }

  if (!sortButtons.some((button) => button.getAttribute('aria-pressed') === 'true') && sortButtons[0]) {
    sortButtons[0].classList.add('is-active');
    sortButtons[0].setAttribute('aria-pressed', 'true');
  }

  sortButtons.forEach((button) => {
    button.addEventListener('click', () => {
      sortButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      currentPage = 1;
      updateForum();
    });
  });

  filterControls.forEach((control) => {
    control.addEventListener('click', (event) => {
      if (control instanceof HTMLAnchorElement) event.preventDefault();
      activeFilter = control.dataset.forumFilter ?? 'all';
      filterControls.forEach((item) => {
        const active = item.dataset.forumFilter === activeFilter;
        if (item instanceof HTMLButtonElement) {
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        }
      });
      currentPage = 1;
      updateForum();
    });
  });

  previousButton?.addEventListener('click', () => {
    currentPage = Math.max(1, currentPage - 1);
    updateForum();
  });
  nextButton?.addEventListener('click', () => {
    currentPage += 1;
    updateForum();
  });

  const initialFilter = filterControls.find((control) => control.dataset.forumFilter === activeFilter);
  if (initialFilter) {
    filterControls.forEach((item) => {
      const active = item.dataset.forumFilter === activeFilter;
      if (item instanceof HTMLButtonElement) {
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      }
    });
  } else {
    activeFilter = 'all';
  }

  updateForum();
}

if (typeof document !== 'undefined') {
  const run = () => initForumIndex();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
  document.addEventListener('astro:page-load', run);
}
