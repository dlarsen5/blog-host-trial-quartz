# Neutron Universe blog: Quartz 5

The blog at https://blog.neutronuniverse.com/, built with Quartz 5.0.0 (upstream v5 commit `97a2d05f80c4c50534959b1d0d41cc4b3895625e`) and styled with NTRN Solar House v4.0.0, which is vendored under `quartz/static/ntrn/` with its licenses and the local Fraunces and JetBrains Mono NL fonts.

## Content

`content/` is generated from the owner's Obsidian vault by `scripts/sync_published.py` in the parent repo (`~/Git/blog_host_trial`); don't edit it here. It copies what Obsidian Publish serves at neutronuniverse.com, plus new posts:
- `Published/Home.md` becomes the home page.
- Notes at the top of `Published/` named `MM-DD-YY Title.md` are copied; that's where a finished draft is moved.
- Everything under `Published/Projects/` is copied with its attachments. Images for a new post go in `Published/Projects/attachments/`.
- `books.md` is rendered text-only from the vault `Books/` notes (no publisher covers).
- A note with `publish: false` is skipped.

Notes named `MM-DD-YY Title` are posts: the sync gives them `title` and `published` frontmatter unless they set them. Posts appear in the home page list and the RSS feed, with their full text, and get a comment box. Every other page is `unlisted`, so it stays out of the feed but can still be reached by link.

## Build and deploy

Requires Node 22+ and npm. From the parent repo:

```sh
scripts/deploy_cloudflare.sh   # sync from the vault, build for blog.neutronuniverse.com, upload to Cloudflare Pages
```

Or by hand, from this directory:

```sh
npm ci
npx quartz plugin install
BASE_URL='https://blog.neutronuniverse.com/' npx quartz build -o /absolute/output/directory
```

`BASE_URL` takes a full URL or a host plus path, and defaults to `blog.neutronuniverse.com`. For a path-mounted preview, use `BASE_URL='http://preview.example:8080/quartz/'` and serve the output at `/quartz/`. Quartz writes canonical and RSS links as HTTPS, even for an HTTP preview.

## Solar House presentation

There is one centered reading column. Prose and controls use George Hotz's blog font stack at 16px/1.5. Fraunces at softness 50 is used only for titles and headings, and JetBrains Mono NL only for dates, code and tables. Every color is an NTRN token.

Following the NTRN Avoid list:
- Callouts and media are rounded surface-step panels; code and tables are square and borderless.
- Emphasis is upright, in the brighter ink color.
- Scrollbars use token colors.

The header holds only the site title, books, rss and the theme control. The home page shows the posts newest first. The tab icon and the link-preview image come from the owner's ghost image (`scripts/make_icon.py` in the parent repo).

`quartz/static/ntrn-daylight.js` loads in the page head without deferral. Its default, "follow sun", switches between day and night by the sun's actual position at Los Angeles; readers can also pick day or night by hand. It rebinds after SPA navigation and fires Quartz's light/dark `themechange` event.

## Comments

The official Quartz comments plugin connects Giscus to this repository's Announcements category, mapped by page path. It is shown on posts only. Its theme URL is built from the base URL as `https://<host><base>/static/giscus/solar-{day,night}.css`. Those files are generated from the Solar tokens by `scripts/make_giscus_themes.py` in the parent repo, and the plugin retunes the frame on `themechange`.

## Local changes

- `quartz.config.yaml` owns the enabled plugins. `published` is the date type, `unlisted-pages` is on, the folder page is off, RSS carries full text, and comments show only on posts.
- `quartz.ts` applies the `BASE_URL` override, registers the `post` condition and uses Quartz's full-width frame for a single column.
- `quartz/components/Site.tsx` holds the header, the date line and the home post list.
- `quartz/components/Head.tsx` loads the Solar token stylesheet and the daylight script.
- `quartz/styles/custom.scss` implements the type split and the Avoid-list overrides without changing NTRN variables or vendored files.

The alias-redirects 1.0.0 plugin overwrites a page when one of its aliases normalizes to the page's own slug. `fix-alias-redirects.mjs`, run by npm postinstall, adds a minimal guard against that self-redirect.
