import { CraftBlock } from "@craftdocs/craft-extension-api"
import { DocumentDataServiceInstance } from "./services/document_data"
import { EnvironmentServiceInstance } from "./services/environment"

class CraftDevTools {
  public darkMode(): void {
    EnvironmentServiceInstance.setEnv({ colorScheme: "dark" })
  }

  public lightMode(): void {
    EnvironmentServiceInstance.setEnv({ colorScheme: "light" })
  }

  public printPage(): void {
    const page = DocumentDataServiceInstance.getCurrentPage()

    console.log(simplifyBlock(page))
  }
}

function simplifyBlock(block: CraftBlock) {
  const item: { [_: string]: any } = {
    type: block.type
  }

  if (block.type === "textBlock") {
    item.content = block.content.map(x => x.text).join()
    if (block.subblocks.length > 0) {
      item.subblocks = block.subblocks.map(simplifyBlock)
    }
  }

  return item
}

export function createCraftDevTools() {
  return new CraftDevTools()
}
