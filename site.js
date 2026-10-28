// Mobile menu
(function () {
  var btn = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();

// Category pills (Children's / Portraits)
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.pills [role="tab"]'));
  if (!tabs.length) return;
  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
    var hash = tab.id === 'tab-portraits' ? '#portraits' : '';
    if (location.hash !== hash) history.replaceState(null, '', location.pathname + location.search + hash);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        select(tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length], true);
      }
    });
  });
  if (location.hash === '#portraits') select(document.getElementById('tab-portraits'));
})();

// Lightbox
(function () {
  var allTiles = Array.prototype.slice.call(document.querySelectorAll('.tile[data-full]'));
  var tiles = allTiles;
  var box = document.querySelector('.lightbox');
  if (!allTiles.length || !box) return;
  var img = box.querySelector('img');
  var cap = box.querySelector('figcaption');
  var idx = 0, lastFocus = null;

  function show(i) {
    idx = (i + tiles.length) % tiles.length;
    var t = tiles[idx];
    img.src = t.getAttribute('data-full');
    img.alt = t.querySelector('img').alt;
    cap.textContent = (t.querySelector('.cap') || {}).textContent || '';
  }
  function open(tile) {
    var group = tile.closest('.gallery');
    tiles = allTiles.filter(function (t) { return t.closest('.gallery') === group; });
    var i = tiles.indexOf(tile);
    lastFocus = document.activeElement;
    show(i);
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lb-close').focus();
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  allTiles.forEach(function (t) { t.addEventListener('click', function () { open(t); }); });
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  box.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
