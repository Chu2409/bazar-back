export const convertStatus = (status?: number): boolean | undefined => {
  if (status === undefined) {
    return undefined
  }
  return status === 1
}
