import { CraftBlock, CraftBlockInsert, MarkdownApi, MarkdownFactory, MarkdownOptions } from "@craftdocs/craft-extension-api"

const Note = "For testing the real capabilities of this method, deploy the extension into the Craft editor."

export class MarkdownApiMock implements MarkdownApi {
  public markdownToCraftBlocks(source: string): CraftBlockInsert[] {
    return [
      {
        type: "textBlock",
        content: "Markdown document",
        style: {
          textStyle: "title"
        }
      },
      {
        type: "textBlock",
        content: `The Markdown formatted content has been converted into blocks. ${Note}` 
      }
    ]
  }

  public craftBlockToMarkdown(blocks: CraftBlock[], flavor: keyof MarkdownFactory, options: MarkdownOptions): string {
    return [
      "# Markdown document",
      "",
      `The blocks has been exported as Markdown. ${Note}`
    ].join("\n")
  }
}
