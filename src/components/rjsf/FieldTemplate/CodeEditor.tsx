import { FieldTemplateProps } from '@rjsf/core'
import { dump, load } from 'js-yaml'
import { isEqual } from 'lodash'
import React, { ChangeEventHandler, useState } from 'react'

import CodeEditor from 'components/CodeEditor'

import FieldTemplate from './FieldTemplate'

export default ({ children, onChange, formData, ...props }: FieldTemplateProps) => {
  const [valid, setValid] = useState(true)
  const fromYaml = (yaml) => {
    try {
      const obj = load(yaml.replace('  ', '\t'), {
        onWarning: () => {
          throw new Error('invalid yaml detected')
        },
      })
      setValid(true)
      return obj
    } catch (e) {
      setValid(false)
      return undefined
    }
  }
  const toYaml = (obj) => dump(obj)
  const data = isEqual(formData, {}) ? '' : toYaml(formData)

  const onChangeWrapper: ChangeEventHandler<HTMLTextAreaElement> = (formData) => {
    const data = fromYaml(formData)
    if (data) onChange(data)
  }
  return (
    <FieldTemplate onChange={undefined} formData={formData} {...props}>
      <CodeEditor invalid={!valid} code={data} lang='yaml' onChange={onChangeWrapper} />
    </FieldTemplate>
  )
}
