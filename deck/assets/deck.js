/* SAG Lab bootcamp deck — navigation, scaling, overflow guard.
   No framework, no CDN. Shared by every day-NN.html. */
(function () {
  'use strict';

  var slides = [], index = 0;

  /* ── scale the fixed 1920×1080 frame to the viewport ─────────────── */
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    document.documentElement.style.setProperty('--deck-scale', s);
  }

  /* ── overflow guard ───────────────────────────────────────────────
     The frames set overflow:hidden, so content that exceeds the frame is
     silently clipped — the exact failure the budget rule exists to prevent.
     Flag it loudly instead.
     Measured on BORDER BOXES, not scrollHeight. Cairo's glyph box is taller than
     its em, so a heading at line-height 1.28 reports scrollHeight > clientHeight
     even though nothing is clipped — that is ink bleed, and no amount of splitting
     a slide would ever clear it. Border-box geometry ignores the bleed and catches
     only what the rule is actually about: a box that does not fit its frame. */
  function boxOverflow(el) {
    var r = el.getBoundingClientRect();
    var worst = 0;
    var kids = el.querySelectorAll('*');
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (!k.getClientRects().length) continue;               /* display:none */
      var cs = window.getComputedStyle(k);
      if (cs.position === 'absolute' || cs.position === 'fixed') continue; /* deliberate bleed */
      /* A pure-inline box is sized by the FONT's ascent+descent, not by line-height,
         so under Cairo every inline run reports ~3px past its block. Same ink bleed,
         just wearing a border box — measure the block-level boxes only. */
      if (cs.display === 'inline' || cs.display === 'contents') continue;
      var kr = k.getBoundingClientRect();
      worst = Math.max(worst, kr.bottom - r.bottom, r.top - kr.top);
    }
    var scale = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue('--deck-scale')) || 1;
    return worst / scale;                                     /* report in layout px */
  }

  function checkOverflow(slide) {
    var over = false;
    var body = slide.querySelector('.sag-slide__body');
    if (body && boxOverflow(body) > 1) over = true;
    if (boxOverflow(slide) > 1) over = true;
    slide.setAttribute('data-overflow', over ? 'true' : 'false');
    return over;
  }

  function auditAll() {
    var bad = [];
    slides.forEach(function (s, i) {
      var prev = s.getAttribute('data-active');
      s.setAttribute('data-active', 'true');
      if (checkOverflow(s)) bad.push(i + 1);
      s.setAttribute('data-active', prev === 'true' ? 'true' : 'false');
    });
    if (bad.length) {
      console.error('[deck] ' + bad.length + ' slide(s) overflow the 16:9 frame: ' + bad.join(', ') +
        ' — split them into ١/٢ and ٢/٢ rather than shrinking type.');
    } else {
      console.info('[deck] ' + slides.length + ' slides, none overflow.');
    }
    return bad;
  }

  /* ── navigation ───────────────────────────────────────────────────── */
  function show(i) {
    if (i < 0 || i >= slides.length) return;
    slides[index].setAttribute('data-active', 'false');
    index = i;
    slides[index].setAttribute('data-active', 'true');
    checkOverflow(slides[index]);
    var n = document.querySelector('.deck-hud__pos');
    if (n) n.textContent = (index + 1) + ' / ' + slides.length;
    if (history.replaceState) history.replaceState(null, '', '#' + (index + 1));
  }
  var next = function () { show(index + 1); };
  var prev = function () { show(index - 1); };

  function onKey(e) {
    if (e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === ' ') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'PageUp') { prev(); e.preventDefault(); }
    else if (e.key === 'Home') { show(0); e.preventDefault(); }
    else if (e.key === 'End') { show(slides.length - 1); e.preventDefault(); }
    else if (e.key.toLowerCase() === 'f') { toggleFullscreen(); }
    else if (e.key.toLowerCase() === 'h') { var h = document.querySelector('.deck-hud'); if (h) h.hidden = !h.hidden; }
  }
  /* RTL: ArrowLeft advances, matching the reading direction. */

  function toggleFullscreen() {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(function () {}); }
    else { document.exitFullscreen(); }
  }


  /* ── pausable GIF ────────────────────────────────────────────────
     A GIF exposes no playback API. Drawing the <img> into a canvas copies the
     frame that is CURRENTLY on screen, so swapping to that canvas freezes the
     animation where the presenter sees it, not back at frame 0. */
  var GIF_PAUSE = 'إيقاف مؤقّت';
  var GIF_PLAY  = 'تشغيل';

  function initGifs() {
    Array.prototype.forEach.call(document.querySelectorAll('.gifbox'), function (box) {
      var img = box.querySelector('img');
      var cv = box.querySelector('canvas');
      var label = box.querySelector('.gifbox__label');
      if (!img || !cv) return;

      function toggle() {
        if (box.getAttribute('data-paused') === 'true') {
          box.setAttribute('data-paused', 'false');
          if (label) label.textContent = GIF_PAUSE;
        } else {
          var w = img.naturalWidth, h = img.naturalHeight;
          if (!w || !h) return;                  /* not decoded yet — leave it running */
          cv.width = w; cv.height = h;
          try { cv.getContext('2d').drawImage(img, 0, 0, w, h); }
          catch (err) { return; }                /* never freeze on a blank canvas */
          box.setAttribute('data-paused', 'true');
          if (label) label.textContent = GIF_PLAY;
        }
      }

      box.addEventListener('click', toggle);
      var btn = box.querySelector('.gifbox__btn');
      if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    });
  }

  /* ── live task checkboxes (CLAUDE.md A.6.9) ────────────────────────
     The day-plan rows in a §6.N block are ticked by the trainee as the day
     goes, so every .task is a real checkbox: click, Space or Enter toggles
     it. State is keyed by the task's own label rather than its position, so
     reordering slides never loses a tick, and it survives a reload. */
  function initTasks() {
    var KEY = 'sag-deck:' + (location.pathname.split('/').pop() || 'deck') + ':tasks';
    var store = {};
    try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }

    function persist() {
      try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* private mode */ }
    }

    Array.prototype.forEach.call(document.querySelectorAll('.task'), function (task) {
      var labelEl = task.querySelector('.task__t');
      var label = (labelEl || task).textContent.replace(/\s+/g, ' ').trim();

      function paint(done) {
        task.setAttribute('data-done', done ? 'true' : 'false');
        task.setAttribute('aria-checked', done ? 'true' : 'false');
      }

      task.setAttribute('role', 'checkbox');
      task.setAttribute('tabindex', '0');
      paint(store[label] === true);

      function toggle() {
        var now = task.getAttribute('data-done') !== 'true';
        paint(now);
        store[label] = now;
        persist();
      }

      task.addEventListener('click', toggle);
      task.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          toggle();
          e.preventDefault();
          e.stopPropagation();   /* Space also advances the deck — not while ticking */
        }
      });
    });
  }

  /* ── idle-hide the presenter HUD ───────────────────────────────────
     The counter and the fullscreen button are presenter chrome floating over
     the bottom of the frame. Two seconds after the last input they fade and
     slide downward out of view, so nothing on the slide stays covered; any
     input brings them straight back. Hovering the HUD keeps it awake, or a
     click could land on a control that is mid-fade. */
  var HUD_IDLE_MS = 2000;

  function initHudIdle(hud) {
    var timer = null, hovering = false;

    function sleep() { if (!hovering) hud.setAttribute('data-idle', 'true'); }

    function wake() {
      if (hud.getAttribute('data-idle') !== 'false') hud.setAttribute('data-idle', 'false');
      clearTimeout(timer);
      timer = setTimeout(sleep, HUD_IDLE_MS);
    }

    hud.addEventListener('pointerenter', function () { hovering = true; wake(); });
    hud.addEventListener('pointerleave', function () { hovering = false; wake(); });
    ['pointermove', 'pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
      document.addEventListener(ev, wake, { passive: true });
    });

    wake();
  }

  function init() {
    slides = Array.prototype.slice.call(document.querySelectorAll('.deck-slide'));
    if (!slides.length) return;
    slides.forEach(function (s, i) { s.setAttribute('data-active', i === 0 ? 'true' : 'false'); });

    fit();
    window.addEventListener('resize', fit);
    document.addEventListener('keydown', onKey);

    var hud = document.querySelector('.deck-hud');
    if (hud) {
      hud.addEventListener('click', function (e) {
        var a = e.target.getAttribute && e.target.getAttribute('data-act');
        if (a === 'next') next(); else if (a === 'prev') prev(); else if (a === 'full') toggleFullscreen();
      });
      initHudIdle(hud);
    }

    var start = parseInt((location.hash || '').replace('#', ''), 10);
    show(isFinite(start) && start > 0 ? start - 1 : 0);

    /* fonts change metrics; audit once they have settled */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(auditAll);
    else window.addEventListener('load', auditAll);

    initGifs();
    initTasks();

    window.deckAudit = auditAll;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
