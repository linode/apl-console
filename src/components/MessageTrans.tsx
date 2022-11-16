import React from 'react'
import { Trans } from 'react-i18next'

export default function (props): React.ReactElement {
  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      <Trans {...props} />
    </div>
  )
}
