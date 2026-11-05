import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { SiteHeader, DateLine } from "./quartz/components/Trial"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"

const config = await loadQuartzConfig()
// Quartz expects a scheme-free baseUrl. Accept ordinary preview/deployment URLs too.
config.configuration.baseUrl = (process.env.BASE_URL ?? "dlarsen5.github.io/blog-host-trial-quartz")
  .replace(/^https?:\/\//, "").replace(/\/$/, "")
export default config
export const layout = await loadQuartzLayout()
layout.defaults.header = [SiteHeader]
layout.defaults.beforeBody = [...(layout.defaults.beforeBody ?? []), DateLine]
for (const pageType of ["content", "folder"]) {
  layout.byPageType[pageType] = { ...layout.byPageType[pageType], frame: "full-width" }
}
const dispatcher = config.plugins.emitters.findIndex((emitter) => emitter.name === "PageTypeDispatcher")
if (dispatcher < 0) throw new Error("Quartz page dispatcher not found")
config.plugins.emitters[dispatcher] = PageTypeDispatcher(layout)
