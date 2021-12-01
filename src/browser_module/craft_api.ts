import {
  BlockFactory, 
  CraftAPI, 
  CraftDataApi, 
  CraftEditorApi, 
  CraftHttpProxy, 
  CraftStorageApi, 
  EnvironmentApi, 
  ExperimentalApi, 
  LocationFactory, 
  MarkdownApi
} from "@craftdocs/craft-extension-api"
  
import { BlockFactoryMock } from "./apis/block_factory"
import { CraftDataApiMock } from "./apis/data_api"
import { CraftEditorApiMock } from "./apis/editor_api"
import { EnvironmentApiMock } from "./apis/environment_api"
import { ExperimentApiMock } from "./apis/experimental_api"
import { CraftHttpProxyMock } from "./apis/http_proxy"
import { LocationFactoryMock } from "./apis/location_factory"
import { MarkdownApiMock } from "./apis/markdown_api"
import { CraftStorageApiMock } from "./apis/storage_api"
import { CraftApiNotSupportedError } from "./errors"

function wrap<T extends { [_: string | symbol]: any }>(obj: T): T {
  return new Proxy(obj, {
    get: (target: T, p: string | symbol, receiver: any): any => {
      if (p in obj) {
        const result: any = target[p]
        return result
      }

      throw new CraftApiNotSupportedError()
    }
  })
}

class CraftExtensionApi implements CraftAPI {
  blockFactory: BlockFactory = wrap(new BlockFactoryMock())
  storageApi: CraftStorageApi = wrap(new CraftStorageApiMock())
  dataApi: CraftDataApi = wrap(new CraftDataApiMock())
  editorApi: CraftEditorApi  = wrap(new CraftEditorApiMock())
  markdown: MarkdownApi  = wrap(new MarkdownApiMock())
  location: LocationFactory = wrap(new LocationFactoryMock())
  env: EnvironmentApi = wrap(new EnvironmentApiMock())
  experimental: ExperimentalApi = wrap(new ExperimentApiMock())
  httpProxy: CraftHttpProxy = wrap(new CraftHttpProxyMock())
}

export function createCraftExtensionApi(): CraftAPI {
  return wrap(new CraftExtensionApi())
}
