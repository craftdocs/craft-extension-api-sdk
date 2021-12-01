import { AfterBlockLocation, IndexLocation, LocationFactory } from "@craftdocs/craft-extension-api"

export class LocationFactoryMock implements LocationFactory {
  public indexLocation(pageId: string, index: number): IndexLocation {
    return { type: "indexLocation", pageId, index }
  }

  public afterBlockLocation(pageId: string, blockId?: string): AfterBlockLocation {
    return { type: "afterBlockLocation", pageId, blockId }
  }
}
