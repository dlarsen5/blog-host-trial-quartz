// @quartz-community/alias-redirects 1.0.0 emits self-aliases over canonical pages.
// Keep the upstream emitter (including partial builds), but skip self-redirects.
import { readFileSync, writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
const file = fileURLToPath(import.meta.resolve("@quartz-community/alias-redirects"))
const source = readFileSync(file, "utf8")
const before = "    emittedPaths.add(aliasTargetSlug);"
const after = "    if (simplifySlug(aliasTargetSlug) === ogSlug) continue;\n" + before
if (!source.includes(after)) {
  if (!source.includes(before)) throw new Error("Alias redirect patch needs review for this plugin version")
  writeFileSync(file, source.replace(before, after))
}
