# Glenn Hui's portfolio site

A simple, free-to-run portfolio site. No coding needed for normal updates —
you only ever edit two files:

- **`config.js`** — your name, bio, email, Instagram link
- **`works-data.js`** — the list of videos on the site

Everything else (`index.html`, `about.html`, `styles.css`, `script.js`) is
the "engine" and you shouldn't need to touch it.

## Adding a new video

1. Open `works-data.js` in any text editor (even Notepad/TextEdit works).
2. Copy one whole block, from `{` to `}`, including the comma after it.
3. Paste it just above the closing `];` at the bottom of the file.
4. Fill in the title, category, and a video link (see below).
5. Save the file and re-upload it to your hosting (see below).

**If this feels fiddly:** open [claude.ai](https://claude.ai), paste in the
contents of `works-data.js`, paste the new video link, and say something
like *"add this as a new entry in the same style as the others, title it
X, category Y."* Copy what it gives you back into the file.

### Which video link to use

The `videoUrl` field accepts four kinds of links:

| Source | Player shown | Branding |
|---|---|---|
| Vimeo | Clean, full-frame player | None |
| YouTube | Clean, full-frame player | None |
| A video file in the `videos/` folder (e.g. `videos/my-clip.mp4`) | Clean, full-frame player | None |
| Instagram Reel | Instagram's own widget | Shows Instagram's logo + "View on Instagram" — this is required by Instagram and can't be removed, on this or any website |

If you want the cleanest look with no third-party branding, either upload
the clip to a free [Vimeo](https://vimeo.com) account (privacy setting:
"Anyone can view, but hide from Vimeo's site") and use that link, or drop
the video file itself into the `videos/` folder and point `videoUrl` at
it (e.g. `videos/my-clip.mp4`) instead of the Instagram one.

**A note on self-hosted video files:** if you're adding your own clip
to `videos/`, keep it reasonably compressed — H.264 (not HEVC/H.265,
which some browsers can't play), ideally under ~100MB, at 1080p rather
than 4K. A big uncompressed export can be 5-10x larger than it needs to
be for web use with no visible quality difference at the sizes these
tiles display at. If in doubt, paste the file into this conversation and
ask Claude to compress it for the site first.

### The other fields: type, orientation, featured, duration

Beyond title/category/videoUrl/thumbImage, each entry also has:

- **`type`** — `"short"` or `"film"`. Controls the SHORTS/FILMS filter
  buttons and whether a "FILM" badge shows on the tile.
- **`orientation`** — `"portrait"` or `"landscape"`. Portrait tiles are
  tall and narrow; landscape tiles are twice as wide. Match it to the
  clip's actual shape.
- **`featured`** — set to `true` on at most one standout piece to show
  it extra-large and full-width. Leave it off (or `false`) for everything
  else.
- **`duration`** — e.g. `"0:26"`. Optional — leave it as `""` if you
  don't know it offhand.

Full details and examples are in the comment block at the top of
`works-data.js` itself.

## Posting updates — how to make this low-effort for Glenn

Right now, adding a video means editing `works-data.js` by hand (with
Claude/ChatGPT's help if useful) and re-uploading. There isn't a way to
make new Instagram posts appear on the site *automatically* without one
of the setups below — Instagram doesn't let any outside website watch
your account for free. In order of effort:

**1. Manual, as built (no cost, ~2 minutes per video)**
Post to Instagram as normal, then paste the Reel link (or a Vimeo
re-upload) into `works-data.js` and re-publish. This is what's set up
today. Simplest to maintain, no accounts to manage.

**2. A feed-widget service (low effort, usually a monthly cost)**
Services like SnapWidget, LightWidget, or Elfsight connect to your
Instagram account once and auto-refresh a feed widget whenever you post.
No coding. Free tiers exist but usually cap the number of posts shown
and/or add the widget's own small badge; removing that badge and getting
more posts typically needs a paid plan (roughly $5–15/month). Good
option if Glenn wants true "post and forget."

**3. Instagram's Graph API, self-built (no ongoing cost, more setup)**
Convert the Instagram account to a Creator or Business account, register
a free Meta developer app, and connect it — then a small script can pull
new posts automatically. This is the most "automatic" and free option,
but the initial setup involves Meta's developer console and isn't
something Glenn could do without help. Come back to this conversation if
you want to go this route and I can walk through it.

Whichever you choose, note: **none of these can hide Instagram's own
branding on Instagram-sourced content** — that's a platform rule, not a
technical limitation. The only way to get a fully unbranded player is to
host the video yourself (Vimeo/YouTube) rather than embedding it from
Instagram directly.

## Editing your bio / contact info

Open `config.js` and edit the text between the quote marks. Don't touch
anything else.

## Previewing changes before you publish

Double-click `index.html` — it opens in your browser and you can check it
looks right before uploading anywhere.

## Hosting it for free

You don't need to pay for hosting. Two easy, free options:

**Option A — Netlify Drop (simplest)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your whole site folder onto the page
3. You get a live link immediately. To update the site later, make your
   edits and drag the folder on again.

**Option B — GitHub Pages (better for frequent updates)**
1. Create a free GitHub account and a new repository, upload these files.
2. In the repo settings, turn on "GitHub Pages" for the main branch.
3. After that, you can edit `works-data.js` directly on github.com (click
   the pencil icon on the file) and it republishes automatically — no
   re-uploading needed.

Either way, if you want a custom domain (e.g. `glennhui.com`) later, you
can buy one from any registrar (Namecheap, Google Domains, etc.) and point
it at Netlify or GitHub Pages — both have free instructions for this.

## Any changes to layout or design

For anything beyond text/video updates — colors, fonts, adding a new page,
changing the grid layout — come back to this Claude conversation, or paste
the relevant file into Claude/ChatGPT and describe what you want changed.
