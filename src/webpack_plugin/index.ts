import { readFileSync } from "fs"
import { Compiler } from "webpack"
import InjectPlugin from "webpack-inject-plugin"
 
function customLoader(options: CraftExtensionApiPluginOptions) {
  const jsFile = readFileSync(__dirname + "/../browser_module/index.js")

  return () => {
    return jsFile.toString("utf-8")
  }
}
 
export class CraftExtensionApiPlugin {
  constructor(private options: CraftExtensionApiPluginOptions = {}) {
  }
 
  apply(compiler: Compiler) {
    if (compiler.options.mode === "development") {
      new InjectPlugin(customLoader(this.options)).apply(compiler)
    }
  }
}

export class CraftExtensionApiPluginOptions {
}
