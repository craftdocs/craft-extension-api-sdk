import {
  BlockFactory,
  CraftCodeBlockConfig,
  CraftCodeBlockInsert,
  CraftHorizontalLineBlockConfig,
  CraftHorizontalLineBlockInsert,
  CraftTextBlockConfig,
  CraftTextBlockInsert,
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
    return {
      type: "codeBlock",
      ...block
    }
  }

  public horizontalLineBlock(block: CraftHorizontalLineBlockConfig): CraftHorizontalLineBlockInsert {
    return {
      type: "horizontalLineBlock",
      ...block
    }
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
}
