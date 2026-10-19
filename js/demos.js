(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================================
     COMMAND PALETTE  (⌘K / Ctrl+K)
     ================================================================ */
  var paletteRoot = document.getElementById('palette');
  var paletteInput = document.getElementById('paletteInput');
  var paletteList = document.getElementById('paletteList');
  var lastFocus = null;

  var PALETTE_ITEMS = [
    { group: 'Navigate', label: 'About', hint: '01', run: function () { go('#about'); } },
    { group: 'Navigate', label: 'Experience', hint: '02', run: function () { go('#experience'); } },
    { group: 'Navigate', label: 'Services', hint: '03', run: function () { go('#services'); } },
    { group: 'Navigate', label: 'Stack', hint: '04', run: function () { go('#skills'); } },
    { group: 'Navigate', label: 'Selected work', hint: '05', run: function () { go('#projects'); } },
    { group: 'Navigate', label: 'FAQ', hint: '06', run: function () { go('#faq'); } },
    { group: 'Navigate', label: 'Contact', hint: '07', run: function () { go('#contact'); } },
    { group: 'Case studies', label: 'NOANT case study', hint: '↗', run: function () { window.open('work/noant.html', '_blank'); } },
    { group: 'Case studies', label: 'GlobMint case study', hint: '↗', run: function () { window.open('work/globmint.html', '_blank'); } },
    { group: 'Case studies', label: 'Mailgeko case study', hint: '↗', run: function () { window.open('work/mailgeko.html', '_blank'); } },
    { group: 'Case studies', label: 'Zukaping case study', hint: '↗', run: function () { window.open('work/zukaping.html', '_blank'); } },
    { group: 'Contact', label: 'Email Divine', hint: '↗', run: function () { window.open('mailto:divineshedrack1@gmail.com'); } },
    { group: 'Contact', label: 'WhatsApp Divine', hint: '↗', run: function () { window.open('https://wa.me/2349033843841', '_blank'); } },
    { group: 'Contact', label: 'GitHub profile', hint: '↗', run: function () { window.open('https://github.com/divineshedrack33220', '_blank'); } },
    { group: 'Contact', label: 'Open resume', hint: 'PDF', run: function () { window.open('resume.html', '_blank'); } }
  ];

  var paletteIndex = 0;
  var paletteFiltered = PALETTE_ITEMS.slice();

  function go(sel) {
    closePalette();
    var el = document.querySelector(sel);
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  }

  function openPalette() {
    if (!paletteRoot) return;
    lastFocus = document.activeElement;
    paletteRoot.hidden = false;
    document.body.style.overflow = 'hidden';
    paletteInput.value = '';
    filterPalette('');
    paletteInput.focus();
  }

  function closePalette() {
    if (!paletteRoot || paletteRoot.hidden) return;
    paletteRoot.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function filterPalette(q) {
    q = q.toLowerCase().trim();
    paletteFiltered = PALETTE_ITEMS.filter(function (item) {
      return !q || item.label.toLowerCase().indexOf(q) !== -1 || item.group.toLowerCase().indexOf(q) !== -1;
    });
    paletteIndex = 0;
    renderPalette();
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderPalette() {
    if (!paletteList) return;
    var html = '';
    var lastGroup = '';
    paletteFiltered.forEach(function (item, i) {
      if (item.group !== lastGroup) {
        html += '<li class="palette-group mono" role="presentation">' + item.group + '</li>';
        lastGroup = item.group;
      }
      html += '<li role="option" id="pal-' + i + '" class="palette-item' + (i === paletteIndex ? ' active' : '') + '" data-i="' + i + '">' +
        '<span>' + esc(item.label) + '</span><span class="mono palette-hint">' + esc(item.hint) + '</span></li>';
    });
    if (!paletteFiltered.length) {
      html = '<li class="palette-empty mono">No matches</li>';
    }
    paletteList.innerHTML = html;
    if (paletteInput) paletteInput.setAttribute('aria-activedescendant', 'pal-' + paletteIndex);
  }

  if (paletteInput) {
    paletteInput.addEventListener('input', function () { filterPalette(paletteInput.value); });
    paletteInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        paletteIndex = Math.min(paletteIndex + 1, paletteFiltered.length - 1);
        renderPalette();
        scrollActiveIntoView();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        paletteIndex = Math.max(paletteIndex - 1, 0);
        renderPalette();
        scrollActiveIntoView();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        var item = paletteFiltered[paletteIndex];
        if (item) { closePalette(); item.run(); }
      } else if (e.key === 'Escape') {
        closePalette();
      }
    });
  }

  function scrollActiveIntoView() {
    var el = paletteList && paletteList.querySelector('.palette-item.active');
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
  }

  if (paletteList) {
    paletteList.addEventListener('click', function (e) {
      var li = e.target.closest('.palette-item');
      if (!li) return;
      var item = paletteFiltered[parseInt(li.dataset.i, 10)];
      if (item) { closePalette(); item.run(); }
    });
  }

  var paletteBackdrop = document.querySelector('.palette-backdrop');
  if (paletteBackdrop) paletteBackdrop.addEventListener('click', closePalette);

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteRoot && paletteRoot.hidden) openPalette(); else closePalette();
    }
    if (e.key === 'Escape') closePalette();
  });

  var paletteBtn = document.getElementById('paletteBtn');
  if (paletteBtn) paletteBtn.addEventListener('click', openPalette);

  /* ================================================================
     Reveal on scroll
     ================================================================ */
  var revealEls = document.querySelectorAll('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (r) { r.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (r) { io.observe(r); });
  }
})();
