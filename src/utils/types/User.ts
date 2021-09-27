export interface User {
  id: string
  username: string
  lowerUsername: string
  email: string
  password: string
  created: string
  class: number
  readonly raw: any
}