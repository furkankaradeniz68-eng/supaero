/**
 * content-loader.js
 * Reads _data/products.json and _data/settings.json (CMS-managed),
 * then hydrates matching DOM elements so edits made via the admin panel
 * are reflected on the live site without a code change.
 *
 * Product cards: any element with data-pid="cat-NN" (homepage grid,
 * full product cards on products.html).
 * Contact/settings: footer email and phone anchors are updated automatically.
 */
(function () {
  'use strict';

  // Resolve base path — works from / and from /pages/
  var isInPages = window.location.pathname.indexOf('/pages/') !== -1;
  var base = isInPages ? '../' : '';

  // Current language
  var lang = (localStorage.getItem('sa-lang') || 'en').toLowerCase();

  function fetchJSON(url) {
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .catch(function () { return null; });
  }

  /* ── Settings ───────────────────────────────────────────── */
  function applySettings(s) {
    if (!s) return;

    // Footer / contact email links
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.href = 'mailto:' + s.email;
      // Preserve the inner text node without clobbering child SVG icons
      var txt = el.lastChild;
      if (txt && txt.nodeType === 3) {
        txt.textContent = ' ' + s.email.replace('@', ' @ ');
      }
    });

    // Footer / contact phone links
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      var stripped = s.phone.replace(/[^+\d]/g, '');
      el.href = 'tel:' + stripped;
      var txt = el.lastChild;
      if (txt && txt.nodeType === 3) {
        txt.textContent = ' ' + s.phone;
      }
    });

    // Named data-setting elements (stats, labels, etc.)
    ['company_name', 'iso_label', 'years_exp', 'product_count', 'countries'].forEach(function (key) {
      document.querySelectorAll('[data-setting="' + key + '"]').forEach(function (el) {
        el.textContent = s[key];
      });
    });
  }

  /* ── Products ───────────────────────────────────────────── */
  function applyProducts(data) {
    if (!data || !Array.isArray(data.products)) return;

    // Build lookup by id
    var lookup = {};
    data.products.forEach(function (p) { lookup[p.id] = p; });

    var nameKey = lang === 'de' ? 'name_de' : 'name_en';
    var descKey = lang === 'de' ? 'desc_de' : 'desc_en';

    document.querySelectorAll('[data-pid]').forEach(function (card) {
      var p = lookup[card.dataset.pid];
      if (!p) return;

      // Series label (homepage: .product-series | products page: .pfc-series)
      var seriesEl = card.querySelector('.product-series, .pfc-series');
      if (seriesEl) seriesEl.textContent = p.series;

      // Name (homepage: .product-name | products page: .pfc-name)
      var nameEl = card.querySelector('.product-name, .pfc-name');
      if (nameEl) nameEl.textContent = p[nameKey];

      // Description (homepage: .product-desc | products page: .pfc-desc)
      var descEl = card.querySelector('.product-desc, .pfc-desc');
      if (descEl) descEl.textContent = p[descKey];

      // Tags (homepage: .product-tags | products page: .pfc-tags)
      var tagsEl = card.querySelector('.product-tags, .pfc-tags');
      if (tagsEl && p.tags && p.tags.length) {
        var isPfc = tagsEl.classList.contains('pfc-tags');
        var cls = isPfc ? 'pfc-tag' : 'product-tag';
        tagsEl.innerHTML = p.tags
          .map(function (t) { return '<span class="' + cls + '">' + t + '</span>'; })
          .join('');
      }
    });
  }

  /* ── Bootstrap ──────────────────────────────────────────── */
  var cachedProductsData = null;

  function run() {
    Promise.all([
      fetchJSON(base + '_data/settings.json'),
      fetchJSON(base + '_data/products.json')
    ]).then(function (results) {
      applySettings(results[0]);
      cachedProductsData = results[1];
      applyProducts(results[1]);
    });
  }

  // Allow main.js to trigger a re-apply after a language switch
  window.__SA_reloadProducts = function () {
    lang = (localStorage.getItem('sa-lang') || 'en').toLowerCase();
    if (cachedProductsData) applyProducts(cachedProductsData);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
