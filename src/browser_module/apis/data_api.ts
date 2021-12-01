import { ApiResponse, ApiResponseError, BlockLocation, CraftBlock, CraftBlockInsert, CraftBlockUpdate, CraftDataApi, CraftTextBlock } from "@craftdocs/craft-extension-api"
import { DocumentDataServiceInstance } from "../services/document_data"

export class CraftDataApiMock implements CraftDataApi {
  constructor(private documentData = DocumentDataServiceInstance) {
  }

  public async addBlocks(blocks: CraftBlockInsert[], location?: BlockLocation): Promise<ApiResponse<CraftBlock[]>> {
    try {
      const addedBlocks = this.documentData.addBlocks(blocks, location)

      return {
        status: "success",
        data: addedBlocks
      }
    } catch (err: unknown) {
      return createResponseError(err)
    }
  }

  public async updateBlocks(blockModels: CraftBlockUpdate[]): Promise<ApiResponse<CraftBlock[]>> {
    try {
      const updatedBlocks = this.documentData.updateBlocks(blockModels)

      return {
        status: "success",
        data: updatedBlocks
      }
    } catch (err: unknown) {
      return createResponseError(err)
    }
  }

  public async moveBlocks(blockIds: string[], location: BlockLocation): Promise<ApiResponse<CraftBlock[]>> {
    try {
      const blocks = this.documentData.moveBlocks(blockIds, location)

      return {
        status: "success",
        data: blocks
      }
    } catch (err: unknown) {
      return createResponseError(err)
    }
  }

  public async deleteBlocks(blockIds: string[]): Promise<ApiResponse<string[]>> {
    try {
      const deletedBlockIds = this.documentData.deleteBlocks(blockIds)

      return {
        status: "success",
        data: deletedBlockIds
      }
    } catch (err: unknown) {
      return createResponseError(err)
    }
  }

  public async getCurrentPage(): Promise<ApiResponse<CraftTextBlock>> {
    try {
      const page = this.documentData.getCurrentPage()

      return {
        status: "success",
        data: page
      }
    } catch (err: unknown) {
      return createResponseError(err)
    }
  }
}

function createResponseError<T>(err: unknown): ApiResponseError<T> {
  const message = 
    err instanceof Error ? err.message : 
    typeof err === "string" ? err : "Failure"

  return {
    status: "error",
    message
  }
}
