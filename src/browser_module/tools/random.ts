export function createRandomId(): string {
  return Math.random().toString(36).substring(2, 15)
}
