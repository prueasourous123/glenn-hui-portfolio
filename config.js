/* ============================================================
   SITE SETTINGS
   ------------------------------------------------------------
   Edit the text between the quote marks below to update the
   site. Don't touch anything else (commas, quotes, brackets).

   Not sure how to do something here? Paste this whole file into
   Claude or ChatGPT and describe the change you want.
   ============================================================ */

const SITE_CONFIG = {
  // Shows in the top nav bar, the browser tab title, the About page
  // heading, and the footer copyright line. Natural capitalization is
  // fine — the animated nav name (opener.js) always draws it in caps
  // itself regardless of how it's typed here, but the About page
  // heading now shows it exactly as typed, to match a "Name" (not
  // "NAME") style heading.
  name: "Glenn Hui",

  // One line under the intro on the About page
  role: "Videographer, behind the lens of @mmt_studios",

  // A couple of sentences about him. Keep it short. Uses backticks (`)
  // instead of quote marks so an actual line break (just press Enter)
  // works here — the sign-off below is its own line because of that,
  // not a separate field. Delete that last line (and the blank line
  // above it) if a plain sign-off isn't wanted, or swap "Glenn" for
  // anything else.
  bio: `I'm from Hong Kong, grew up in Sydney. Rugby's been part of my life for as long as I can remember, and I've been creating content for years now. I just love being behind the camera, creating.

Glenn`,

  // A photo for the About page, shown to the right of the text. A file
  // path like "photos/glenn.jpg" pointing at an image saved in the
  // photos/ folder next to this file works best. Leave as "" and that
  // spot shows a plain grey placeholder instead (currently the case) —
  // the space for it is already reserved, just drop a real photo path
  // in here whenever one's ready.
  photo: "",

  // Contact email, shown on the About page
  email: "hello@example.com",

  // Full link to his Instagram profile
  instagramUrl: "https://www.instagram.com/glennhuii",

  // Word used for the work/portfolio nav link (e.g. "WORK", "REELS", "FILMS")
  workLabel: "WORK",

  // ---------------------------------------------------------------
  // HOMEPAGE TOP SECTION (above the work grid)
  // ---------------------------------------------------------------

  // The big headline. Keep it short — this is the one line meant to
  // land in a glance, not a full sentence.
  heroHeadline: "Based in Hong Kong.",

  // A sentence or two under the headline, giving a bit more context
  // on Glenn himself rather than naming a specific sport, even though
  // a lot of the work below happens to be rugby — the work itself
  // (and its captions) carries that, not the hero.
  heroSubtext: "Passionate about creating, and about showing people what I see.",

  // Text on the button under the hero text — scrolls down to the work.
  heroButtonLabel: "See the work",

  // Shows at the bottom of every page, in the big footer — this is the
  // main "get in touch" moment now (the separate contact form was
  // removed; Email/Instagram in the footer are the way to reach out).
  // Keep it short, one line.
  footerText: "Let's work together",
};
