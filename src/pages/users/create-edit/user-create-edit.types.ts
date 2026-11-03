export type AccessLevel = 'user' | 'teamAdmin' | 'platformAdmin'

export interface UserFormData {
  email: string
  accessLevel: AccessLevel
  teams: string[]
}
