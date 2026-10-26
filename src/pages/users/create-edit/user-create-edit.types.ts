export type AccessLevel = 'user' | 'teamAdmin' | 'platformAdmin'

export interface UserFormData {
  firstName: string
  lastName: string
  email: string
  accessLevel: AccessLevel
  teams: string[]
}
