/**
 * Our Projects page: loads data/projects.json and renders status tabs, a search box,
 * repo/category filters and a card grid. Search and both filters combine with the selected
 * tab, and the tab counts reflect the search and filters.
 *
 * Names and descriptions use the keys `proj-<id>-name` / `proj-<id>-desc` so they follow the
 * selected language; the English text in the JSON is the fallback.
 */
(function () {
  'use strict';

  var STATUSES = ['active', 'development', 'archived'];
  var state = { status: 'active', query: '', repo: '', category: '' };
  var projects = [];

  var els = {
    tabs: document.querySelectorAll('.projects-tab'),
    panel: document.getElementById('projects-panel'),
    grid: document.getElementById('projects-grid'),
    empty: document.getElementById('projects-empty'),
    error: document.getElementById('projects-error'),
    search: document.getElementById('projects-search'),
    repo: document.getElementById('projects-repo'),
    category: document.getElementById('projects-category'),
    live: document.getElementById('projects-status'),
    dialog: document.getElementById('project-dialog'),
  };
  var lastOpener = null;
  var openProject = null;

  if (!els.grid) return;

  function t(key, fallback, params) {
    var engine = window.TranslationEngine;
    if (engine && engine.hasTranslation(key)) return engine.t(key, params);
    return fallback;
  }

  function nameOf(p) {
    return t('proj-' + p.id + '-name', p.name);
  }

  function descOf(p) {
    return t('proj-' + p.id + '-desc', p.description);
  }

  function categoryLabel(slug) {
    var fallback = slug.charAt(0).toUpperCase() + slug.slice(1);
    return t('proj-cat-' + slug, fallback);
  }

  function hostOf(url) {
    try {
      return new URL(url).host;
    } catch (e) {
      return url;
    }
  }

  function repoNames(p) {
    return (p.repos || []).map(function (r) {
      return r.name;
    });
  }

  function typeSlug(p) {
    return p.type === 'community' ? 'community' : 'org';
  }

  function typeLabel(p) {
    return t('proj-type-' + typeSlug(p), typeSlug(p) === 'org' ? 'Org Projects' : 'Community');
  }

  function matchesFilters(p) {
    if (state.repo && repoNames(p).indexOf(state.repo) === -1) return false;
    if (state.category && p.category !== state.category) return false;
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    var haystack = [
      nameOf(p),
      descOf(p),
      repoNames(p).join(' '),
      categoryLabel(p.category),
      hostOf(p.url),
    ]
      .join(' ')
      .toLowerCase();
    return haystack.indexOf(q) !== -1;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function i18nSpan(key, fallback, className) {
    var span = el('span', className, t(key, fallback));
    span.setAttribute('data-i18n', key);
    return span;
  }

  function externalIcon() {
    var icon = el('i', 'bi bi-box-arrow-up-right');
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function newTabHint() {
    return i18nSpan('nav-opens-new-tab', '(opens in a new tab)', 'sr-only');
  }

  function badge(key, fallback, extra) {
    return i18nSpan(key, fallback, 'project-badge ' + extra);
  }

  function badgesFor(p) {
    var wrap = el('div', 'project-card-badges');
    wrap.appendChild(badge('proj-tab-' + p.status, p.status, 'project-badge--' + p.status));
    wrap.appendChild(badge('proj-type-' + typeSlug(p), typeLabel(p), 'project-badge--type'));
    var cat = badge('proj-cat-' + p.category, categoryLabel(p.category), 'project-badge--category');
    wrap.appendChild(cat);
    return wrap;
  }

  function repoLabel(p) {
    var first = (p.repos && p.repos[0] && p.repos[0].name) || '';
    return first.replace('/', ' / ');
  }

  function buildCard(p) {
    var li = el('li', 'project-card');

    var media = el('div', 'project-card-media');
    var icon = el('i', 'bi ' + (p.icon || 'bi-grid-3x3-gap-fill'));
    icon.setAttribute('aria-hidden', 'true');
    media.appendChild(icon);
    media.appendChild(badgesFor(p));
    media.appendChild(el('span', 'project-card-repo-label', repoLabel(p)));

    var body = el('div', 'project-card-body');
    var title = el('h2', 'project-card-title', nameOf(p));
    title.setAttribute('data-i18n', 'proj-' + p.id + '-name');
    var desc = el('p', 'project-card-desc', descOf(p));
    desc.setAttribute('data-i18n', 'proj-' + p.id + '-desc');
    body.appendChild(title);
    body.appendChild(desc);
    (p.repos || []).forEach(function (r) {
      body.appendChild(el('p', 'project-card-repo', r.url.replace(/^https?:\/\//, '')));
    });

    var footer = el('div', 'project-card-footer');
    footer.appendChild(el('span', 'project-card-host', hostOf(p.url)));
    var details = el('button', 'project-card-details');
    details.type = 'button';
    details.setAttribute('aria-haspopup', 'dialog');
    details.appendChild(i18nSpan('proj-view-details', 'View Details'));
    var arrow = el('i', 'bi bi-arrow-right');
    arrow.setAttribute('aria-hidden', 'true');
    details.appendChild(arrow);
    details.appendChild(el('span', 'sr-only', ' - ' + nameOf(p)));
    details.addEventListener('click', function () {
      lastOpener = details;
      showDetails(p);
    });
    footer.appendChild(details);

    li.appendChild(media);
    li.appendChild(body);
    li.appendChild(footer);
    return li;
  }

  function fillDetails(p) {
    document.getElementById('pd-icon').className = 'bi ' + (p.icon || 'bi-grid-3x3-gap-fill');
    var badges = document.getElementById('pd-badges');
    badges.replaceWith(Object.assign(badgesFor(p), { id: 'pd-badges' }));
    document.getElementById('pd-repo-label').textContent = repoLabel(p);

    var title = document.getElementById('project-dialog-title');
    title.textContent = nameOf(p);
    title.setAttribute('data-i18n', 'proj-' + p.id + '-name');

    var url = document.getElementById('pd-url');
    url.href = p.url;
    url.textContent = p.url;

    var desc = document.getElementById('pd-desc');
    desc.textContent = descOf(p);
    desc.setAttribute('data-i18n', 'proj-' + p.id + '-desc');

    var repos = p.repos || [];
    document.getElementById('pd-contributors').href = repos.length
      ? repos[0].url + '/graphs/contributors'
      : p.url;

    var list = document.getElementById('pd-repos');
    list.textContent = '';
    repos.forEach(function (r) {
      var li = el('li');
      var a = el('a', 'project-dialog-repo');
      a.href = r.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      var gh = el('i', 'bi bi-github');
      gh.setAttribute('aria-hidden', 'true');
      a.appendChild(gh);
      a.appendChild(el('span', '', r.url.replace(/^https?:\/\//, '')));
      a.appendChild(externalIcon());
      a.appendChild(newTabHint());
      li.appendChild(a);
      list.appendChild(li);
    });

    document.getElementById('pd-count').textContent = t(
      'proj-repos-count',
      repos.length + ' repository',
      { count: repos.length }
    );
    document.getElementById('pd-visit').href = p.url;
  }

  function showDetails(p) {
    if (!els.dialog || typeof els.dialog.showModal !== 'function') {
      window.open(p.url, '_blank', 'noopener,noreferrer');
      return;
    }
    openProject = p;
    fillDetails(p);
    document.body.classList.add('project-dialog-open');
    els.dialog.showModal();
    els.dialog.scrollTop = 0;
  }

  function bindDialog() {
    if (!els.dialog) return;
    document.getElementById('pd-close').addEventListener('click', function () {
      els.dialog.close();
    });
    // Click on the backdrop (the dialog element itself, outside its content) closes it
    els.dialog.addEventListener('click', function (e) {
      if (e.target === els.dialog) els.dialog.close();
    });
    els.dialog.addEventListener('close', function () {
      openProject = null;
      document.body.classList.remove('project-dialog-open');
      if (lastOpener && document.contains(lastOpener)) lastOpener.focus();
    });
  }

  function fillSelect(select, values, labelFor) {
    var current = select.value;
    // keep the first "All ..." option, rebuild the rest
    while (select.options.length > 1) select.remove(1);
    values.forEach(function (value) {
      var opt = document.createElement('option');
      opt.value = value;
      opt.textContent = labelFor(value);
      select.appendChild(opt);
    });
    select.value = current;
  }

  function unique(list) {
    return list.filter(function (v, i) {
      return v && list.indexOf(v) === i;
    });
  }

  function renderFilters() {
    fillSelect(
      els.repo,
      unique(
        projects.reduce(function (all, p) {
          return all.concat(repoNames(p));
        }, [])
      ),
      function (v) {
        return v;
      }
    );
    fillSelect(
      els.category,
      unique(
        projects.map(function (p) {
          return p.category;
        })
      ),
      categoryLabel
    );
  }

  function render() {
    var filtered = projects.filter(matchesFilters);

    STATUSES.forEach(function (status) {
      var count = filtered.filter(function (p) {
        return p.status === status;
      }).length;
      var badge = document.querySelector('[data-count="' + status + '"]');
      if (badge) badge.textContent = String(count);
    });

    var visible = filtered.filter(function (p) {
      return p.status === state.status;
    });

    els.grid.textContent = '';
    visible.forEach(function (p) {
      els.grid.appendChild(buildCard(p));
    });
    els.grid.setAttribute('aria-busy', 'false');
    els.empty.hidden = visible.length > 0;

    els.live.textContent = t('proj-showing', 'Showing ' + visible.length + ' projects', {
      count: visible.length,
    });
  }

  function selectTab(status, focus) {
    state.status = status;
    els.tabs.forEach(function (tab) {
      var on = tab.getAttribute('data-status') === status;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      if (on) {
        els.panel.setAttribute('aria-labelledby', tab.id);
        if (focus) tab.focus();
      }
    });
    render();
  }

  function bindEvents() {
    els.tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        selectTab(tab.getAttribute('data-status'), false);
      });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = (index + 1) % els.tabs.length;
        else if (e.key === 'ArrowLeft') next = (index - 1 + els.tabs.length) % els.tabs.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = els.tabs.length - 1;
        if (next === null) return;
        e.preventDefault();
        selectTab(els.tabs[next].getAttribute('data-status'), true);
      });
    });

    els.search.addEventListener('input', function () {
      state.query = els.search.value;
      render();
    });
    els.repo.addEventListener('change', function () {
      state.repo = els.repo.value;
      render();
    });
    els.category.addEventListener('change', function () {
      state.category = els.category.value;
      render();
    });

    document.addEventListener('languageChanged', function () {
      renderFilters();
      render();
      if (openProject) fillDetails(openProject);
    });
  }

  function showError() {
    els.grid.setAttribute('aria-busy', 'false');
    els.error.hidden = false;
  }

  bindEvents();
  bindDialog();

  fetch('../data/projects.json')
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      projects = Array.isArray(data.projects) ? data.projects : [];
      renderFilters();
      render();
    })
    .catch(showError);
})();
