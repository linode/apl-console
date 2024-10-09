export interface CrudProps {
  mutating: boolean
  onSubmit?: (formData: any) => void
  onDelete?: (id: string) => void
  onChange?: (val: Record<string, any>, err: any[]) => void
}

export interface ValuesSchema {
  properties: {
    apps: {
      properties: string[]
    }
  }
}
