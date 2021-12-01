export function deepCopy<T>(input: T): T {
  // TODO: create a more elegant solution
  const result: any = JSON.parse(JSON.stringify(input))

  return result
}
