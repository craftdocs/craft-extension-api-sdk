import { ApiResponse, CraftHttpHeaders, CraftHttpProxy, CraftHttpRequest, CraftHttpRequestBody, CraftHttpResponse } from "@craftdocs/craft-extension-api"
import { Writeable } from "../tools/types"

export class CraftHttpProxyMock implements CraftHttpProxy {
  public async fetch(request: CraftHttpRequest): Promise<ApiResponse<CraftHttpResponse>> {
    const response = await fetch(request.url, {
      method: request.method ?? "GET",
      headers: request.headers,
      body: convertRequestBody(request.body),
      credentials: "omit"
    })

    return {
      status: "success",
      data: {
        status: response.status,
        headers: convertResponseHeaders(response.headers),
        body: response
      }
    }
  }  
}

function convertResponseHeaders(headers: Headers): CraftHttpHeaders {
  const result: Writeable<CraftHttpHeaders> = {}

  headers.forEach((value, key) => {
    result[key] = value
  })

  return result
}

function convertRequestBody(body?: CraftHttpRequestBody): Buffer | undefined {
  if (body == undefined) {
    return undefined
  }

  if (body.type === "text") {
    return Buffer.from(body.text, "utf-8")
  }

  throw new Error("Not supported")
}
