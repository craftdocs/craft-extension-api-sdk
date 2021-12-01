import { ApiResponse, CraftBlock, CraftEditorApi } from "@craftdocs/craft-extension-api"
import { DocumentDataServiceInstance } from "../services/document_data"

export class CraftEditorApiMock implements CraftEditorApi {
  constructor(private documentData = DocumentDataServiceInstance) {
  }

  public async selectBlocks(blockIds: string[]): Promise<ApiResponse<CraftBlock[]>> {
    console.log("editorApi.selectBlocks called - no action performed")

    return {
      status: "success",
      data: []
    }  
  }

  public async getSelection(): Promise<ApiResponse<CraftBlock[]>> {
    console.log("editorApi.getSelection called - empty result returned")

    return {
      status: "success",
      data: []
    }
  }

  public async getTextSelection(): Promise<ApiResponse<string>> {
    console.log("editorApi.getTextSelection called - arbitrary result returned")

    return {
      status: "success",
      data: "Selected text"
    }
  }

  public async navigateToBlockId(blockId: string): Promise<ApiResponse<void>> {
    this.documentData.setRootId(blockId)

    return {
      status: "success",
      data: void 0
    }
  }

  public async openURL(url: string): Promise<ApiResponse<void>> {
    window.open(url)

    return {
      status: "success",
      data: void 0
    }
  }
}
