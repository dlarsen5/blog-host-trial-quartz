# Neutron Universe (TEST) — Quartz 5

This TEST site uses Quartz 5.0.0, upstream v5 commit `97a2d05f80c4c50534959b1d0d41cc4b3895625e`. The two canonical trial notes are copied verbatim from the parent vault; the media are generated Solar House-colored trial assets. NTRN Solar House v4.0.0 is vendored under `quartz/static/ntrn/` with its licenses, local Fraunces and JetBrains Mono NL fonts, and Solar House sun-tile favicon.

## Build

Requires Node 22+ and npm. From this directory:

```sh
npm ci
npx quartz plugin install
BASE_URL='https://blog.neutronuniverse.com/' npx quartz build -o /absolute/output/directory
```

`BASE_URL` accepts a full URL or a host plus path. Its default is `dlarsen5.github.io/blog-host-trial-quartz`. For a path-mounted preview use `BASE_URL='http://preview.example:8080/quartz/'`; serve the output directory at `/quartz/`. Quartz uses relative assets and a scheme-free baseUrl, so its generated canonical/RSS URLs use HTTPS even for an HTTP LAN preview. The GitHub Pages workflow needs no override; Cloudflare can supply the root-domain override above.

## Publish from Obsidian

1. Edit only the approved notes and trial media in the parent trial's `vault/`.
2. Run `scripts/sync_content.sh quartz` from the parent trial root. It copies Markdown and attachments verbatim; there is no converter.
3. In this directory run `npx quartz build` for an optional local preview.
4. `git add content && git commit -m 'Update trial notes' && git push origin main`.
5. The Pages workflow installs dependencies/plugins, builds, uploads `public/`, and deploys.

## Solar House presentation

The single centered reading column uses the owner's chosen George Hotz blog font stack at 16px/1.5 for prose and controls. Fraunces at softness 50 is reserved for display titles/headings; JetBrains Mono NL is reserved for dates, code, and tables. All colors map onto vendored NTRN tokens. Rounded surface-step callouts/media, square borderless code/tables, normal-style emphasis, and token-colored scrollbars follow the selected Solar/Avoid rules.

The header contains only the linked site title, books, rss, and the theme control. Sidebars, search, tag chips/pages, breadcrumbs, backlinks, description text, and the Quartz footer are not configured. RSS includes home and the two notes, not virtual tag pages.

`quartz/static/ntrn-daylight.js` is loaded in the head without deferral. The default “follow sun” choice uses the actual solar position at Los Angeles, switching between day and night, with manual overrides. It rebinds after SPA navigation and emits Quartz's light/dark `themechange` event. The old five-theme Tech switcher is removed.

## Comments

The official Quartz comments plugin wires Giscus to the repository's Announcements category with pathname mapping. Its default theme URL is constructed from the effective baseUrl as `https://<host><base>/static/giscus`; light/dark names are `solar-day` and `solar-night`. The plugin appends `.css` and retunes the iframe on `themechange`, so comments use the supplied generated stylesheets on both GitHub Pages and the root-domain build. Giscus App authorization remains an owner/browser action.

## Local changes

`quartz.config.yaml` owns the enabled plugins and article title. `quartz.ts` applies the environment URL override and uses Quartz's full-width frame for a single column, with the small site-header/date components. `quartz/components/Head.tsx` loads the Solar token stylesheet and daylight script. `quartz/styles/custom.scss` implements the reading/display split and Avoid-list overrides without changing NTRN variables or vendored files.

Quartz 5's `note-properties` transformer parses frontmatter with its properties display hidden. The alias-redirects 1.0.0 plugin would otherwise overwrite the TEST article when its alias normalizes to its canonical slug; `fix-alias-redirects.mjs`, run by npm postinstall, adds the minimal self-redirect guard for full and incremental emission without changing notes.
