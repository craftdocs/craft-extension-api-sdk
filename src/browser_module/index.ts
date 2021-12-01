import { createCraftExtensionApi } from "./craft_api"
import { createCraftDevTools } from "./craft_dev"

const globalWindow: any = window

globalWindow.craft = createCraftExtensionApi()
globalWindow.craftDev = createCraftDevTools()
