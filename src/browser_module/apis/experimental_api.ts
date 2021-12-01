import { CraftBlock, ExperimentalApi } from "@craftdocs/craft-extension-api"
import { CraftApiNotSupportedError } from "../errors"

export class ExperimentApiMock implements ExperimentalApi {
  public renderSmallBlockPreview(previewId: string, blocks: CraftBlock[], isDarkMode: boolean): string {
    throw new CraftApiNotSupportedError()
  }  
}
