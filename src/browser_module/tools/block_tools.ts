import {
  CraftBlock,
  CraftBlockInsert,
  CraftBlockUpdate,
  CraftTableColumn,
  CraftTableRow,
  CraftTableRowInsert,
  CraftTextBlock,
  CraftTextBlockInsert
} from "@craftdocs/craft-extension-api"
import { deepCopy } from "./objects"
import { createRandomId } from "./random"

const DocumentId = createRandomId()
const SpaceId = createRandomId()

export function createDefaultBlock(): CraftTextBlock {
  return createTextBlock({
    type: "textBlock",
    content: "Hello world!"
  })
}

function createCommonProperties(input: CraftBlockInsert) {
  return {
    id: createRandomId(),
    spaceId: SpaceId,
    documentId: DocumentId,
    indentationLevel: input.indentationLevel ?? 0,
    listStyle: {
      type: "none" as const,
      ...input.listStyle
    },
    hasBlockDecoration: input.hasBlockDecoration ?? false,
    hasFocusDecoration: input.hasFocusDecoration ?? false,
    color: input.color ?? "text" as const
  }
}

export function createTextBlock(input: CraftTextBlockInsert): CraftTextBlock {
  return deepCopy({
    ...input,
    ...createCommonProperties(input),
    type: "textBlock",
    content: Array.isArray(input.content) ? input.content : [ { text: input.content } ],
    subblocks: [],
    style: {
      textStyle: "body",
      fontStyle: "system",
      alignmentStyle: "left",
      ...input.style
    }
  })
}

export function createBlock(input: CraftBlockInsert): CraftBlock {
  if (input.type === "textBlock") {
    return createTextBlock(input)
  }

  if (input.type === "codeBlock") {
    return deepCopy({
      ...input,
      ...createCommonProperties(input),
      type: input.type,
      code: input.code ?? "",
      language: input.language ?? "other"
    })
  }

  if (input.type === "horizontalLineBlock") {
    return deepCopy({
      ...input,
      ...createCommonProperties(input),
      lineStyle: input.lineStyle ?? "regular",
      type: input.type
    })
  }

  if (input.type === "urlBlock" || input.type === "fileBlock") {
    return deepCopy({
      ...input,
      ...createCommonProperties(input),
      layoutStyle: input.layoutStyle ?? "card"
    })
  }

  if (input.type === "imageBlock" || input.type === "videoBlock") {
    return deepCopy({
      ...input,
      ...createCommonProperties(input),
      previewImageStyle: input.previewImageStyle ?? { fillStyle: "auto", sizeStyle: "auto" }
    })
  }

  if (input.type === "tableBlock") {
    return deepCopy({
      ...input,
      ...createCommonProperties(input),
      rows: input.rows.map(convertRow)
    })
  }

  return deepCopy({
    ...input,
    ...createCommonProperties(input)
  })
}

function convertRow(row: CraftTableRowInsert): CraftTableRow {
  return {
    cells: row.cells.map(cell => ({
      id: createRandomId(),
      ...cell,
      block: cell.block ? createBlock(cell.block) : undefined
    }))
  }
}

export function createFromBlockUpdate(block: CraftBlockUpdate): CraftBlock {
  if (block.type === "textBlock") {
    const data: any = {
      ...block,
      subblocks: []
    }

    return data
  }
  
  return block as any
}
