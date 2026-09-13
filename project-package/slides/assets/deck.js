/* SAG Lab bootcamp deck — navigation, scaling, overflow guard.
   No framework, no CDN. Shared by every day-NN.html. */
(function () {
  'use strict';

  var slides = [], index = 0;

  /* Where a Ctrl+click deep link came from, so Backspace can undo it. -1 = no
     pending jump. Without this the feature is a trap: a presenter who jumps
     from the day plan to slide 40 mid-sentence has no way back but 36 arrows. */
  var jumpFrom = -1;

  /* True while the ؟ term window is open. The deck listens for Space and the
     arrows on `document`, so without this flag reading a term would page the
     deck out from under the reader. */
  var modalOpen = false;

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
    /* A TreeWalker, not querySelectorAll, because two of the three exclusions
       below have to drop the whole SUBTREE, not just the node. An out-of-flow
       box is the case that matters: a tooltip is absolutely positioned and is
       MEANT to spill outside its row, but its children are static blocks whose
       rects land far outside the frame. Skipping only the positioned box itself
       reported every tooltip in the deck as an overflow. */
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (k) {
        if (!k.getClientRects().length) return NodeFilter.FILTER_REJECT;  /* display:none */
        var cs = window.getComputedStyle(k);
        if (cs.position === 'absolute' || cs.position === 'fixed') {
          return NodeFilter.FILTER_REJECT;                    /* deliberate bleed, subtree and all */
        }
        /* A scroll container clips its own children, so rows below its fold
           are NOT clipped by the frame — they are reachable by scrolling.
           Measure the container's own box here (the walker cannot both accept
           and reject a node) and drop everything inside it. */
        if (cs.overflowY === 'auto' || cs.overflowY === 'scroll' ||
            cs.overflowX === 'auto' || cs.overflowX === 'scroll') {
          var sc = k.getBoundingClientRect();
          worst = Math.max(worst, sc.bottom - r.bottom, r.top - sc.top);
          return NodeFilter.FILTER_REJECT;
        }
        /* A pure-inline box is sized by the FONT's ascent+descent, not by line-height,
           so under Cairo every inline run reports ~3px past its block. Same ink bleed,
           just wearing a border box — measure the block-level boxes only. Its children
           still count, so SKIP the node rather than rejecting the subtree. */
        if (cs.display === 'inline' || cs.display === 'contents') return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var k;
    while ((k = walker.nextNode())) {
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

  /* Keys the deck itself owns. While the term window is open these must not
     reach the deck, but every other key (Tab, arrows inside a scrolled panel)
     still should — so swallow this list only, never everything. */
  var DECK_KEYS = ['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', ' ', 'Home', 'End', 'Backspace'];

  function onKey(e) {
    if (modalOpen) {
      if (e.key === 'Escape') { closeTerms(); e.preventDefault(); }
      else if (DECK_KEYS.indexOf(e.key) !== -1) { e.preventDefault(); }
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'PageDown' || e.key === ' ') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === 'PageUp') { prev(); e.preventDefault(); }
    else if (e.key === 'Home') { show(0); e.preventDefault(); }
    else if (e.key === 'End') { show(slides.length - 1); e.preventDefault(); }
    else if (e.key === 'Backspace') { jumpBack(); e.preventDefault(); }
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

  /* ── section references: one attribute, two behaviours ─────────────
     A task row shows what the section DOES ("نتعرّف على Claude — وايش الفرق…"),
     not what it is CALLED. The canonical name still has to be reachable, and
     the row should be able to take you to the slide that delivers it.

     Both come from one `data-ref`, resolved against the deck at runtime:
       1. an explicit `data-anchor` on a slide — a stable name, so it survives
          renames AND renumbering, and is the only way to reach one specific
          slide inside a section that spans thirteen of them (7.10);
       2. the badge NUMBER (7.1);
       3. a substring of the badge label.
     Nothing is hardcoded to a slide position, so inserting or reordering
     slides can never leave a stale link behind — which is the whole reason
     this is not just a hand-written title="" attribute. */
  function slideBadge(sec) {
    var badge = sec.querySelector('.sag-badge');
    if (!badge) return { num: '', label: '' };
    var numEl = badge.querySelector('.sag-badge__num');
    var num = numEl ? numEl.textContent.trim() : '';
    var label = badge.textContent;
    if (num) label = label.replace(num, '');
    return { num: num, label: label.replace(/\s+/g, ' ').trim() };
  }

  function resolveRef(ref) {
    var i;
    for (i = 0; i < slides.length; i++) if (slides[i].getAttribute('data-anchor') === ref) return i;
    for (i = 0; i < slides.length; i++) if (slideBadge(slides[i]).num === ref) return i;
    for (i = 0; i < slides.length; i++) if (slideBadge(slides[i]).label.indexOf(ref) !== -1) return i;
    return -1;
  }

  function jumpTo(i) {
    if (i < 0 || i === index) return;
    jumpFrom = index;
    show(i);
  }

  function jumpBack() {
    if (jumpFrom < 0) return;
    var back = jumpFrom;
    jumpFrom = -1;
    show(back);
  }

  /* ── tooltips ──────────────────────────────────────────────────────
     Built as real elements rather than a CSS ::after so they can carry more
     than one line, and appended INSIDE the host so the deck's scale transform
     positions them for free — no coordinate maths, and no drift when the
     window resizes. They are position:absolute, so the overflow guard already
     ignores them. */
  function makeTip(host, lines, mod) {
    var tip = document.createElement('span');
    tip.className = 'tip' + (mod ? ' ' + mod : '');
    /* The tip lives inside its host, and several hosts sit inside an <h3>.
       Without this the whole definition is folded into the heading's accessible
       name — "إدارة المفاتيح… المفاتيح كلمات سرّ تعطي… بطريقة آمنة" read as one
       heading. It is a hover affordance, so hide it from the accessibility tree
       and let the heading read as written. */
    tip.setAttribute('aria-hidden', 'true');
    lines.forEach(function (l) {
      if (!l.text) return;
      var s = document.createElement('span');
      s.className = 'tip__' + l.cls;
      s.textContent = l.text;
      tip.appendChild(s);
    });
    host.appendChild(tip);

    /* A tip near the top of the frame would be clipped by it, so those flip
       below their host instead of above. Decided on hover, NOT at init: every
       slide but the active one is display:none, so at init getBoundingClientRect
       returns zeros and the choice would be made from meaningless geometry. */
    /* Everything here is computed from the HOST's position and the tip's own
       untransformed offsetWidth/offsetHeight — never from the tip's rendered
       rect. The transform carries a .14s transition, so reading the rect back
       returns a mid-animation value and the correction never converges. */
    var TIP_PAD = 24;                               /* layout px kept clear of the frame */

    function place() {
      var slide = host.closest('.deck-slide');
      if (!slide) return;
      var hr = host.getBoundingClientRect();
      if (!hr.height) return;                       /* still hidden — leave it */
      var sr = slide.getBoundingClientRect();
      var scale = parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--deck-scale')) || 1;

      /* flip below when there is not enough room above */
      var above = (hr.top - sr.top) / scale;
      tip.setAttribute('data-place', above < tip.offsetHeight + 16 ? 'below' : 'above');

      /* The tip is centred on its host, so a host near either edge pushes half
         the tip outside the frame — which clips. Slide it back in. */
      var slideW = sr.width / scale;
      var centre = (hr.left + hr.width / 2 - sr.left) / scale;
      var half = tip.offsetWidth / 2;
      var dx = 0;
      if (centre + half > slideW - TIP_PAD) dx = (slideW - TIP_PAD) - (centre + half);
      if (centre - half + dx < TIP_PAD) dx = TIP_PAD - (centre - half);
      tip.style.setProperty('--tip-dx', dx + 'px');
    }

    host.addEventListener('pointerenter', place);
    host.addEventListener('focus', place, true);
    return tip;
  }

  var TIP_HINT = 'Ctrl + نقر للانتقال إلى الشريحة';

  function initRefs() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-ref]'), function (host) {
      var ref = host.getAttribute('data-ref');
      var target = resolveRef(ref);
      if (target < 0) {
        console.warn('[deck] data-ref "' + ref + '" resolves to no slide');
        return;
      }
      var b = slideBadge(slides[target]);
      makeTip(host, [
        { cls: 'kicker', text: b.num ? 'القسم ' + b.num : '' },
        { cls: 'name', text: b.label },
        { cls: 'hint', text: TIP_HINT }
      ]);
      host.setAttribute('data-ref-ok', 'true');

      /* Task rows get their Ctrl+click inside initTasks, ahead of the checkbox
         toggle. Everything else — an inline .reflink, a card — is wired here. */
      if (!host.classList.contains('task')) {
        host.addEventListener('click', function (e) {
          if (!(e.ctrlKey || e.metaKey)) return;
          jumpTo(resolveRef(ref));
          e.preventDefault();
        });
        host.addEventListener('keydown', function (e) {
          if ((e.key === 'Enter' || e.key === ' ') && (e.ctrlKey || e.metaKey)) {
            jumpTo(resolveRef(ref));
            e.preventDefault();
            e.stopPropagation();
          }
        });
      }
    });
  }

  /* Plain [data-tip] text, and the i-icon variant of the same thing. */
  function initTips() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tip]'), function (host) {
      makeTip(host, [
        { cls: 'name', text: host.getAttribute('data-tip-title') || '' },
        { cls: 'body', text: host.getAttribute('data-tip') }
      ], host.hasAttribute('data-tip-title') ? 'tip--term' : '');
    });
  }

  /* ── the ؟ term window ─────────────────────────────────────────────
     A slide that explains jargon carries ONE <template class="terms"> holding
     every term on it. A ؟ button names one of them; opening any button shows
     the whole list with that entry highlighted, because a trainee who wonders
     what a repository is wants "commit" in the same breath. Keeping the copy
     in a <template> next to the slide means one source and nothing rendered
     until it is asked for. */
  var win = null, winBody = null, winTitle = null, lastOpener = null;

  function buildWindow() {
    win = document.createElement('div');
    win.className = 'termwin';
    win.setAttribute('hidden', '');
    win.innerHTML =
      '<div class="termwin__scrim" data-close="1"></div>' +
      '<div class="termwin__panel" role="dialog" aria-modal="true" aria-label="شرح المصطلحات">' +
      '<div class="termwin__bar"><h3 class="termwin__title"></h3>' +
      '<button class="termwin__x" type="button" data-close="1" aria-label="إغلاق">✕</button></div>' +
      '<div class="termwin__body"></div></div>';
    document.body.appendChild(win);
    winBody = win.querySelector('.termwin__body');
    winTitle = win.querySelector('.termwin__title');
    win.addEventListener('click', function (e) {
      if (e.target.getAttribute('data-close')) closeTerms();
    });
  }

  function openTerms(btn) {
    var slide = btn.closest('.deck-slide');
    var tpl = slide && slide.querySelector('template.terms');
    if (!tpl) return;
    if (!win) buildWindow();

    winBody.textContent = '';
    var want = btn.getAttribute('data-term');
    var focus = null;
    var terms = tpl.content.querySelectorAll('[data-term]');
    Array.prototype.forEach.call(terms, function (src) {
      var item = document.createElement('div');
      item.className = 'termwin__item';
      var h = document.createElement('h4');
      h.className = 'termwin__term';
      h.textContent = src.getAttribute('data-title') || src.getAttribute('data-term');
      /* A div, not a p: one entry carries a <table>, and a table inside a
         paragraph is reparented by the HTML parser and loses its styling. */
      var p = document.createElement('div');
      p.className = 'termwin__def';
      p.innerHTML = src.innerHTML;
      item.appendChild(h);
      item.appendChild(p);
      if (src.getAttribute('data-term') === want) {
        /* Highlighting is how you find the term you clicked among the others.
           When the slide has only one, there is nothing to find and the tint
           just reads as an unexplained colour wash. */
        if (terms.length > 1) item.setAttribute('data-current', 'true');
        focus = item;
      }
      winBody.appendChild(item);
    });

    winTitle.textContent = tpl.getAttribute('data-title') || 'مصطلحات هذه الشريحة';
    /* One slide's window holds a 29-row table; 760px would wrap every cell. */
    if (tpl.getAttribute('data-wide')) win.setAttribute('data-wide', 'true');
    else win.removeAttribute('data-wide');

    /* Grow the panel out of the button that was clicked, so the connection
       between the ؟ and the window is visible rather than inferred. */
    var r = btn.getBoundingClientRect();
    win.style.setProperty('--from-x', (r.left + r.width / 2) + 'px');
    win.style.setProperty('--from-y', (r.top + r.height / 2) + 'px');

    lastOpener = btn;
    win.removeAttribute('hidden');
    /* next frame, so the transition has a start state to animate from */
    requestAnimationFrame(function () { win.setAttribute('data-open', 'true'); });
    modalOpen = true;
    if (focus) focus.scrollIntoView({ block: 'nearest' });
    var x = win.querySelector('.termwin__x');
    if (x) x.focus();
  }

  function closeTerms() {
    if (!win) return;
    win.removeAttribute('data-open');
    modalOpen = false;
    var done = function () { win.setAttribute('hidden', ''); };
    setTimeout(done, 220);
    if (lastOpener) { lastOpener.focus(); lastOpener = null; }
  }

  function initQmarks() {
    Array.prototype.forEach.call(document.querySelectorAll('.qmark'), function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();      /* a ؟ inside a task row must not tick it */
        openTerms(btn);
      });
      btn.addEventListener('keydown', function (e) { e.stopPropagation(); });
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

      task.addEventListener('click', function (e) {
        /* Ctrl/⌘ turns the row into a link. Checked BEFORE the toggle so a
           deep link never silently ticks the row you were only navigating from. */
        if (e.ctrlKey || e.metaKey) {
          var t = resolveRef(task.getAttribute('data-ref'));
          if (t >= 0) { jumpTo(t); e.preventDefault(); return; }
        }
        toggle();
      });
      task.addEventListener('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
          if (e.ctrlKey || e.metaKey) {
            var t = resolveRef(task.getAttribute('data-ref'));
            if (t >= 0) { jumpTo(t); e.preventDefault(); e.stopPropagation(); return; }
          }
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
    slides.forEach(function (s, i) {
      s.setAttribute('data-active', i === 0 ? 'true' : 'false');
      /* Own the footer page number here rather than in the markup: inserting a
         slide used to mean hand-bumping every number after it, which is a whole
         class of silent drift for no benefit. The day label lives in
         .deck-foot__side, a different element, and stays hand-authored. */
      var n = s.querySelector('.deck-foot > .deck-foot__num');
      if (n) n.textContent = String(i + 1);
    });

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
    initRefs();     /* before initTasks: the tooltip must exist to be hovered */
    initTips();
    initQmarks();
    initTasks();

    window.deckAudit = auditAll;
    window.deckRefAudit = function () {
      var bad = [];
      Array.prototype.forEach.call(document.querySelectorAll('[data-ref]'), function (h) {
        var r = h.getAttribute('data-ref');
        if (resolveRef(r) < 0) bad.push(r);
      });
      if (bad.length) console.error('[deck] unresolved data-ref: ' + bad.join(', '));
      else console.info('[deck] all ' + document.querySelectorAll('[data-ref]').length +
        ' section references resolve.');
      return bad;
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
