import {
  BlockFactory,
  CraftCodeBlockConfig,
  CraftCodeBlockInsert,
  CraftDrawingBlockConfig,
  CraftDrawingBlockInsert,
  CraftFileBlockConfig,
  CraftFileBlockInsert,
  CraftHorizontalLineBlockConfig,
  CraftHorizontalLineBlockInsert,
  CraftImageBlockConfig,
  CraftImageBlockInsert,
  CraftTableBlockConfig,
  CraftTableBlockInsert,
  CraftTextBlockConfig,
  CraftTextBlockInsert,
  CraftUrlBlockConfig,
  CraftUrlBlockInsert,
  CraftVideoBlockConfig,
  CraftVideoBlockInsert,
  ListStyle,
  ListStyleType } 
from "@craftdocs/craft-extension-api"

export class BlockFactoryMock implements BlockFactory {
  public textBlock(block: CraftTextBlockConfig): CraftTextBlockInsert {
    return {
      type: "textBlock",
      ...block
    }
  }

  public codeBlock(block: CraftCodeBlockConfig): CraftCodeBlockInsert {
    return create("codeBlock", block)
  }

  public horizontalLineBlock(block: CraftHorizontalLineBlockConfig): CraftHorizontalLineBlockInsert {
    return create("horizontalLineBlock", block)
  }

  public defaultListStyle(type: ListStyleType): ListStyle {
    if (type === "todo") {
      return {
        type: "todo",
        state: "unchecked"
      }
    }
    return { type }
  }

  public urlBlock(block: CraftUrlBlockConfig): CraftUrlBlockInsert {
    return create("urlBlock", block)
  }

  public tableBlock(block: CraftTableBlockConfig): CraftTableBlockInsert {
    return create("tableBlock", block)
  }

  public imageBlock(block: CraftImageBlockConfig): CraftImageBlockInsert {
    return create("imageBlock", block)
  }

  public videoBlock(block: CraftVideoBlockConfig): CraftVideoBlockInsert {
    return create("videoBlock", block)
  }

  public fileBlock(block: CraftFileBlockConfig): CraftFileBlockInsert {
    return create("fileBlock", block)
  }

  public drawingBlock(block: CraftDrawingBlockConfig): CraftDrawingBlockInsert {
    return create("drawingBlock", block)
  }
}

function create<TType extends string, TDetails extends {}>(type: TType, details: TDetails): TDetails & { type: TType } {
  return { type, ... details };
}
