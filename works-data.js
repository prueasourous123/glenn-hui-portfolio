/* ============================================================
   WORK / VIDEOS
   ------------------------------------------------------------
   This is the list of videos on the site. Each video is one
   block between { and }. To add a new one:

     1. Copy an entire block below, from the { to the },
     2. Paste it just above the closing "];" line at the bottom,
     3. Fill in the fields (see guide below),
     4. Save the file and re-upload it (see README.md).

   Not sure how to do this? Paste this whole file into Claude or
   ChatGPT, paste the video link you want to add, and say:
   "add this as a new entry in the same style as the others."

   ------------------------------------------------------------
   FIELD GUIDE
   ------------------------------------------------------------
   title       Short title shown on the tile, e.g. "NIKE AD"

   category    Small label under the title, e.g. "BRANDED",
               "MUSIC VIDEO", "PERSONAL", "DOCUMENTARY", or a series/
               competition name like "HKCR 7S". Keep it short.

   duration    The clip's length, e.g. "0:26" or "9:17". Leave as ""
               if you don't know it offhand — it's optional.

   type        Either "short" or "film". Controls the SHORTS / FILMS
               filter buttons at the top of the page, and films get
               a small "FILM" badge on their tile.

   orientation Either "portrait" or "landscape". Portrait clips show
               as tall tiles, landscape clips show twice as wide.
               (If you leave this out, it defaults to "portrait".)

               Note on order: the grid shows these blocks in the same
               order they're listed in this file, top to bottom, left
               to right. Want a particular piece to be the first thing
               people see? Move its whole block to the very top of the
               list (just under this guide).

   videoUrl    Paste a normal video link here — Vimeo, YouTube, an
               Instagram Reel link, or a path to a video file saved
               in the videos/ folder next to this file all work:
               "https://vimeo.com/76979871"
               "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
               "https://www.instagram.com/reel/XXXXXXXXXXX/"
               "videos/my-clip.mp4"
               Portrait (vertical) videos work best for this site.

               Note on Instagram links: when it opens, it shows
               Instagram's own player with their logo/"View on
               Instagram" bar — that's required by Instagram and
               can't be removed. Vimeo/YouTube/self-hosted links open
               in a clean player with no third-party branding.

   previewVideo  Optional, but recommended for every self-hosted video.
               The grid can automatically play a few seconds of the
               ambient preview loop for any tile that scrolls into
               view, for every visitor — if videoUrl is a full-size
               local file and there's no previewVideo, that full file
               is what gets streamed for this, over and over, to
               everyone who scrolls past it, which is exactly what ran
               this site's Netlify bandwidth credits down. previewVideo
               lets you point the loop at a small, separate clip
               instead — a few seconds, trimmed and compressed down
               (ask Claude/ChatGPT to make one from the full file if
               you're not sure how), saved in videos/ just like a
               full-size file would be: "videos/my-clip-preview.mp4"
               This is also still required if videoUrl is a Vimeo/
               YouTube/Instagram link, since the grid can't pull a loop
               out of those automatically at all. Clicking the tile
               always opens the real videoUrl above either way —
               previewVideo is only ever used for the ambient grid
               loop.

   previewStart  Optional. The number of seconds into whichever file is
               actually providing the preview (videoUrl if it's a local
               file, otherwise previewVideo above) where the grid's loop
               should start. The grid tile plays about 3 seconds from
               this point, on a loop, once that tile scrolls into view —
               not just on hover, so it shows on phones too. Pick a
               moment that looks good at a glance (a colourful, clear
               shot), not necessarily the very start of the clip. Leave
               it out to start from 0. If previewVideo is already
               trimmed down to just the moment you want, leave this out
               too.

   thumbColor  A background color for the tile, shown behind (or
               instead of) the thumbnail image. Any hex color
               works, e.g. "#1a1a1a". Leave as-is if unsure.

   thumbImage  Optional but recommended — a cover photo shown on the
               grid tile itself, so it doesn't sit blank until
               clicked. Leave as "" to just show thumbColor instead.
               Three ways to fill this in:
                 - A file path like "thumbs/my-video.jpg" pointing
                   at an image saved in the thumbs/ folder next to
                   this file (ask Claude/ChatGPT to grab a still from
                   the video and save it there for you).
                 - A direct image URL, e.g. a YouTube thumbnail
                   (https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg
                   — the highest-res option; the site automatically
                   falls back to a slightly lower-res YouTube thumbnail
                   if a particular video doesn't have one that large)
                   or a Vimeo-generated one.
                 - Instagram's own image links expire quickly, so for
                   Instagram Reels always save a still into thumbs/
                   instead of linking to Instagram directly.

   ============================================================ */

// Manually ordered, not grouped by series/type: JIA YOU leads (its cover
// is the "加油" title-card frame, not an action shot), then two portrait
// shorts, then the landscape pieces are threaded through the rest of the
// list one at a time instead of either bunched at the top (reads as two
// horizontal videos stacked together) or all dumped at the bottom (reads
// as an afterthought) — a landscape piece every couple of entries.
// Reorder freely — see the note at the top of this file for how.
const WORKS = [
  {
    title: "加油",
    category: "Hong Kong China Rugby",
    duration: "0:26",
    type: "short",
    orientation: "landscape",
    videoUrl: "videos/jia-you.mp4",
    previewVideo: "videos/jia-you-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/jia-you.jpg",
  },
  {
    title: "Home Soil",
    category: "Documentary",
    duration: "",
    type: "film",
    orientation: "landscape",
    videoUrl: "https://www.youtube.com/watch?v=Uqm7miilfEU",
    previewVideo: "videos/home-soil-preview.mp4",
    thumbColor: "#141414",
    thumbImage: "https://img.youtube.com/vi/Uqm7miilfEU/maxresdefault.jpg",
  },
  {
    title: "Men's Victory",
    category: "Hong Kong China Rugby Sevens",
    duration: "0:18",
    type: "short",
    orientation: "portrait",
    videoUrl: "videos/mens-victory.mp4",
    previewVideo: "videos/mens-victory-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/mens-victory.jpg",
  },
  {
    title: "Brand New Day",
    category: "Hong Kong China Rugby Sevens",
    duration: "0:32",
    type: "short",
    orientation: "landscape",
    videoUrl: "videos/brand-new-day.mp4",
    previewVideo: "videos/brand-new-day-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/brand-new-day.jpg",
  },
  {
    title: "Two Sides",
    category: "World Rugby",
    duration: "0:44",
    type: "short",
    orientation: "portrait",
    videoUrl: "videos/two-sides.mp4",
    previewVideo: "videos/two-sides-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/two-sides.jpg",
  },
  {
    title: "Chloe Chan",
    category: "Athlete Profile",
    duration: "",
    type: "film",
    orientation: "landscape",
    videoUrl: "https://www.youtube.com/watch?v=iLvCqG-6wI8",
    previewVideo: "videos/chloe-chan-preview.mp4",
    thumbColor: "#1a1a1a",
    thumbImage: "https://img.youtube.com/vi/iLvCqG-6wI8/maxresdefault.jpg",
  },
  {
    title: "Full Time HK v SAM",
    category: "Hong Kong China Rugby WXV",
    duration: "0:40",
    type: "short",
    orientation: "portrait",
    videoUrl: "videos/wxv-full-time.mp4",
    previewVideo: "videos/wxv-full-time-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/wxv-full-time.jpg",
  },
  {
    title: "Message to HK",
    category: "Recovery Hub",
    duration: "0:19",
    type: "short",
    orientation: "portrait",
    videoUrl: "videos/recovery-hub.mp4",
    previewVideo: "videos/recovery-hub-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/recovery-hub.jpg",
  },
  {
    title: "Max Denmark",
    category: "Athlete Profile",
    duration: "",
    type: "film",
    orientation: "landscape",
    videoUrl: "https://www.youtube.com/watch?v=-Yb69_bVQ9w",
    previewVideo: "videos/max-denmark-preview.mp4",
    thumbColor: "#1a1a1a",
    thumbImage: "https://img.youtube.com/vi/-Yb69_bVQ9w/maxresdefault.jpg",
  },
  {
    title: "Highlight Reel",
    category: "International Fencing Federation",
    duration: "0:26",
    type: "short",
    orientation: "portrait",
    videoUrl: "videos/fie-highlight-reel.mp4",
    previewVideo: "videos/fie-highlight-reel-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/fie-highlight-reel.jpg",
  },
  {
    title: "The Jersey",
    category: "Hong Kong China Rugby U20s",
    duration: "1:11",
    type: "short",
    orientation: "landscape",
    videoUrl: "videos/u20s-the-jersey.mp4",
    previewVideo: "videos/u20s-the-jersey-preview.mp4",
    thumbColor: "#1c1c1c",
    thumbImage: "thumbs/u20s-the-jersey.jpg",
  },
];
