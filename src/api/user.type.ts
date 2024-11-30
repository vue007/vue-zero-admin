import type { ApiPageForm } from './_fetch'

export interface UserSearchForm extends ApiPageForm {}

export interface UserRow {
  age: number
  city: string
  hasPassion: boolean
  id: string
  name: string
  sex: number
  startDate: string
  createdTime: string
}

export interface UserForm {
  id?: string
  age: number
  city: string
  hasPassion: boolean
  name: string
  sex: number
  startDate: string
  createdTime?: string
}
