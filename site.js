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

// Lightbox
(function () {
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile[data-full]'));
  var box = document.querySelector('.lightbox');
  if (!tiles.length || !box) return;
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
  function open(i) {
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

  tiles.forEach(function (t, i) { t.addEventListener('click', function () { open(i); }); });
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
