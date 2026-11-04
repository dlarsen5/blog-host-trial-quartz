import { QuartzComponent } from "./types"

export const ThemeSwitcher: QuartzComponent = () => (
  <label class="ntrn-theme">theme <select data-ntrn-theme aria-label="theme"></select></label>
)

export const TrialMetadata: QuartzComponent = ({ fileData }) => {
  const date = fileData.frontmatter?.date
  const iso = date ? new Date(String(date)).toISOString().slice(0, 10) : undefined
  return <div class="trial-meta">
    {iso && <time dateTime={iso}>{iso}</time>}
    {fileData.frontmatter?.description && <p>{String(fileData.frontmatter.description)}</p>}
  </div>
}
