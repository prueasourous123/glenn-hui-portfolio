/* ============================================================
   Font audit tool — NOT part of the real site. Does nothing at all
   unless the page is visited with ?fontaudit in the URL (e.g.
   about.html?fontaudit or index.html?fontaudit), so it's completely
   safe to leave this script tag in place — real visitors never see
   or load anything extra because of it.

   What it does: labels every piece of visible text on the page with
   the font it's set to use, its weight, and its size, and flags (in
   red) anything where Switzer — the one typeface this whole site is
   supposed to use — actually rendered as its real fallback (Arial)
   instead, meaning it silently failed to load rather than just being
   a different weight. Detected by comparing measured text width with
   Switzer requested against the same text forced to Arial — if they
   come out identical, Switzer never actually applied. (Deliberately
   not using document.fonts.check() for this — it reports a font as
   "available" even when nothing was ever actually requested, which
   made it useless for catching a real silent fallback.) That's the
   difference between "this looks like a different font because it's
   a different weight" (expected, every label still says Switzer) and
   "this actually IS a different font" (a red label).

   One-off diagnostic, built to answer a specific "is About using a
   different font?" question — delete this file and its <script> tag
   in about.html/index.html once that's settled, there's no reason to
   ship it long-term.
   ============================================================ */
(function () {
  if (!new URLSearchParams(location.search).has("fontaudit")) return;

  // Measures the same test string twice at a given weight/size — once
  // asking for Switzer, once forced straight to Arial (the fallback
  // the real site's own font stack would land on) — and compares the
  // widths. Identical widths means Switzer never actually applied;
  // the browser silently rendered Arial instead. Cached per
  // weight+size since there are only a handful of distinct
  // combinations on any real page.
  const cache = {};
  function switzerActuallyRenders(weight, size) {
    const key = `${weight}/${size}`;
    if (key in cache) return cache[key];
    const canvas = switzerActuallyRenders._canvas || (switzerActuallyRenders._canvas = document.createElement("canvas"));
    const ctx = canvas.getContext("2d");
    const testString = "mmmmmmmmmmlliW0123456789 the quick fox";
    ctx.font = `${weight} ${size} "Switzer", Arial`;
    const widthWithSwitzer = ctx.measureText(testString).width;
    ctx.font = `${weight} ${size} Arial`;
    const widthArialOnly = ctx.measureText(testString).width;
    const result = Math.abs(widthWithSwitzer - widthArialOnly) > 0.5;
    cache[key] = result;
    return result;
  }

  function run() {
    const old = document.getElementById("font-audit-overlay");
    if (old) old.remove();

    const container = document.createElement("div");
    container.id = "font-audit-overlay";
    container.style.cssText =
      "position:absolute; top:0; left:0; width:0; height:0; z-index:99999; pointer-events:none;";
    document.body.appendChild(container);

    const summary = [];
    const seenRects = new Set();

    document.querySelectorAll("h1, h2, h3, p, a, button, label, span").forEach((el) => {
      if (el.closest("#font-audit-overlay")) return;
      const text = (el.textContent || "").trim();
      if (!text) return;

      const rect = el.getBoundingClientRect();
      // Filters out sr-only / zero-size / off-screen elements — nothing
      // worth labeling if it isn't actually visible.
      if (rect.width < 2 || rect.height < 2) return;
      if (rect.top > window.innerHeight * 4) return; // keep it to a reasonable scroll range

      // Skip exact-duplicate rects (e.g. a <p> and its one <a> child
      // filling the same box) so there's one label, not two stacked
      // directly on top of each other.
      const rectKey = `${Math.round(rect.top)},${Math.round(rect.left)},${Math.round(rect.width)}`;
      if (seenRects.has(rectKey)) return;
      seenRects.add(rectKey);

      const cs = getComputedStyle(el);
      const declaredStack = cs.fontFamily;
      const firstFamily = declaredStack.split(",")[0].replace(/["']/g, "").trim();
      const weight = cs.fontWeight;
      const size = cs.fontSize;

      const isFallback = firstFamily === "Switzer" && !switzerActuallyRenders(weight, size);

      const label = document.createElement("div");
      label.style.cssText = [
        "position:absolute",
        `top:${rect.top + window.scrollY - 15}px`,
        `left:${rect.left + window.scrollX}px`,
        "font-family:monospace",
        "font-size:10px",
        "font-weight:400",
        "line-height:1.3",
        "white-space:nowrap",
        "padding:1px 4px",
        "border-radius:2px",
        `background:${isFallback ? "#ff5a5a" : "#8be04e"}`,
        "color:#000",
      ].join(";");
      label.textContent = `${firstFamily} ${weight} ${size}${isFallback ? " ⚠ FALLBACK" : ""}`;
      container.appendChild(label);

      summary.push({
        tag: el.tagName.toLowerCase(),
        text: text.slice(0, 40),
        family: firstFamily,
        weight,
        size,
        rendersAsSwitzer: firstFamily === "Switzer" ? !isFallback : "n/a",
      });
    });

    // eslint-disable-next-line no-console
    console.log(
      "[font-audit] Switzer weights actually rendering (vs. silently falling back to Arial):",
      ["400", "500", "600", "700", "900"]
        .map((w) => `${w}:${switzerActuallyRenders(w, "16px")}`)
        .join("  ")
    );
    // eslint-disable-next-line no-console
    console.table(summary);
  }

  function whenFontsReady(cb) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(cb).catch(cb);
    } else {
      cb();
    }
  }

  if (document.readyState === "complete") {
    whenFontsReady(run);
  } else {
    window.addEventListener("load", () => whenFontsReady(run));
  }
})();
