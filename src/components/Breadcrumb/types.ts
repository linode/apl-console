import * as React from 'react'

export interface LabelProps {
  linkTo?: string
  noCap?: boolean
  prefixComponent?: React.JSX.Element | null
  prefixStyle?: React.CSSProperties
  suffixComponent?: React.JSX.Element | null
}

export interface EditableProps {
  editableTextTitle: string
  errorText?: string
  handleAnalyticsEvent?: () => void
  onCancel: () => void
  onEdit: (value: string) => Promise<any>
}
