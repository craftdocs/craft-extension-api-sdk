import { ApiResponse, CraftStorageApi } from "@craftdocs/craft-extension-api"

export class CraftStorageApiMock implements CraftStorageApi {
  public async put(key: string, value: string): Promise<ApiResponse<void>> {
    window.sessionStorage.setItem(key, value)

    return { status: "success", data: void 0 }
  }

  public async get(key: string): Promise<ApiResponse<string>> {
    const data = window.sessionStorage.getItem(key)

    if (data == null) {
      return { status: "error", message: "Key missing" }
    }

    return { status: "success", data }
 }

  public async delete(key: string): Promise<ApiResponse<void>> {
    window.sessionStorage.removeItem(key)

    return { status: "success", data: void 0 }
  }
}
