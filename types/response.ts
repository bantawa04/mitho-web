export interface ISuccessResponse<T> {
  success: boolean
  data: T
  message: string
}
