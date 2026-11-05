import { QuartzComponent } from "./types"
import { QuartzPluginData } from "../plugins/vfile"
import { joinSegments, pathToRoot, resolveRelative } from "../util/path"

const iso = (d: Date) => d.toISOString().slice(0, 10)

// A post is a page that is not `unlisted: true` (the unlisted-pages plugin copies that frontmatter
// flag onto the file data). The parent repo's scripts/sync_published.py gives posts a `published`
// date and unlists everything else; the date plugin falls back to a date for every page, so the
// flag is what separates them. allFiles may hold virtual pages without dates: require one.
export const isPost = (f: QuartzPluginData) =>
  !("unlisted" in f && f.unlisted === true) && f.dates?.published !== undefined

export const SiteHeader: QuartzComponent = ({ cfg, fileData }) => {
  const root = pathToRoot(fileData.slug!)
  return <div class="site-header">
    <a class="site-title" href={`${root}/`}>{cfg.pageTitle}</a>
    <nav aria-label="site">
      <a href={joinSegments(root, "books")}>books</a>
      <a href={joinSegments(root, "index.xml")}>rss</a>
      <label class="ntrn-theme">theme <select data-ntrn-theme aria-label="theme"></select></label>
    </nav>
  </div>
}

// The published date of a post, under its title. Other pages (home, books) show nothing.
export const DateLine: QuartzComponent = ({ fileData }) => {
  if (!isPost(fileData)) return null
  const date = fileData.dates!.published!
  return <time class="date-line" dateTime={iso(date)}>{iso(date)}</time>
}

// Home page only: every post, newest first.
export const PostList: QuartzComponent = ({ fileData, allFiles }) => {
  if (fileData.slug !== "index") return null
  const posts = allFiles
    .filter(isPost)
    .map((f) => ({ f, date: f.dates!.published! }))
    .sort((a, b) => b.date.getTime() - a.date.getTime())
  return <ul class="post-list">
    {posts.map(({ f, date }) => <li>
      <time dateTime={iso(date)}>{iso(date)}</time>
      <a href={resolveRelative(fileData.slug!, f.slug!)}>{f.frontmatter?.title}</a>
    </li>)}
  </ul>
}
