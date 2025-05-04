export interface IApiMessage {
  content: string[]
  displayable: boolean
}

export interface IApiRes<T> {
  success: boolean
  message: IApiMessage
  data: T | null
}

export interface IApiPaginatedRes<T> {
  records: T[]
  total: number
  limit: number
  page: number
  pages: number
}
