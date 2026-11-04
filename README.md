# TEST hosting trial — Quartz 5

This public TEST site uses Quartz 5.0.0, upstream v5 commit `97a2d05f80c4c50534959b1d0d41cc4b3895625e`. Only two canonical trial notes, generated media, and a site-owned landing page are published. NTRN Tech v3.2.0 is vendored under `quartz/static/ntrn/` with its licenses and local fonts.

## Build

Requires Node 22+ and npm. From this directory:

```sh
npm ci
npx quartz plugin install
BASE_URL='https://example.org/' npx quartz build -o /absolute/output/directory
```

`BASE_URL` accepts a full URL or a host plus path, without a trailing slash. For a path-mounted preview use `BASE_URL='http://preview.example:8080/quartz/'`; serve the output directory at `/quartz/`. Quartz uses relative assets and scheme-free `baseUrl`; generated RSS/canonical URLs use HTTPS, even for an HTTP LAN preview. The normal Pages build needs no override.

## Publish from Obsidian

1. Edit only the two approved notes and trial media in the parent trial's `vault/`.
2. Run `scripts/sync_content.sh quartz` from the parent trial root. This copies Markdown and attachments verbatim; no converter is used.
3. In this directory run `npx quartz build` for an optional local preview.
4. `git add content && git commit -m 'Update trial notes' && git push origin main`.
5. The Pages workflow runs npm install, plugin install, build, artifact upload, and deployment.

The upstream darkmode component is not enabled. A head-loaded NTRN switcher controls all five themes, rebinds after SPA navigation, synchronizes Quartz's code-highlight mode, and retunes Giscus. Theme colors map directly onto NTRN tokens; no Google Font request is configured.

## Comments

GitHub Discussions and the Announcements category are wired to Giscus with pathname mapping. The repository owner must install/authorize the [Giscus GitHub App](https://github.com/apps/giscus) for this repository before comments can function.

## Local changes

`quartz.config.yaml` owns plugin/layout settings; `quartz.ts` applies the environment URL override and adds the small theme/metadata components. `quartz/components/Head.tsx` loads the vendored token stylesheet and non-deferred switcher. `quartz/styles/custom.scss` adapts Quartz to NTRN. The canonical notes remain unchanged.
