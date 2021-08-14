export interface RESTResp<T> {
    success: true | false
    statusCode: number
    message: string
    content?: T
  }