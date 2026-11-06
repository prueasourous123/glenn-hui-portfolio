/* ============================================================
   "Letter Wash" animated text
   ------------------------------------------------------------
   The footer's animated line (see index.html/about.html — any
   element with a data-wash-key attribute gets its own independent
   instance of this; the nav name used to be a second instance too,
   but it now renders as plain static text instead — see .nav-name in
   styles.css — since the p5.js/CDN load was causing a visible
   flicker there on load). Spells out whatever text that attribute
   points to in SITE_CONFIG (see wordText() below), in bold type
   that's always clearly legible, with a soft beam of light that
   sweeps across it on hover (desktop/trackpad), each letter popping
   brighter and slightly bigger as the light crosses it — like stage
   lighting washing over a sign one letter at a time. On touch
   devices, where there's no hover to react to, the same beam sweeps
   on its own slow, autonomous cycle instead.

   The lit color is the site's brand green (#8be04e) — the same accent
   used sparingly elsewhere on the site (the active nav tab, each
   tile's category label) — rather than an arbitrary one, so the name
   lighting up ties back to that same single, deliberate accent instead
   of introducing its own palette. Each letter cycles through a tight
   set of 3 shades of that green (deep, the site's core accent, and a
   lighter version of it) for a little depth as the beam crosses,
   without ever reading as more than one color family.

   Needs the p5.js library (loaded via a <script> tag in both
   index.html and about.html, before this file). A plain, visible
   version of the text (see .wash-fallback in styles.css) sits in each
   box underneath the canvas the whole time, so there's never a blank
   gap while p5.js/the font are still loading from the CDN. That plain
   text is sized with the exact same fitting math the canvas uses (see
   sizeFallbacks() below) as soon as the font itself is ready — which
   doesn't need p5 at all, just the browser's own Canvas 2D API — so it
   already looks like the final version well before the slower,
   CDN-hosted p5 library has necessarily finished loading, rather than
   approximating it with CSS and visibly resizing later. Once p5 does
   load, the canvas fades in over it at that same size and the plain
   text fades out — if p5 fails to load at all (blocked network,
   offline), the correctly-sized plain text just stays up permanently
   instead, and the page still works either way.

   Not meant to need editing. If you want to change what the nav spells,
   that's SITE_CONFIG.name in config.js; the footer line is
   SITE_CONFIG.footerText. Nothing to change here for either.
   ============================================================ */

(function () {
  // Three shades of the one site accent (the brand green, #8be04e) —
  // deep, the site's actual --accent/--accent-text as-is, and a lighter
  // version of the same green — rather than several unrelated colors.
  // The middle shade alone would pass WCAG contrast fine on its own
  // now (#8be04e is bright enough that it doesn't need an outline or
  // anything else carrying the contrast for it, unlike the old dark
  // forest shade this replaced) — the deep/light steps exist purely so
  // the hover sweep still has somewhere to go, lightening and darkening
  // around that one color rather than just sitting flat with no pop.
  const MATCH_PALETTE = [
    [66, 127, 22],
    [139, 224, 78],
    [202, 241, 174],
  ];
  // Resting color is the site's brand green (--accent-text, #8be04e —
  // same as MATCH_PALETTE's middle shade), not off-white — the name
  // reads that color from the moment it loads, not only once it's
  // hovered.
  const NEUTRAL = [139, 224, 78];

  // Used if SITE_CONFIG (or the specific field a given instance reads)
  // isn't available for some reason, so nothing ever just draws blank.
  const FALLBACK_TEXT = {
    name: "Glenn Hui",
    footerText: "LET'S WORK TOGETHER",
  };

  const canHover =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function panelSize(el) {
    const r = el.getBoundingClientRect();
    return { w: Math.max(1, Math.floor(r.width)), h: Math.max(1, Math.floor(r.height)) };
  }

  function wordText(key) {
    const val =
      (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG[key]) ||
      FALLBACK_TEXT[key] ||
      "";
    return val.trim().toUpperCase();
  }

  // Finds the biggest size (capped) where the full text still fits
  // comfortably inside the panel's width.
  function fitTextSize(ctx, w, h, text) {
    let size = Math.min(w, h) * 0.46;
    for (let i = 0; i < 30; i++) {
      ctx.font = `900 ${size}px "Archivo", sans-serif`;
      const width = ctx.measureText(text).width;
      if (width <= w * 0.84) break;
      size *= (w * 0.84) / width;
    }
    return size;
  }

  // Only the nav instance cares about this — below the hamburger-menu
  // breakpoint (see styles.css), WORK/ABOUT and the Instagram icon move
  // out of the bar entirely, leaving the name as the only thing in it,
  // so it should sit left (a normal logo position) instead of centered
  // in that now-nearly-full-width box. The footer instance always
  // centers regardless of width.
  function isNarrowNav() {
    return window.matchMedia && window.matchMedia("(max-width: 680px)").matches;
  }

  function measureLetters(ctx, w, size, text, alignLeft) {
    ctx.font = `900 ${size}px "Archivo", sans-serif`;
    ctx.textAlign = "left";
    const totalWidth = ctx.measureText(text).width;
    let x = alignLeft ? 0 : w / 2 - totalWidth / 2;
    const boxes = [];
    for (const ch of text) {
      const cw = ctx.measureText(ch).width;
      boxes.push({ ch, cx: x + cw / 2, w: cw });
      x += cw;
    }
    ctx.textAlign = "center";
    return boxes;
  }

  function lerpColor(a, b, t) {
    return [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
  }

  // A <canvas> doesn't wait for a webfont the way normal HTML text does —
  // if something calls fillText/measureText before Archivo has actually
  // finished downloading, the browser silently measures and draws with
  // its fallback system font instead, and (since the letter positions
  // below are only measured once, at setup) it can stay slightly
  // mismatched even after the font arrives. Waiting for the exact weight
  // this file draws with (900) before the first measurement avoids that
  // — on a fast connection this resolves near-instantly; if the Font
  // Loading API isn't available at all (older browsers), it just builds
  // immediately instead of waiting forever.
  function whenFontReady(cb) {
    if (document.fonts && document.fonts.load && document.fonts.ready) {
      Promise.all([document.fonts.load('900 100px "Archivo"'), document.fonts.ready])
        .then(cb)
        .catch(cb);
    } else {
      cb();
    }
  }

  // Sizes every [data-wash-key] element's plain-text fallback (see
  // .wash-fallback in styles.css) to match what the canvas would draw,
  // using the same fitTextSize math above but on a plain Canvas 2D
  // context — this needs only the font and the browser's built-in
  // canvas support, not p5.js itself, so it can run (and the fallback
  // can look right) well before the much slower CDN fetch of p5.js has
  // necessarily finished, and even if that fetch never succeeds at all.
  const measureCtx = document.createElement("canvas").getContext("2d");
  function sizeFallbacks() {
    document.querySelectorAll("[data-wash-key]").forEach((el) => {
      const fallback = el.querySelector(".wash-fallback");
      if (!fallback) return;
      const text = wordText(el.getAttribute("data-wash-key"));
      if (!text) return;
      const { w, h } = panelSize(el);
      if (!w || !h) return;
      fallback.style.fontSize = `${fitTextSize(measureCtx, w, h, text)}px`;
    });
  }

  // Builds one independent p5 instance bound to a single element —
  // textKey names which SITE_CONFIG field to draw, alignMode controls
  // whether it ever left-aligns on narrow screens (see isNarrowNav).
  function makeSketch(el, textKey, alignMode) {
    return function sketch(p) {
      let w, h, size, text, letterBoxes = [];
      let sweepT = -2;

      function alignLeftNow() {
        // "left" always draws from the box's left edge (the nav wordmark,
        // now sitting at the left end of the bar instead of centered
        // between WORK/ABOUT and CONTACT/Instagram). "left-on-mobile"
        // is the older conditional mode, kept for any instance that
        // still wants to stay centered on desktop and only go left once
        // the bar narrows down to the hamburger layout.
        if (alignMode === "left") return true;
        return alignMode === "left-on-mobile" && isNarrowNav();
      }

      function rebuild() {
        text = wordText(textKey);
        if (!text) {
          letterBoxes = [];
          return;
        }
        size = fitTextSize(p.drawingContext, w, h, text);
        letterBoxes = measureLetters(p.drawingContext, w, size, text, alignLeftNow());
        // The canvas has real letters to draw as of this point (already
        // sized to match the plain-text fallback exactly — see
        // sizeFallbacks() above, which keeps it in sync independently of
        // this), so the fallback can fade out now. Harmless to call
        // again on a later resize/rebuild; it's already hidden by then.
        const fallback = el.querySelector(".wash-fallback");
        if (fallback) fallback.style.opacity = "0";
      }

      // Re-measures the box and resizes the canvas if it changed, without
      // re-measuring letters (callers decide whether a rebuild is also
      // needed). Returns true if a resize actually happened.
      function syncSize() {
        const s = panelSize(el);
        if (Math.abs(s.w - w) > 1 || Math.abs(s.h - h) > 1) {
          w = s.w; h = s.h;
          p.resizeCanvas(w, h);
          return true;
        }
        return false;
      }

      p.setup = function () {
        const s = panelSize(el);
        w = s.w; h = s.h;
        const cnv = p.createCanvas(w, h);
        cnv.parent(el);
        cnv.elt.setAttribute("aria-hidden", "true");
        sweepT = -w * 0.4;
        // Nothing draws (the letterBoxes loop in p.draw just iterates
        // zero times) until this resolves, rather than briefly showing
        // the wrong typeface and then jumping.
        whenFontReady(() => {
          // The box itself can also have shifted size between the canvas's
          // original creation (above, before Archivo had necessarily
          // loaded) and now — e.g. the nav-logo box's share of the nav bar
          // can change by a few pixels once the real Archivo metrics for
          // WORK/ABOUT and the Instagram icon's neighbors settle in, vs.
          // whatever fallback font those were measured with a moment
          // earlier. Re-check the box size here too, not just on a later
          // window resize, so the canvas doesn't stay pinned to a
          // slightly-stale pre-font-load size (which reads as the nav
          // "shifting" a little once everything's actually loaded).
          syncSize();
          rebuild();
        });

        // Covers any later reflow of the box itself (a font swap after the
        // check above, a content change, a breakpoint-driven layout shift)
        // in addition to plain window resizes — more reliable than relying
        // on window resize alone, since the box can change size without
        // the window doing so.
        if (typeof ResizeObserver !== "undefined") {
          const ro = new ResizeObserver(() => {
            if (syncSize()) rebuild();
          });
          ro.observe(el);
        }
      };

      p.draw = function () {
        if (!w || !h) return;
        p.clear();

        let beamX;
        if (reduceMotion && !canHover) {
          // No hover available (touch) to trigger anything deliberately,
          // and the visitor prefers reduced motion — skip the autonomous
          // sweep rather than run it anyway.
          beamX = -9999;
        } else if (canHover) {
          const mx = p.mouseX, my = p.mouseY;
          const mouseActive = mx >= 0 && mx <= w && my >= 0 && my <= h;
          beamX = mouseActive ? mx : -9999;
        } else {
          // No hover available (touch) — sweep on a slow, self-contained
          // cycle instead of waiting for an interaction that can't happen
          // on that device.
          sweepT += w * 0.0022;
          if (sweepT > w * 1.4) sweepT = -w * 0.4;
          beamX = sweepT;
        }

        const ctx = p.drawingContext;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const beamWidth = w * 0.22;

        for (let i = 0; i < letterBoxes.length; i++) {
          const box = letterBoxes[i];
          const d = Math.abs(box.cx - beamX);
          const lit = p.constrain(1 - d / beamWidth, 0, 1);
          const eased = lit * lit * (3 - 2 * lit); // smoothstep, gentler falloff
          const litSize = size * (1 + eased * 0.12);
          // Full opacity at rest, same as the plain-text fallback
          // underneath — anything less than 1 here reads as the name
          // visibly dimming the moment the canvas takes over from that
          // fallback. The hover sweep still reads clearly through the
          // color shift and size bump alone, without needing to fade
          // the resting letters down first.
          const alpha = 1;

          const base = MATCH_PALETTE[i % MATCH_PALETTE.length];
          const [r, g, b] = lerpColor(NEUTRAL, base, eased);

          ctx.save();
          ctx.font = `900 ${litSize}px "Archivo", sans-serif`;
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.fillText(box.ch, box.cx, h / 2);
          ctx.restore();
        }

        // Always keep looping (never noLoop()) — a reduced-motion
        // visitor is already handled above by simply not starting the
        // autonomous sweep, not by stopping the draw loop itself, which
        // would also kill the ability to ever notice a later hover.
      };

      // Fallback for the rare browser without ResizeObserver — the
      // ResizeObserver set up in p.setup already covers this case (and
      // more), so this mostly just double-checks on an actual window
      // resize.
      p.windowResized = function () {
        if (syncSize()) rebuild();
      };
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Runs regardless of whether p5 ends up loading — sizes the plain
    // fallback text correctly as soon as the font is ready, which is
    // normally much sooner than the CDN fetch below finishes.
    whenFontReady(sizeFallbacks);
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(sizeFallbacks, 120);
    });

    // The animated canvas is an enhancement on top of that plain text —
    // if p5 isn't available (CDN blocked, offline), skip it entirely and
    // leave the correctly-sized fallback up permanently.
    if (typeof p5 === "undefined") return;
    document.querySelectorAll("[data-wash-key]").forEach((el) => {
      const key = el.getAttribute("data-wash-key");
      const alignMode = el.getAttribute("data-wash-align") || "center";
      new p5(makeSketch(el, key, alignMode));
    });
  });
})();
