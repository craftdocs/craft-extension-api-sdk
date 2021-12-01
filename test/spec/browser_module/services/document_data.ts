import { DocumentDataService } from "../../../../src/browser_module/services/document_data"
import assert = require("assert")
import { createRandomId } from "../../../../src/browser_module/tools/random"
import { CraftBlock } from "@craftdocs/craft-extension-api"

describe("DocumentDataService", () => {
  let service: DocumentDataService
    
  beforeEach(() => {
    service = new DocumentDataService()
  })
    
  describe("getCurrentPage", () => {
    it("when called, then default data is returned", () => {
      // When
      const page = service.getCurrentPage()

      // Then
      assert(page.content.length === 1)
      assert(page.content[0].text.startsWith("Craft X"))
      assert(page.subblocks.length === 2)
    })
  })

  describe("addBlocks", () => {
    it("when no location specified, then added to the end of root page", () => {
      // When
      const result = service.addBlocks([ { type: "textBlock", content: "New block" } ])

      // Then
      assert(result.length === 1)

      const page = service.getCurrentPage()
      assert(page.subblocks.length === 3)

      const newBlock = page.subblocks[2]

      assert(newBlock.type === "textBlock")
      assert(newBlock.content.length === 1)
      assert(newBlock.content[0].text === "New block")
      assert(newBlock.id === result[0].id)
      assert(newBlock !== result[0])
    })

    it("when afterBlockLocation is set, then added after the specified block", () => {
      // Given
      const initialPage = service.getCurrentPage()

      // When
      const result = service.addBlocks(
        [ { type: "textBlock", content: "New block" } ], 
        { type: "afterBlockLocation", pageId: initialPage.id, blockId: initialPage.subblocks[0].id }
      )

      // Then
      const page = service.getCurrentPage()

      // Block should be at the 2nd place
      assert.deepStrictEqual(
        ids(page.subblocks),
        ids([
          initialPage.subblocks[0],
          result[0],
          initialPage.subblocks[1]
        ]))
    })

    it("when indexLocation is set, then added to the specified position", () => {
      // Given
      const initialPage = service.getCurrentPage()

      // When
      const result = service.addBlocks(
        [ { type: "textBlock", content: "New block" } ], 
        { type: "indexLocation", pageId: initialPage.id, index: 0 }
      )

      // Then
      const page = service.getCurrentPage()

      // Block should be at the 1st place
      assert.deepStrictEqual(
        ids(page.subblocks),
        ids([
          result[0], 
          ...initialPage.subblocks
        ]))
    })
  })

  describe("moveBlock", () => {
    it("when blocks are moved to the beginning of page, then sub blocks are reordered", () => {
      // Given
      const newBlocks = service.addBlocks([ 
        { type: "textBlock", content: "New block 1" },
        { type: "textBlock", content: "New block 2" }
      ])

      const initialPage = service.getCurrentPage()

      // Given
      const movedBlocks = service.moveBlocks(
        [ newBlocks[0].id, newBlocks[1].id ], 
        { type: "indexLocation", pageId: initialPage.id, index: 0  }
      )

      // Then
      assert.deepStrictEqual(ids(newBlocks), ids(movedBlocks))

      const page = service.getCurrentPage()

      assert.deepStrictEqual(
        ids(page.subblocks), 
        ids([
          newBlocks[0],
          newBlocks[1],
          initialPage.subblocks[0],
          initialPage.subblocks[1]
        ])
      )
    })

    it("when blocks are moved after a block, then sub blocks are reordered", () => {
      // Given
      const newBlocks = service.addBlocks([ 
        { type: "textBlock", content: "New block 1" },
        { type: "textBlock", content: "New block 2" }
      ])

      const initialPage = service.getCurrentPage()

      // Given
      const movedBlocks = service.moveBlocks(
        [ newBlocks[0].id, newBlocks[1].id ], 
        { type: "afterBlockLocation", pageId: initialPage.id, blockId: initialPage.subblocks[0].id  }
      )

      // Then
      assert.deepStrictEqual(newBlocks, movedBlocks)

      const page = service.getCurrentPage()

      assert.deepStrictEqual(
        ids(page.subblocks),
        ids([
          initialPage.subblocks[0],
          newBlocks[0],
          newBlocks[1],
          initialPage.subblocks[1]
        ])
      )
    })

    it("when blocks are moved to a different page, then they are removed from previous page and added to new one", () => {
      // Given
      const newBlocks = service.addBlocks([ 
        { type: "textBlock", content: "New block 1" },
        { type: "textBlock", content: "New block 2" }
      ])

      const initialPage = service.getCurrentPage()
      const otherPageId = initialPage.subblocks[0].id

      // Given
      const movedBlocks = service.moveBlocks(
        [ newBlocks[0].id, newBlocks[1].id ], 
        { type: "indexLocation", pageId: otherPageId, index: 0  }
      )

      // Then
      assert.deepStrictEqual(newBlocks, movedBlocks)

      const page = service.getCurrentPage()

      assert.deepStrictEqual(
        ids(page.subblocks), 
        ids([
          initialPage.subblocks[0],
          initialPage.subblocks[1]
        ])
      )

      const otherPage = page.subblocks[0]

      assert(otherPage.type === "textBlock")
      assert.deepStrictEqual(otherPage.subblocks, newBlocks)
    })
  })

  describe("deleteBlocks", () => {
    it("when blocks are deleted, then sub blocks are gone", () => {
      // Given
      const initialPage = service.getCurrentPage()

      // When
      const blocksToDelete = [ initialPage.subblocks[0].id, initialPage.subblocks[1].id ]

      const deletedIds = service.deleteBlocks(blocksToDelete)

      // Then
      assert.deepStrictEqual(blocksToDelete, deletedIds)

      const page = service.getCurrentPage()
      assert(page.subblocks.length === 0)
    })

    it("when non existing block ids speciefied, then does nothing returns empty array", () => {
      // When
      const deletedIds = service.deleteBlocks([ createRandomId(), createRandomId() ])

      // Then
      const page = service.getCurrentPage()

      assert(page.subblocks.length === 2)
      assert(deletedIds.length === 0)
    })
  })

  describe("updateBlocks", () => {
    it("when blocks are updated, then next currentPage call returns updated data", () => {
      // Given
      const intialPage = service.getCurrentPage()

      // When
      intialPage.content[0].text = "Updated title"
      intialPage.subblocks[0].color = "blue"

      service.updateBlocks([ intialPage, intialPage.subblocks[0] ])

      // Then
      const page = service.getCurrentPage()

      assert(page.content[0].text === "Updated title")
      assert(page.subblocks[0].color === "blue")
    })

    it("when blocks are updated, then the result contains the updated data", () => {
      // Given
      const intialPage = service.getCurrentPage()

      // When
      intialPage.content[0].text = "Updated title"
      const result = service.updateBlocks([ intialPage ])

      // Then
      assert(result[0].id === intialPage.id)
      assert(result[0].type === "textBlock")
      assert(result[0].content[0].text === "Updated title")
    })
  })

  describe("setRootId", () => {
    it("when root is changed, then currentPage result is changed", () => {
      // Given
      const intialPage = service.getCurrentPage()
      const otherPageId = intialPage.subblocks[0].id
  
      const newBlocks = service.addBlocks(
        [ 
          { type: "textBlock", content: "New block 1" },
          { type: "textBlock", content: "New block 2" }
        ], 
        { type: "indexLocation", pageId: otherPageId, index: 0 }
      )

      // When
      service.setRootId(otherPageId)

      // Then
      const page = service.getCurrentPage()

      assert(page.id === otherPageId)
      assert.deepStrictEqual(page.subblocks, newBlocks)
    })
  })
})

function ids(arr: CraftBlock[]): string[] {
  return arr.map(x => x.id)
}
