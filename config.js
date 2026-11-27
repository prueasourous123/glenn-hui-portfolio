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

  // His About page bio. Uses backticks (`) instead of quote marks so
  // actual line breaks (just press Enter) work here — each blank line
  // below becomes its own paragraph break on the page.
  bio: `I believe there is always a story to be told, it's just a matter of knowing where to point the lens.

I'm Glenn Hui, a Hong Kong-based creative producer and filmmaker. Over the last few years, my camera has taken me everywhere from the sidelines of international rugby tournaments and high-intensity gyms to editorial sets with cultural icons and lifestyle brands like Prestige and Lifestyle Asia.

For me, great production isn't just about sharp visuals or clean edits; it's about rhythm, emotion, and clarity. I focus on crafting videos that don't just look good, but actually connect with the people watching them. Whether it's a quick-turnaround social reel or a multi-part brand documentary, I love taking a project from a blank page all the way to the final color grade.

When I'm not behind a camera or cutting timelines in DaVinci Resolve, you'll usually find me on the rugby pitch. Having represented Hong Kong China, I know firsthand what real-world grit and resilience look like, and that's the exact energy I try to bring into every frame I shoot.

Got a project in mind? Get in touch and let's work together.`,

  // A photo for the About page, shown to the right of the text. A file
  // path like "photos/glenn.jpg" pointing at an image saved in the
  // photos/ folder next to this file works best. Leave as "" and that
  // spot shows a plain grey placeholder instead (currently the case) —
  // the space for it is already reserved, just drop a real photo path
  // in here whenever one's ready.
  photo: "",

  // Contact email, shown on the About page
  email: "studiosmmt@gmail.com",

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
