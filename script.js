/* ============================================================
   Site logic — you shouldn't need to edit this file.
   Content lives in config.js and works-data.js.
   ============================================================ */

function buildNav() {
  document.querySelectorAll("[data-site-name]").forEach((el) => {
    el.textContent = SITE_CONFIG.name;
  });
  document.querySelectorAll("[data-work-label]").forEach((el) => {
    el.textContent = SITE_CONFIG.workLabel;
  });
  document.querySelectorAll("[data-instagram-link]").forEach((el) => {
    el.href = SITE_CONFIG.instagramUrl;
  });
  // The nav's own CONTACT link (see .nav-right in index.html/about.html)
  // scrolls down to the big footer CTA (#footer) — there's no separate
  // contact form/section any more, the footer's Email/Instagram
  // buttons are the one "get in touch" moment on the site, and every
  // page has its own footer, so this works the same way everywhere.
  document.querySelectorAll("[data-contact-link]").forEach((el) => {
    el.href = document.getElementById("footer") ? "#footer" : "index.html#footer";
  });
}

// Wires up the hamburger button (.nav-burger) shown only on narrow
// screens — toggles the dropdown (.nav-menu) holding WORK / ABOUT /
// Instagram, which move out of the bar itself on mobile to leave the
// animated name the full width (see styles.css).
function buildMobileMenu() {
  const burger = document.getElementById("nav-burger");
  const menu = document.getElementById("nav-menu");
  if (!burger || !menu) return;
  // .nav itself (see its CSS) — not just .nav-menu — picks up a
  // matching solid background while the menu's open, so the
  // transparent bar up top doesn't show the hero/Spline scene through
  // it right above the dropdown's own solid panel.
  const nav = burger.closest(".nav");

  function closeMenu() {
    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    if (nav) nav.classList.remove("menu-open");
  }
  function openMenu() {
    menu.classList.add("open");
    burger.setAttribute("aria-expanded", "true");
    if (nav) nav.classList.add("menu-open");
  }

  burger.addEventListener("click", () => {
    if (menu.classList.contains("open")) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // If the screen goes from mobile to wide (rotating a phone, resizing
  // a browser window) while the menu happens to be open, make sure it
  // doesn't stay stuck open once the hamburger that opened it is gone.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) closeMenu();
  });
}

// Fills in the homepage's top section from SITE_CONFIG's hero* fields.
// Does nothing on a page that doesn't have one (about.html).
function buildHero() {
  const headline = document.querySelector("[data-hero-headline]");
  if (!headline) return;
  const subtext = document.querySelector("[data-hero-subtext]");
  const button = document.querySelector("[data-hero-button]");
  headline.textContent = SITE_CONFIG.heroHeadline || "";
  if (subtext) subtext.textContent = SITE_CONFIG.heroSubtext || "";
  if (button) button.textContent = SITE_CONFIG.heroButtonLabel || "See the work";
}

// Fills in the footer — the fallback text for the animated line (real
// text for screen readers/search engines, same idea as the nav), the
// email/Instagram links, and a copyright line with the current year.
function buildFooter() {
  document.querySelectorAll("[data-footer-text]").forEach((el) => {
    el.textContent = SITE_CONFIG.footerText || "";
  });
  document.querySelectorAll("[data-email-link]").forEach((el) => {
    if (SITE_CONFIG.email) {
      el.href = `mailto:${SITE_CONFIG.email}`;
      el.textContent = SITE_CONFIG.email;
    } else {
      // No email set in config.js — don't show a dead/empty link.
      el.remove();
    }
  });
  document.querySelectorAll("[data-copyright]").forEach((el) => {
    const year = new Date().getFullYear();
    el.textContent = `© ${year} ${SITE_CONFIG.name || ""}`.trim();
  });
}

// The ambient preview loop is motion — skip it entirely for anyone
// who's asked their OS for reduced motion. Those tiles just keep their
// static thumbnail instead. Computed once up top since buildTile()
// needs it.
const prefersReducedMotion =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isLocalVideoFile = (url) => /\.(mp4|webm|mov)$/i.test(url || "");

// Builds one grid tile for a piece of work — used by the single flat
// grid (see buildWorkGrid below).
function buildTile(work, i) {
  const type = work.type === "film" ? "film" : "short";
  const orientation = work.orientation === "landscape" ? "landscape" : "portrait";

  const tile = document.createElement("div");
  tile.className = "tile";
  tile.dataset.type = type;
  // The title/category label only shows on hover now (see .tile-info
  // CSS), so a keyboard-only visitor needs a way to both reach that
  // state and open the piece without a mouse — tabbing to the tile
  // reveals the label (:focus-within in CSS) and Enter/Space opens it,
  // same as a click.
  tile.tabIndex = 0;
  tile.setAttribute("role", "button");
  if (work.title) tile.setAttribute("aria-label", work.title);
  tile.dataset.orientation = orientation;
  tile.style.backgroundColor = work.thumbColor || "#1a1a1a";
  tile.style.animationDelay = `${Math.min(i * 55, 440)}ms`;

  // alt text describes the actual piece (title + category) rather than
  // being left empty — these thumbnails are real content, not
  // decoration, so a screen reader and image search both get something
  // meaningful rather than nothing. Falls back to just the site name if
  // a work has neither (shouldn't normally happen, but keeps this from
  // ever rendering alt="").
  const altText = [work.title, work.category].filter(Boolean).join(" — ") || "Glenn Hui";
  const img = work.thumbImage
    ? `<img class="tile-img" src="${escapeHtml(work.thumbImage)}" alt="${escapeHtml(altText)}" loading="lazy" />`
    : "";
  // The grid tile itself only shows one combined line on hover (title
  // + category, e.g. "Chloe Chan · Athlete Profile") rather than the
  // title and category stacked as two separate lines — duration isn't
  // part of this label, it's only shown once you open the piece in the
  // lightbox. Reuses the site's existing middle-dot separator rather
  // than a dash.
  const label = [work.title, work.category].filter(Boolean).map(escapeHtml).join(" · ");

  // `previewVideo`, when set, always wins — it's a short, heavily
  // compressed clip made just for this ambient loop, so using it instead
  // of the real `videoUrl` is what keeps a page full of tiles from
  // quietly streaming full-size source video to every visitor the
  // moment each tile scrolls into view (this is what was burning through
  // Netlify's bandwidth credits — see the -preview.mp4 files alongside
  // each self-hosted short in works-data.js, not just the three
  // YouTube-embedded films that already worked this way). Falls back to
  // `videoUrl` itself only for a local file with no dedicated preview
  // clip of its own. Either way, clicking the tile always opens the
  // real, full-quality `videoUrl` — `previewVideo`/this fallback are
  // only ever used for the ambient grid loop.
  const previewSrc = isLocalVideoFile(work.previewVideo)
    ? work.previewVideo
    : isLocalVideoFile(work.videoUrl)
      ? work.videoUrl
      : null;
  // preload="none" — nothing fetches from this markup alone. Every tile
  // instead joins a small background preload queue (see
  // MAX_CONCURRENT_PRELOADS/attachPreview() below) that fetches a couple
  // of clips at a time, in order, so most of them are already loaded by
  // the time someone scrolls to them — without every single preview on
  // the page (ten-plus clips) all splitting one connection the instant
  // the grid is built, which is what was actually making things feel
  // slow/uneven before. fetchpriority="low" is what keeps the Spline
  // background winning any real contention for bandwidth throughout.
  // The MAX_CONCURRENT_PREVIEWS cap further down is a separate thing — it
  // limits concurrent *decoding* (the cause of the mobile corruption
  // bug), not fetching.
  const preview =
    previewSrc && !prefersReducedMotion
      ? `<video class="tile-preview-video" src="${escapeHtml(previewSrc)}" muted playsinline preload="none" fetchpriority="low"></video>`
      : "";

  tile.innerHTML = `
    ${img}
    ${preview}
    <div class="tile-play" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16"><polygon points="6,4 20,12 6,20" fill="#fff"/></svg>
    </div>
    <div class="tile-info">
      <div class="tile-label">${label}</div>
    </div>
  `;

  tile.addEventListener("click", () => openLightbox(work));
  tile.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLightbox(work);
    }
  });

  const imgEl = tile.querySelector(".tile-img");
  if (imgEl) imgEl.addEventListener("error", () => stepDownYoutubeThumb(imgEl), { once: true });

  const previewEl = tile.querySelector(".tile-preview-video");
  if (previewEl) attachPreview(tile, previewEl, work.previewStart || 0);

  return tile;
}

// Builds a single, unorganized grid of every piece in works-data.js (in
// the order they're listed there — see that file's own note on
// reordering). Deliberately not split into categories/sections, and
// nothing pulled out as a separate "featured" piece above it — Glenn
// adds his own videos to works-data.js from time to time, and a flat
// list means he never has to make a judgment call about which group a
// new piece belongs in, or whether it deserves special billing, just
// add the block and it shows up.
function buildWorkGrid(container) {
  if (!container || typeof WORKS === "undefined" || WORKS.length === 0) return;

  const grid = document.createElement("div");
  grid.className = "work-section-grid";
  WORKS.forEach((work, idx) => grid.appendChild(buildTile(work, idx)));
  container.appendChild(grid);

  layoutWorkGrid(grid);
  // Column width (and which breakpoint's --grid-columns/--grid-gap
  // apply) changes with the window, so this needs rerunning on resize —
  // debounced so dragging the window doesn't recompute on every pixel.
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => layoutWorkGrid(grid), 150);
  });
}

// Positions every tile with plain math — a masonry pass, not a CSS
// grid. A real CSS grid with grid-auto-flow: dense used to do this, but
// "dense" just drops each tile into the first slot it fits; it never
// looks ahead to keep things even, so a tall portrait tile next to a
// short landscape one left the whole thing looking jagged ("the spacing
// on the laptop version is a bit weirdly spaced"). This instead walks
// the tiles in order and, for each one, finds whichever column (or pair
// of adjacent columns, for a landscape tile, which is twice as wide) is
// currently shortest, and places it there — so column heights stay
// close to even throughout, without ever touching a tile's own aspect
// ratio. Nothing gets cropped: checked the actual clips against their
// boxes (1280x720 files in a 16:9 box, etc.) and they already match
// exactly, so a uniform-grid approach would only crop real footage to
// buy symmetry nobody asked for — this gets most of that evenness back
// a different way.
//
// --grid-columns/--grid-gap come from computed style (see
// .work-section-grid in styles.css) so every breakpoint's numbers still
// live in one place, same as the old grid-template-columns/gap did.
function layoutWorkGrid(grid) {
  const tiles = Array.from(grid.children);
  if (!tiles.length) return;

  const computed = getComputedStyle(grid);
  const columns = Math.max(1, parseInt(computed.getPropertyValue("--grid-columns"), 10) || 1);
  const gap = parseFloat(computed.getPropertyValue("--grid-gap")) || 0;
  const padLeft = parseFloat(computed.paddingLeft) || 0;
  const padRight = parseFloat(computed.paddingRight) || 0;
  const contentWidth = grid.clientWidth - padLeft - padRight;
  if (contentWidth <= 0) return; // not laid out yet (e.g. display: none) — try again later

  const colWidth = (contentWidth - gap * (columns - 1)) / columns;
  const columnHeights = new Array(columns).fill(0);

  tiles.forEach((tile) => {
    const isLandscape = tile.dataset.orientation === "landscape";
    // A landscape tile only gets the double-wide treatment when there's
    // a second column to pair with — on a single mobile column it's
    // just as wide as everything else, same as before.
    const span = isLandscape && columns > 1 ? 2 : 1;
    const width = colWidth * span + gap * (span - 1);
    // Matches the aspect-ratio each orientation gets in styles.css —
    // computed here (rather than measured back from the rendered tile)
    // so placing every tile doesn't force a browser layout in between.
    const height = isLandscape ? width * (9 / 16) : width * (16 / 9);

    // The best slot for this tile: among every position it could start
    // from, whichever single column (or, for a landscape tile, pair of
    // adjacent columns) has the lowest *tallest* side right now.
    let bestStart = 0;
    let bestHeight = Infinity;
    for (let start = 0; start <= columns - span; start++) {
      const sideHeight = Math.max(...columnHeights.slice(start, start + span));
      if (sideHeight < bestHeight) {
        bestHeight = sideHeight;
        bestStart = start;
      }
    }

    tile.style.width = `${width}px`;
    tile.style.left = `${bestStart * (colWidth + gap)}px`;
    tile.style.top = `${bestHeight}px`;

    const bottom = bestHeight + height + gap;
    for (let i = bestStart; i < bestStart + span; i++) {
      columnHeights[i] = bottom;
    }
  });

  // Absolutely positioned tiles don't push the container's own height
  // out, so without this the grid would collapse to nothing and
  // whatever comes after it (the footer) would sit right on top of it.
  grid.style.height = `${Math.max(...columnHeights) - gap}px`;
}

// Wires up the "glance" preview: a short muted loop of the clip starting
// at `start` seconds. Plays automatically once a tile scrolls into view
// (so it shows on phones/touch too, not just when someone happens to
// point at a tile with a mouse), and also on hover for anyone with a
// mouse/trackpad — hovering a tile that's already in view just keeps it
// playing rather than doing anything different. Kept as a tight loop
// rather than letting the whole clip play through, so each tile reads
// as a quick taste of the work rather than a full autoplaying video.
const PREVIEW_LOOP_SECONDS = 3;

// Hover is only wired up for devices that actually have it (mouse/
// trackpad) — same check used elsewhere on the site (e.g. opener.js's
// canHover). On a touch device there's no hover at all, so those tiles
// rely entirely on the scroll-into-view trigger below; tapping still
// opens the real video in the lightbox either way.
const canHoverPreview =
  typeof window.matchMedia === "function" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// Phones (mobile Safari especially) can only keep a handful of <video>
// elements actively decoding at once — go past that and the extras don't
// just fail quietly, they can visibly corrupt (color smearing, stray
// blocks, stale frames) while they fight over the same hardware decoder.
// The wider rootMargin below means several tiles can want to play at once
// while scrolling a single-column mobile grid, so this caps how many
// previews are *actually* playing at a time — the rest just sit on their
// static thumbnail until a slot frees up, rather than every in-range tile
// calling .play() unconditionally.
const MAX_CONCURRENT_PREVIEWS = 3;
const activePreviewVideos = [];
const waitingPreviews = []; // { video, activate } in request order

function releasePreviewSlot(video) {
  const idx = activePreviewVideos.indexOf(video);
  if (idx !== -1) activePreviewVideos.splice(idx, 1);
  while (activePreviewVideos.length < MAX_CONCURRENT_PREVIEWS && waitingPreviews.length) {
    const next = waitingPreviews.shift();
    next.activate();
  }
}

function dequeuePreview(video) {
  const idx = waitingPreviews.findIndex((entry) => entry.video === video);
  if (idx !== -1) waitingPreviews.splice(idx, 1);
}

// Background preload queue — fetches every tile's clip ahead of time, in
// the order they appear on the page, a couple at a time. Two earlier
// approaches both missed: starting every single preview's fetch at once
// (eleven clips all splitting one connection — the actual cause of the
// "odd speeds") was too much at once, and only starting a tile's fetch
// once someone actually scrolled to it was too little too late (a
// multi-second fetch starting right as a tile arrives reads as a stall,
// not a preview). This keeps a small, steady trickle of fetches running
// in the background the whole time someone's on the page, so most tiles
// are already loaded by the time a visitor scrolls to them, while
// fetchpriority="low" on every video tag (see buildTile()) is what
// actually keeps the Spline background winning any real contention for
// bandwidth — this queue just keeps that contention small and orderly
// instead of all-at-once.
const MAX_CONCURRENT_PRELOADS = 2;
const preloadQueue = [];
let activePreloads = 0;
// A short head start for Spline's own first requests (its runtime +
// scene file) before any preview fetch joins in at all — imperceptible
// to a visitor, but means the very first bytes on the wire are Spline's,
// not a photo-finish with ten video tags that happen to parse first.
let preloadingUnlocked = false;
setTimeout(() => {
  preloadingUnlocked = true;
  advancePreloadQueue();
}, 250);

function advancePreloadQueue() {
  if (!preloadingUnlocked) return;
  while (activePreloads < MAX_CONCURRENT_PRELOADS && preloadQueue.length) {
    const next = preloadQueue.shift();
    activePreloads++;
    next();
  }
}

function preloadSlotFreed() {
  activePreloads = Math.max(0, activePreloads - 1);
  advancePreloadQueue();
}

function dequeuePreload(entry) {
  const idx = preloadQueue.indexOf(entry);
  if (idx !== -1) preloadQueue.splice(idx, 1);
}

function attachPreview(tile, video, start) {
  // The loop window, clamped once we know the clip's real length — a
  // `previewStart` set close to the end of a short clip would otherwise
  // try to loop past where the video actually stops.
  let loopStart = start;
  let metadataReady = false;
  // Two independent reasons the loop might be playing — in view, or
  // hovered — so leaving one doesn't stop it if the other still applies
  // (e.g. the mouse drifts off a tile that's still on screen).
  let inView = false;
  let hovering = false;
  // Tracks whether this tile's own fetch has started yet, and (while
  // it's still waiting its turn) the queue entry representing it — see
  // startFetchingNow()/runFromQueue() below.
  let startedLoading = false;
  let queueEntry = null;

  video.addEventListener("loadedmetadata", () => {
    if (isFinite(video.duration)) {
      loopStart = Math.min(start, Math.max(0, video.duration - PREVIEW_LOOP_SECONDS));
    }
    metadataReady = true;
    try {
      video.currentTime = loopStart;
    } catch (err) {
      // Not seekable yet — it'll just start from wherever playback begins.
    }
  });

  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= loopStart + PREVIEW_LOOP_SECONDS) {
      video.currentTime = loopStart;
    }
  });

  function resetToLoopStart() {
    if (!metadataReady) return;
    try {
      video.currentTime = loopStart;
    } catch (err) {
      // Not seekable yet — fine, playback just starts from 0.
    }
  }

  function activate() {
    tile.classList.add("preview-active");
    video.play().catch(() => {
      // Autoplay can still be blocked in rare cases — the static
      // thumbnail stays visible underneath either way.
    });
  }

  // Actually kicks off this tile's network fetch — only ever once.
  // Markup ships with preload="none" so nothing happens before this
  // runs; switching to "auto" and calling load() is what starts the
  // browser pulling clip bytes.
  function startFetchingNow() {
    if (startedLoading) return;
    startedLoading = true;
    video.preload = "auto";
    video.load();
  }

  // This tile's turn in the background preload queue. If sync() already
  // force-started it in the meantime (someone scrolled to it ahead of
  // its turn), just hand the slot straight back instead of loading
  // twice or leaking a slot that never frees up.
  function runFromQueue() {
    queueEntry = null;
    if (startedLoading) {
      preloadSlotFreed();
      return;
    }
    startFetchingNow();
    const freeSlot = () => {
      video.removeEventListener("canplaythrough", freeSlot);
      clearTimeout(fallback);
      preloadSlotFreed();
    };
    // "canplaythrough" (enough buffered to play without stalling) is the
    // real signal; the timeout is a safety net so one slow clip on a bad
    // connection can't hold up every tile behind it in the queue.
    video.addEventListener("canplaythrough", freeSlot, { once: true });
    const fallback = setTimeout(freeSlot, 4000);
  }

  queueEntry = runFromQueue;
  preloadQueue.push(queueEntry);
  advancePreloadQueue();

  function sync() {
    const wantsToPlay = inView || hovering;
    const isActive = activePreviewVideos.indexOf(video) !== -1;

    if (wantsToPlay) {
      // Needed right now — jump the background queue rather than wait
      // for its turn. Pull it out of the queue first so runFromQueue()
      // doesn't later try to load it again or double-free a slot.
      if (queueEntry) {
        dequeuePreload(queueEntry);
        queueEntry = null;
      }
      startFetchingNow();
      if (isActive) return; // already playing, nothing to do
      dequeuePreview(video); // drop a stale queue entry before re-requesting
      if (activePreviewVideos.length < MAX_CONCURRENT_PREVIEWS) {
        activePreviewVideos.push(video);
        activate();
      } else {
        // At the concurrency cap — wait for a slot rather than piling on
        // another decoder. Stays on the static thumbnail until then.
        waitingPreviews.push({ video, activate: () => {
          activePreviewVideos.push(video);
          activate();
        } });
      }
    } else {
      tile.classList.remove("preview-active");
      video.pause();
      dequeuePreview(video);
      if (isActive) releasePreviewSlot(video);
    }
  }

  if (canHoverPreview) {
    tile.addEventListener("mouseenter", () => {
      // Only reset to the start if it wasn't already looping from being
      // in view — otherwise hovering mid-loop would visibly jump back.
      if (!inView) resetToLoopStart();
      hovering = true;
      sync();
    });
    tile.addEventListener("mouseleave", () => {
      hovering = false;
      sync();
    });
  }

  if ("IntersectionObserver" in window) {
    // rootMargin grows the trigger zone a little past the actual viewport
    // edges (150px above and below) — without this, a tile only started
    // loading/playing the instant it was 40% visible, which read as a
    // beat of "still just the static thumbnail" every time a new tile
    // arrived. A small head start smooths that out. threshold: 0 (rather
    // than the old 0.4) means "fire the moment any part of the tile
    // enters that zone."
    //
    // This used to be 500px, which caused a real bug: a tile counts as
    // "in view" for as long as it's anywhere in this zone, so with a
    // margin that wide each tile stayed "in view" — and holding one of
    // the MAX_CONCURRENT_PREVIEWS slots above — across a huge scroll
    // range. In practice the first 3 tiles grabbed the only slots and
    // didn't let go for ages, so everything else just sat on its static
    // thumbnail while scrolling — looked like previews had stopped
    // working. Keeping this margin small means a tile's slot frees up
    // again soon after it's actually scrolled past, so the queue keeps
    // moving. MAX_CONCURRENT_PREVIEWS above stays as a safety net for
    // the (now much rarer) case of several tiles genuinely overlapping
    // the viewport at once.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasInView = inView;
        inView = entry.isIntersecting;
        if (inView && !wasInView) resetToLoopStart();
        sync();
      },
      { threshold: 0, rootMargin: "150px 0px" }
    );
    observer.observe(tile);
  }
}

// YouTube doesn't generate a "maxresdefault" (1280x720) thumbnail for
// every video — if one 404s, this steps down through YouTube's other
// standard thumbnail sizes until one actually loads, instead of leaving
// a broken image on the tile. Only kicks in for img.youtube.com URLs;
// does nothing for thumbs/ files or other image hosts.
const YT_THUMB_SIZES = ["maxresdefault", "sddefault", "hqdefault", "mqdefault"];

function stepDownYoutubeThumb(img) {
  const match = img.src.match(/img\.youtube\.com\/vi\/([^/]+)\/(\w+)\.jpg/);
  if (!match) return;
  const [, videoId, currentSize] = match;
  const next = YT_THUMB_SIZES[YT_THUMB_SIZES.indexOf(currentSize) + 1];
  if (!next) return; // already tried every size
  img.src = `https://img.youtube.com/vi/${videoId}/${next}.jpg`;
  img.addEventListener("error", () => stepDownYoutubeThumb(img), { once: true });
}

function openLightbox(work) {
  let lightbox = document.getElementById("lightbox");
  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.className = "lightbox";
    lightbox.innerHTML = `
      <div class="lightbox-close" id="lightbox-close" aria-label="Close">✕</div>
      <div class="lightbox-inner">
        <div class="lightbox-frame" id="lightbox-frame"></div>
        <div class="lightbox-caption">
          <div class="tile-title" id="lightbox-title"></div>
          <div class="tile-category" id="lightbox-category"></div>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  const inner = document.querySelector(".lightbox-inner");
  const frame = document.getElementById("lightbox-frame");
  const igPermalink = getInstagramPermalink(work.videoUrl);
  inner.classList.toggle("ig-embed", !!igPermalink);
  // Landscape pieces (the HKCR films + a few wide shorts) get a wider,
  // 16:9 player instead of being squeezed into the default 9:16 column
  // built for portrait Reels.
  inner.classList.toggle("landscape", !igPermalink && work.orientation === "landscape");

  if (igPermalink && location.protocol === "file:") {
    // Instagram's embed widget refuses to render when the page is opened
    // directly as a local file (double-clicked) instead of a real web
    // address — this isn't a bug, it just can't be previewed this way.
    // Vimeo/YouTube links don't have this problem. Link out instead so
    // the preview isn't just a blank box.
    frame.innerHTML = `<div class="lightbox-empty">Instagram videos can't preview from a local file. They'll work once this site is actually hosted on a web address (see README.md).<br><br><a href="${igPermalink}" target="_blank" rel="noopener">Watch this reel on Instagram ↗</a></div>`;
  } else {
    const embed = getEmbedHtml(work.videoUrl);
    frame.innerHTML = embed
      ? embed
      : `<div class="lightbox-empty">No video link added yet.<br>Add a Vimeo, YouTube, or Instagram Reel link for this entry in works-data.js.</div>`;
    if (igPermalink && embed) {
      showSpinnerUntilEmbedReady(frame);
      loadInstagramEmbed();
    }
  }

  document.getElementById("lightbox-title").textContent = work.title || "";
  document.getElementById("lightbox-category").textContent = [work.category, work.duration]
    .filter(Boolean)
    .join(" · ");
  lightbox.classList.add("open");
}

function showSpinnerUntilEmbedReady(frame) {
  // Instagram's widget replaces the <blockquote> we inserted with its own
  // <iframe>, but that swap only happens once its script finishes a
  // background fetch — until then the frame just looks empty. Show a
  // small spinner over it so the wait reads as "loading" rather than
  // "broken", and remove it as soon as the real player shows up.
  const spinner = document.createElement("div");
  spinner.className = "ig-spinner";
  frame.appendChild(spinner);

  const done = () => {
    spinner.remove();
    observer.disconnect();
    clearTimeout(safety);
    frame._igObserver = null;
  };

  const observer = new MutationObserver(() => {
    if (frame.querySelector("iframe")) done();
  });
  observer.observe(frame, { childList: true, subtree: true });
  frame._igObserver = done; // so closeLightbox can clean up early if closed mid-load

  // Safety net — if something goes wrong (blocked script, slow network),
  // don't leave a spinner spinning forever.
  const safety = setTimeout(done, 8000);
}

function loadInstagramEmbed() {
  // Instagram's official embed widget (required — their branding/header
  // can't be removed, that's a platform rule, not a bug). Loads their
  // script once, then re-processes any new embed each time we open one.
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
    return;
  }
  if (document.getElementById("ig-embed-script")) return; // already loading
  const script = document.createElement("script");
  script.id = "ig-embed-script";
  script.async = true;
  script.src = "https://www.instagram.com/embed.js";
  script.onload = () => {
    if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
  };
  document.body.appendChild(script);
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  lightbox.classList.remove("open");
  const frame = document.getElementById("lightbox-frame");
  if (frame._igObserver) frame._igObserver(); // stop watching if still loading
  frame.innerHTML = ""; // stop playback
}

function getInstagramPermalink(url) {
  if (!url) return null;
  const igMatch = url.match(/instagram\.com\/(?:[^/]+\/)?(reel|p|tv)\/([\w-]+)/);
  return igMatch ? `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/` : null;
}

function getEmbedHtml(url) {
  if (!url) return null;

  const vimeoMatch = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
  if (vimeoMatch) {
    const id = vimeoMatch[1];
    return `<iframe src="https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }

  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (ytMatch) {
    const id = ytMatch[1];
    return `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }

  const igPermalink = getInstagramPermalink(url);
  if (igPermalink) {
    // This renders Instagram's own widget, including their header/footer —
    // that branding is required by Instagram and can't be stripped out.
    return `<blockquote class="instagram-media" data-instgrm-permalink="${igPermalink}" data-instgrm-version="14" style="margin:0; width:100%;"></blockquote>`;
  }

  if (/\.(mp4|webm|mov)$/i.test(url)) {
    return `<video src="${url}" controls autoplay playsinline></video>`;
  }

  return null;
}

function buildAbout() {
  const heading = document.getElementById("about-heading");
  const bio = document.getElementById("about-bio");
  const role = document.getElementById("about-role");
  const email = document.getElementById("about-email");
  const ig = document.getElementById("about-instagram");
  const photo = document.getElementById("about-photo");
  const placeholder = document.getElementById("about-photo-placeholder");

  if (!heading && !bio) return;

  if (heading) heading.textContent = SITE_CONFIG.name;
  if (role) role.textContent = SITE_CONFIG.role;
  if (bio) bio.textContent = SITE_CONFIG.bio;
  if (photo) {
    if (SITE_CONFIG.photo) {
      // A real photo's set — show it, hide the placeholder text.
      photo.src = SITE_CONFIG.photo;
      photo.alt = SITE_CONFIG.name || "";
      photo.style.display = "";
      if (placeholder) placeholder.style.display = "none";
    } else {
      // No photo yet — keep the box on the page (reserved space, not
      // just absent) but show the grey placeholder instead of a
      // broken/empty <img>.
      photo.style.display = "none";
      photo.removeAttribute("src");
      if (placeholder) {
        // First name only ("Image of Glenn", not "Image of Glenn Hui") —
        // still pulled from SITE_CONFIG.name rather than hardcoded, so
        // it keeps tracking whatever name's actually set there.
        const firstName = (SITE_CONFIG.name || "Glenn").trim().split(/\s+/)[0];
        placeholder.textContent = `Image of ${firstName}`;
        placeholder.style.display = "";
      }
    }
  }
  if (email) {
    email.textContent = SITE_CONFIG.email;
    email.href = `mailto:${SITE_CONFIG.email}`;
  }
  if (ig) ig.href = SITE_CONFIG.instagramUrl;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Runs immediately rather than waiting for DOMContentLoaded — and only
// now, at the bottom of the file, after every function and const above
// actually exists. This tag is already the very last thing in <body>,
// so every element these functions touch (nav, footer, hero, grouped
// work, the About page) has already been parsed into the page by the
// time this runs — same guarantee DOMContentLoaded would have given.
// The difference is that p5.js and opener.js above are both loaded with
// `defer`, and by spec every deferred script runs before
// DOMContentLoaded fires — so wrapping this in a DOMContentLoaded
// listener was making the plain nav/footer text (SITE_CONFIG.name
// replacing the literal "NAME" placeholder in the HTML, etc.) sit and
// wait on the p5.js CDN fetch finishing first, even though none of this
// needs p5 or opener.js at all. That's what was showing up as "NAME"
// sitting on screen for a moment before the real name replaced it: a
// slow CDN response was directly holding up a completely unrelated bit
// of text.
// Each page's <title> is now written by hand in its own HTML (e.g.
// "Glenn Hui | Videographer" on the homepage, "Glenn Hui | About" on
// the About page) rather than just "Glenn Hui" everywhere — that's
// what shows up in a Google result and browser tab, so it's worth it
// being specific per page for SEO rather than generic and identical
// on every page.
// This used to overwrite that with a bare SITE_CONFIG.name on every
// load, which quietly undid it — if SITE_CONFIG.name ever changes,
// update the <title> in index.html/about.html by hand to match rather
// than relying on this to keep them in sync.
buildNav();
buildMobileMenu();
buildHero();
buildFooter();

buildWorkGrid(document.getElementById("work-sections"));

buildAbout();

// Fades the Spline background to solid black as the page scrolls. On
// mobile the scene never shows through the WORK grid at all (#work gets
// a flat black background there — see styles.css) because gaps between
// single-column tiles are so big and frequent it flickered; desktop
// never got that treatment, so the scene stayed fully visible through
// every gap in the grid all the way down the page ("I really need the
// spline to... the videos to load before people scroll" — paired with
// "could the hero slowly fade to black as you scroll down so it doesn't
// show behind the videos"). An abrupt switch, like mobile's, would just
// make the scene vanish rather than let it sink away, so this instead
// ramps .spline-fade's opacity from 0 to 1 continuously across exactly
// one viewport height of scrolling — about the same distance as
// .hero-spacer — so it reads as the scene gradually going dark, and by
// the time the first WORK tiles actually arrive it's already fully
// black behind them. Only present on pages with a .spline-bg (index.html
// — About has neither).
const splineFade = document.querySelector(".spline-bg .spline-fade");
if (splineFade) {
  let fadeQueued = false;
  function updateSplineFade() {
    const progress = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
    splineFade.style.opacity = progress;
    fadeQueued = false;
  }
  updateSplineFade(); // correct immediately if the page loads already scrolled
  window.addEventListener(
    "scroll",
    () => {
      if (fadeQueued) return;
      fadeQueued = true;
      requestAnimationFrame(updateSplineFade);
    },
    { passive: true }
  );
}

// Warm up Instagram's embed script in the background as soon as the
// page loads (instead of only starting the fetch the moment someone
// clicks a tile) — by the time a visitor actually opens a video, the
// script is usually already loaded, so there's less of a delay
// between clicking and the player appearing.
if (typeof WORKS !== "undefined" && WORKS.some((w) => getInstagramPermalink(w.videoUrl))) {
  loadInstagramEmbed();
}
