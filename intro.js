/* ============================================================
   One-time page-load intro
   ------------------------------------------------------------
   Types the name out in the center of the screen in a brighter
   green, then shrinks/flies it into its resting spot in the nav
   bar, revealing the page (which has already loaded underneath —
   this is a visual cover while that happens, never something the
   page waits on). Plays once per browser tab (sessionStorage) —
   every later page view in the same session just shows the nav
   immediately, same as before this existed. Skipped entirely for
   a visitor with reduced motion turned on.

   The overlay markup (#intro-overlay/#intro-word) already sits in
   the HTML, visible by default via plain CSS — not inserted here —
   so there's never a frame where the page shows through before
   this script has even run. This script's first job, synchronously,
   is deciding whether to animate that overlay or just remove it.

   Not meant to need editing. The word itself is read straight off
   the real nav text (already filled in by script.js, which runs
   just before this), so nothing here needs to change if the name
   in config.js ever does.
   ============================================================ */

(function () {
  const STORAGE_KEY = "glennIntroShown";

  const overlay = document.getElementById("intro-overlay");
  const word = document.getElementById("intro-word");
  if (!overlay || !word) return;

  const reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let alreadyShown = false;
  try {
    alreadyShown = !!sessionStorage.getItem(STORAGE_KEY);
  } catch (e) {
    // Storage blocked (private mode, locked-down browser) — treat as
    // "not shown" rather than throwing; worst case the intro plays
    // again on the next page, which is harmless.
  }

  const navTarget = document.querySelector(".nav-logo [data-site-name]");

  // Nothing to fly to, or nothing to show, or the visitor doesn't want
  // motion — just drop the cover instantly instead of animating it.
  if (reduceMotion || alreadyShown || !navTarget || !navTarget.textContent.trim()) {
    overlay.remove();
    return;
  }

  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch (e) {
    // Can't persist the flag — the intro may play again next page,
    // which is a minor repeat, not a broken page.
  }

  // Waits for the real Archivo weight this draws with, same reasoning
  // as opener.js's own whenFontReady: measuring/positioning text before
  // the font has actually arrived can leave things slightly off once
  // it swaps in. On a fast connection this resolves near-instantly.
  function whenFontReady(cb) {
    if (document.fonts && document.fonts.load && document.fonts.ready) {
      Promise.all([document.fonts.load('900 100px "Archivo"'), document.fonts.ready])
        .then(cb)
        .catch(cb);
    } else {
      cb();
    }
  }

  whenFontReady(run);

  function run() {
    const text = navTarget.textContent.trim();

    const letters = [];
    for (const ch of text) {
      const span = document.createElement("span");
      span.textContent = ch === " " ? " " : ch;
      word.appendChild(span);
      letters.push(span);
    }

    let i = 0;
    function typeNext() {
      if (i < letters.length) {
        letters[i].style.opacity = "1";
        i++;
        setTimeout(typeNext, 70);
      } else {
        setTimeout(flyToNav, 480);
      }
    }

    function flyToNav() {
      const navRect = navTarget.getBoundingClientRect();
      const wordRect = word.getBoundingClientRect();
      if (!navRect.height || !wordRect.height) {
        // Something's off (e.g. nav hidden) — just fade the cover away
        // rather than animating toward a meaningless target.
        finish();
        return;
      }

      const scale = navRect.height / wordRect.height;
      // transform-origin is left/center below, so scale alone keeps
      // the word's left edge and vertical center fixed in place — the
      // translate then only has to cover the actual distance between
      // the two boxes, same math regardless of the scale factor.
      const dx = navRect.left - wordRect.left;
      const dy = navRect.top + navRect.height / 2 - (wordRect.top + wordRect.height / 2);

      word.style.transformOrigin = "left center";
      word.style.transition =
        "transform 0.7s cubic-bezier(0.65, 0, 0.35, 1), color 0.7s ease, -webkit-text-stroke-width 0.7s ease, -webkit-text-stroke-color 0.7s ease";
      // Morphs from the intro's own hardcoded fill color to the site's
      // --accent-text variable (same #8be04e green either way, just a
      // variable instead of a literal from here on, matching how the
      // static nav text underneath is colored), and the white outline
      // shrinks away to nothing at the same time, landing as flat
      // --accent-text with no stroke at all.
      word.style.color = "var(--accent-text)";
      word.style.setProperty("-webkit-text-stroke-width", "0px");
      word.style.setProperty("-webkit-text-stroke-color", "var(--accent-text)");
      requestAnimationFrame(() => {
        word.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      });

      setTimeout(finish, 650);
    }

    function finish() {
      overlay.style.transition = "opacity 0.3s ease";
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 320);
    }

    // Letters are already in the DOM (laid out, just invisible) before
    // typing starts, so the word's final width/position is known from
    // frame one instead of shifting as each one gets inserted — two
    // rAFs so the initial opacity:0 state has definitely painted before
    // the first letter lights up.
    requestAnimationFrame(() => requestAnimationFrame(typeNext));
  }
})();
