import type { ApiPageForm } from './_fetch'

export interface UserSearchForm extends ApiPageForm {}

export interface UserRow {
  id: string
  name: string
  age: number
  sex: number
  hasLoan: boolean
  region: string
  createTime: string
}
