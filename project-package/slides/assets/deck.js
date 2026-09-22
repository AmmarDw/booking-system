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


  /* ── pausable screen recording ────────────────────────────────────────────────
     Pause/play for the screen recordings. Everything about why this is a
     <video> and not a GIF is in initGifs below. */
  var GIF_PAUSE = 'إيقاف مؤقّت';
  var GIF_PLAY  = 'تشغيل';

  function initGifs() {
    Array.prototype.forEach.call(document.querySelectorAll('.gifbox'), function (box) {
      var vid = box.querySelector('video');
      var btn = box.querySelector('.gifbox__btn');
      var label = box.querySelector('.gifbox__label');

      /* A GIF cannot be paused. The old approach drew the <img> into a canvas
         on the assumption that this copies the frame currently on screen;
         measured in Chromium, drawImage() returns byte-identical output at
         t=0, 2.5s and 5s — it always hands back frame 0, so "pause" jumped the
         recording back to its thumbnail. A <video> has a real playback clock
         and stops on the frame the room is looking at, so captures that need a
         pause control ship as MP4 (see deck/MEDIA_SHOTLIST.md). Anything left
         as a GIF loops without a control rather than lying about pausing. */
      if (!vid) {
        if (btn) btn.hidden = true;
        return;
      }

      function toggle() {
        var paused = !vid.paused;
        if (paused) vid.pause(); else vid.play();
        box.setAttribute('data-paused', paused ? 'true' : 'false');
        if (label) label.textContent = paused ? GIF_PLAY : GIF_PAUSE;
      }

      box.addEventListener('click', toggle);
      if (btn) btn.addEventListener('click', function (e) { e.stopPropagation(); toggle(); });
    });
  }

  /* ── copy-to-clipboard on install commands ───────────────────────────
     navigator.clipboard needs a secure context (https:, or http://localhost);
     a deck opened as a plain file:// page — the normal way this deck is
     handed to a trainee — is not one, so it silently rejects. document
     .execCommand('copy') on a temporary, off-screen textarea still works
     there even though it is deprecated, so it is the fallback rather than
     the primary path, tried only when the modern API is unavailable or
     throws. */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    }
    fallbackCopy(text);
    return Promise.resolve();
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (err) { /* nothing left to try */ }
    document.body.removeChild(ta);
  }

  function initCopyButtons() {
    Array.prototype.forEach.call(document.querySelectorAll('.snipbox__copy'), function (btn) {
      var box = btn.closest('.snipbox');
      var pre = box && box.querySelector('.snip');
      var icon = btn.querySelector('.i');
      if (!pre) return;

      btn.addEventListener('click', function () {
        copyText(pre.textContent).then(function () {
          btn.setAttribute('data-copied', 'true');
          btn.setAttribute('aria-label', 'تمّ النسخ');
          if (icon) icon.className = 'i i-check';
          setTimeout(function () {
            btn.removeAttribute('data-copied');
            btn.setAttribute('aria-label', 'نسخ الأمر');
            if (icon) icon.className = 'i i-copy';
          }, 1400);
        });
      });
    });
  }

  /* ── step-timestamped walkthrough video ─────────────────────────────
     Each .stepvid pairs one <video> with a scrollable list of steps; a step's
     time badge seeks the video there and plays. timeupdate reflects the
     reverse direction — while the video plays, the step whose timestamp it
     has most recently passed is highlighted and scrolled into view, so the
     two sides stay in sync whichever direction the trainee drives from. */
  function initStepVideos() {
    Array.prototype.forEach.call(document.querySelectorAll('.stepvid'), function (root) {
      var video = root.querySelector('.stepvid__player');
      var list = root.querySelector('.stepvid__list');
      if (!video || !list) return;
      var steps = Array.prototype.slice.call(root.querySelectorAll('.stepvid__step'));
      var times = steps.map(function (s) { return parseFloat(s.getAttribute('data-t')); });

      steps.forEach(function (step, i) {
        var btn = step.querySelector('.stepvid__time');
        if (!btn || isNaN(times[i])) return;
        btn.addEventListener('click', function () {
          video.currentTime = times[i];
          video.play();
        });
      });

      video.addEventListener('timeupdate', function () {
        var current = video.currentTime;
        var active = -1;
        times.forEach(function (t, i) { if (!isNaN(t) && current >= t) active = i; });
        steps.forEach(function (step, i) {
          step.setAttribute('data-active', i === active ? 'true' : 'false');
        });
        if (active >= 0) {
          var el = steps[active];
          var elTop = el.offsetTop, elBottom = elTop + el.offsetHeight;
          if (elTop < list.scrollTop || elBottom > list.scrollTop + list.clientHeight) {
            el.scrollIntoView({ block: 'nearest' });
          }
        }
      });
    });
  }

  /* ── the same component, driven by a transcript instead of a video ───
     Not every thing a trainee must see is a screen doing something. A
     definition, a scope list, a roles table — those are produced by a
     CONVERSATION, and the lesson is the shape of it: messy notes in, a
     formatted artifact out, a correction round between. There is nothing to
     film, so the step list points at messages instead of timestamps.

     `data-msg` on the step names the id of a `.chatlog__msg`. Clicking the
     step scrolls that message into view and highlights both sides — the
     same two-way pairing the video gives, minus the clock. Scrolling is
     manual here on purpose: a conversation has no playhead, and the room
     reads at its own pace.

     Steps carry a `.stepvid__mark--idx` badge rather than a `.stepvid__time`
     button, because a dead 0:00 button is a worse lie than an honest
     ordinal. */
  function initChatLogs() {
    Array.prototype.forEach.call(document.querySelectorAll('.stepvid__chat'), function (chat) {
      var root = chat.closest('.stepvid');
      var list = root && root.querySelector('.stepvid__list');
      if (!list) return;
      var steps = Array.prototype.slice.call(root.querySelectorAll('.stepvid__step'));

      function activate(step) {
        var id = step.getAttribute('data-msg');
        var msg = id && chat.querySelector('#' + id);

        steps.forEach(function (s) {
          s.setAttribute('data-active', s === step ? 'true' : 'false');
        });
        Array.prototype.forEach.call(chat.querySelectorAll('.chatlog__msg'), function (m) {
          m.setAttribute('data-active', m === msg ? 'true' : 'false');
        });

        /* scrollIntoView on the message would scroll the SLIDE too when the
           panel is already at its extreme; move the panel's own scrollTop. */
        if (msg) chat.scrollTop = Math.max(0, msg.offsetTop - chat.offsetTop - 16);
      }

      steps.forEach(function (step) {
        if (!step.getAttribute('data-msg')) return;   /* a step with no message is inert */
        step.setAttribute('tabindex', '0');
        step.addEventListener('click', function () { activate(step); });
        step.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            activate(step);
            e.preventDefault();
            e.stopPropagation();   /* Space also pages the deck — not while reading */
          }
        });
      });
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
     it. State survives a reload.

     Three things beyond a plain checkbox, all driven by attributes so the
     markup stays a flat list (nesting .task rows would break the .tasks
     flex column and the .task grid):

       data-task-key   an explicit id for the row. Rows without one fall back
                       to their own label text, exactly as before — so every
                       existing row keeps working untouched.
       data-parent     the key of the row this one rolls up into.

     The SAME key may appear on several slides: slide 7 lists «تجهّز جهازك
     أنت» as one line of the day plan, and the work-session slide breaks the
     same task into eleven rows. They are one task, so ticking either must
     move both — which is why state is keyed, every element sharing a key is
     repainted together, and the parent/child maps are built over KEYS, not
     over elements. A parent ticked on the day-plan slide therefore cascades
     into children that live on a different slide entirely.

     A parent is never ticked directly by the rollup: it is 'partial' (a dash)
     while some children are done, and only a full house flips it to true. */
  function initTasks() {
    var KEY = 'sag-deck:' + (location.pathname.split('/').pop() || 'deck') + ':tasks';
    var store = {};
    try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { store = {}; }

    function persist() {
      try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* private mode */ }
    }

    var tasks = Array.prototype.slice.call(document.querySelectorAll('.task'));
    var byKey = {};        /* key -> [element, …] — the cross-slide sync    */
    var childrenOf = {};   /* key -> [childKey, …]                          */
    var parentOf = {};     /* key -> parentKey                              */

    function keyOf(task) {
      var explicit = task.getAttribute('data-task-key');
      if (explicit) return explicit;
      var labelEl = task.querySelector('.task__t');
      return (labelEl || task).textContent.replace(/\s+/g, ' ').trim();
    }

    tasks.forEach(function (task) {
      var key = keyOf(task);
      task.setAttribute('data-key', key);
      (byKey[key] = byKey[key] || []).push(task);

      var parent = task.getAttribute('data-parent');
      if (parent) {
        parentOf[key] = parent;
        var kids = childrenOf[parent] = childrenOf[parent] || [];
        if (kids.indexOf(key) === -1) kids.push(key);
      }
    });

    function paintKey(key) {
      var state = store[key];
      var done = state === true ? 'true' : (state === 'partial' ? 'partial' : 'false');
      var aria = state === true ? 'true' : (state === 'partial' ? 'mixed' : 'false');
      (byKey[key] || []).forEach(function (el) {
        el.setAttribute('data-done', done);
        el.setAttribute('aria-checked', aria);
      });
    }

    function paintAll() { Object.keys(byKey).forEach(paintKey); }

    /* Checking a parent checks everything under it; unchecking clears it. */
    function setSubtree(key, done) {
      store[key] = done;
      (childrenOf[key] || []).forEach(function (c) { setSubtree(c, done); });
    }

    function recompute(key) {
      var kids = childrenOf[key];
      if (!kids || !kids.length) return;
      kids.forEach(recompute);            /* post-order: children settle first */
      var all = true, none = true;
      kids.forEach(function (k) {
        if (store[k] === true) none = false;
        else { all = false; if (store[k] === 'partial') none = false; }
      });
      store[key] = all ? true : (none ? false : 'partial');
    }

    function rollUp(key) {
      var p = parentOf[key];
      while (p) {
        var kids = childrenOf[p], all = true, none = true;
        kids.forEach(function (k) {
          if (store[k] === true) none = false;
          else { all = false; if (store[k] === 'partial') none = false; }
        });
        store[p] = all ? true : (none ? false : 'partial');
        p = parentOf[p];
      }
    }

    /* Normalise what came out of localStorage: a parent's stored value is
       derived, so recompute it from the children rather than trusting it. */
    Object.keys(childrenOf).forEach(function (key) {
      if (!parentOf[key]) recompute(key);
    });

    tasks.forEach(function (task) {
      var key = task.getAttribute('data-key');
      task.setAttribute('role', 'checkbox');
      task.setAttribute('tabindex', '0');

      function toggle() {
        /* A 'partial' parent fills in rather than clearing — the trainee
           reaching for it means "the rest is done too", not "undo". */
        setSubtree(key, store[key] !== true);
        rollUp(key);
        paintAll();
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

    paintAll();
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
    initCopyButtons();
    initStepVideos();
    initChatLogs();

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
