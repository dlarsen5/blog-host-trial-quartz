import { QuartzComponent } from "./types"
import { joinSegments, pathToRoot } from "../util/path"

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

export const DateLine: QuartzComponent = ({ fileData }) => {
  const date = fileData.frontmatter?.date
  if (!date) return null
  const iso = new Date(String(date)).toISOString().slice(0, 10)
  return <time class="date-line" dateTime={iso}>{iso}</time>
}
