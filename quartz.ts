import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { ThemeSwitcher, TrialMetadata } from "./quartz/components/Trial"

const config = await loadQuartzConfig()
// Quartz expects a scheme-free baseUrl. Accept ordinary preview/deployment URLs too.
config.configuration.baseUrl = (process.env.BASE_URL ?? "dlarsen5.github.io/blog-host-trial-quartz")
  .replace(/^https?:\/\//, "").replace(/\/$/, "")
export default config
export const layout = await loadQuartzLayout()
layout.defaults.header = [ThemeSwitcher]
layout.defaults.beforeBody = [...(layout.defaults.beforeBody ?? []), TrialMetadata]
