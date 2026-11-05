import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { registerCondition } from "./quartz/plugins/loader/conditions"
import { SiteHeader, DateLine, PostList, isPost } from "./quartz/components/Site"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"

// quartz.config.yaml shows comments only on posts.
registerCondition("post", ({ fileData }) => isPost(fileData))

const config = await loadQuartzConfig()
// Quartz expects a scheme-free baseUrl. Accept ordinary preview/deployment URLs too.
config.configuration.baseUrl = (process.env.BASE_URL ?? "blog.neutronuniverse.com")
  .replace(/^https?:\/\//, "").replace(/\/$/, "")
export default config
export const layout = await loadQuartzLayout()
layout.defaults.header = [SiteHeader]
layout.defaults.beforeBody = [...(layout.defaults.beforeBody ?? []), DateLine]
layout.defaults.afterBody = [PostList, ...(layout.defaults.afterBody ?? [])]
layout.byPageType.content = { ...layout.byPageType.content, frame: "full-width" }
const dispatcher = config.plugins.emitters.findIndex((emitter) => emitter.name === "PageTypeDispatcher")
if (dispatcher < 0) throw new Error("Quartz page dispatcher not found")
config.plugins.emitters[dispatcher] = PageTypeDispatcher(layout)
