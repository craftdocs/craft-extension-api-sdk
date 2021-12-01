export class CraftApiNotSupportedError extends Error {
  constructor() {
    const message = [
      "This API is currently not supported by the developer tools.",
      "Try to update to the most recent version, use:",
      "  npm update @craftdocs/craft-extension-api-dev-tools",
      "",
      "If that does not help, raise an issue in our Github page:",
      "  - Go to: https://github.com/craftdocs/craft-extension-api-dev-tools/issues",
      "  - Let us know which API you did try to use"
    ].join("\n")

    super(message)    
  }
}
