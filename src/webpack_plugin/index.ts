import { readFileSync } from "fs"
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
 
  apply(compiler: any) {
    new InjectPlugin(customLoader(this.options)).apply(compiler)
  }
}

export class CraftExtensionApiPluginOptions {
}
