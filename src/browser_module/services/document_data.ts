import { BlockLocation, CraftBlock, CraftBlockInsert, CraftBlockUpdate, CraftTextBlock, IndexLocation } from "@craftdocs/craft-extension-api"
import { createBlock, createDefaultBlock, createFromBlockUpdate } from "../tools/block_tools"
import { deepCopy } from "../tools/objects"
import { createRandomId } from "../tools/random"

export class DocumentDataService {
  private blocks: Map<string, CraftBlock> = new Map()
  private subblocks: Map<string, string[]> = new Map()
  private rootId: string

  constructor() {
    this.rootId = createRandomId()
    
    this.createInitialData()
  }

  private createInitialData() {
    const id1 = createRandomId()
    const id2 = createRandomId()

    this.blocks.set(this.rootId, {
      ...createDefaultBlock(),
      id: this.rootId,
      content: [ { text: "Craft X developer tools" } ]
    })

    this.blocks.set(id1, {
      ...createDefaultBlock(),
      id: id1,
      content: [ { text: "These tools facilitate extension development by creating a mock Craft API." } ]
    })

    this.blocks.set(id2, {
      ...createDefaultBlock(),
      id: id2,
      content: [ { text: "By reducing the feedback cycle developers can iterate with great velocity." } ]
    })

    this.subblocks.set(this.rootId, [ id1, id2 ])
  }

  public setRootId(id: string): boolean {
    const block = this.blocks.get(id)

    if (block === undefined || block.type !== "textBlock") {
      return false
    }

    this.rootId = id
    return true
  }

  public getCurrentPage(): CraftTextBlock {
    const block = this.blocks.get(this.rootId)

    if (block === undefined || block.type !== "textBlock") {
      throw new Error("Invalid state, root block must be a textBlock")
    }

    const rootBlock = deepCopy(block)
    this.populateSubBlocks(rootBlock, new Set([ this.rootId ]))

    return rootBlock
  }

  public deleteBlocks(blockIds: string[]): string[] {
    const result: string[] = []

    // TODO: recursive cleanup

    blockIds.forEach(blockId => {
      const block = this.blocks.get(blockId)

      if (block) {
        this.blocks.delete(blockId)
        result.push(block.id)
      }
    })

    this.cleanup()

    return result
  }

  public addBlocks(blocks: CraftBlockInsert[], location?: BlockLocation): CraftBlock[] {
    const blocksToAdd = blocks.map(createBlock).map(deepCopy)

    blocksToAdd.forEach(x => {
      this.blocks.set(x.id, x)
    })

    const blockIds = blocksToAdd.map(x => x.id)
    this.moveBlocksTo(blockIds, location)

    return blocksToAdd.map(deepCopy)
  }

  public moveBlocks(blockIds: string[], location: BlockLocation): CraftBlock[] {
    const blocks = blockIds.map(x => this.blocks.get(x)).filter(notUndefined)
    const finalBlockIds = blocks.map(x => x.id)

    this.moveBlocksTo(finalBlockIds, location)

    return blocks.map(deepCopy)
  }

  public updateBlocks(blocks: CraftBlockUpdate[]): CraftBlock[] {
    const newBlocks: CraftBlock[] = []

    blocks.forEach(block => {
      if (!this.blocks.has(block.id)) {
        return
      }

      const finalBlock: CraftBlock = deepCopy(createFromBlockUpdate(block))
      this.blocks.set(block.id, finalBlock)
      newBlocks.push(finalBlock)
    })

    return newBlocks.map(deepCopy)
  }

  private populateSubBlocks(block: CraftBlock, seenBlocks: Set<string>) {
    if (block.type !== "textBlock") {
      return
    }

    const subblockIds = this.subblocks.get(block.id) ?? []

    subblockIds.forEach(subblockId => {
      if (seenBlocks.has(subblockId)) {
        console.warn("Cycling reference detected")
        return
      }

      const subblock = this.blocks.get(subblockId)

      if (subblock) {
        const subblockClone = deepCopy(subblock)
        this.populateSubBlocks(subblockClone, seenBlocks)
        block.subblocks.push(subblockClone)
      }
    })
  }

  private cleanup() {
    for (const [ pageId, subblocks ] of Array.from(this.subblocks)) {
      if (!this.blocks.has(pageId)) {
        this.subblocks.delete(pageId)
      }

      let i = 0
      while (i < subblocks.length) {
        if (this.blocks.has(subblocks[i])) {
          i++
        } else {
          subblocks.splice(i, 1)
        }
      }
    }
  }

  private moveBlocksTo(blockIds: string[], location?: BlockLocation) {
    const finalLoc = this.resolveLocation(location)
    
    this.moveBlocksToPage(blockIds, finalLoc.pageId, finalLoc.index)
  }

  private moveBlocksToPage(blockIds: string[], pageId: string, index: number) {
    const proposedPage = this.blocks.get(pageId)

    if (proposedPage === undefined) {
      throw new Error("Target block not found")
    }

    if (proposedPage.type !== "textBlock") {
      throw new Error("Target block is not text block")
    }

    for (const [ pageId, _ ] of Array.from(this.subblocks)) {
      for (const blockId of blockIds) {
        this.removeBlockFromPage(blockId, pageId)
      }
    }
    
    let subblocks = this.subblocks.get(pageId)

    if (!subblocks) {
      subblocks = []
      this.subblocks.set(pageId, subblocks)
    }

    arrayInsert(subblocks, index, blockIds)
  }

  private removeBlockFromPage(blockId: string, pageId: string) {
    const subblocks = this.subblocks.get(pageId)

    if (subblocks && subblocks.includes(blockId)) {
      subblocks.splice(subblocks.indexOf(blockId))
    }
  }

  private getPageSize(blockId: string): number {
    const subblocks = this.subblocks.get(blockId) ?? []
    return subblocks.length
  }

  private resolveLocation(location?: BlockLocation): IndexLocation {
    if (location === undefined) {
      return { 
        type: "indexLocation",
        pageId: this.rootId,
        index: this.getPageSize(this.rootId)
      }
    }

    if (location.type === "indexLocation") {
      return location
    }

    if (location.type === "afterBlockLocation") {
      let index = this.getPageSize(location.pageId)

      if (location.blockId != undefined) {
        const subblocks = this.subblocks.get(location.pageId) ?? []
        const pos = subblocks.indexOf(location.blockId)

        index = pos > -1 ? pos + 1 : index
      }

      return {
        type: "indexLocation",
        pageId: location.pageId,
        index
      }
    }

    return {
      type: "indexLocation",
      pageId: this.rootId,
      index: this.getPageSize(this.rootId)
    }
  }
}

function arrayInsert<T>(arr: T[], index: number, items: T[]) {
  arr.splice(index, 0, ...items)
}

function notUndefined<T>(item: T): item is Exclude<T, undefined> {
  return item !== undefined
}

export const DocumentDataServiceInstance = new DocumentDataService()
