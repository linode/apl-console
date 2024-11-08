import { Box, CircularProgress } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { GetWorkloadValuesApiResponse } from 'redux/otomiApi'
import YAML from 'yaml'
import CodeEditor from './CodeEditor'

interface Props {
  workloadValues: GetWorkloadValuesApiResponse
  setWorkloadValues: (formData: any) => void
  rerender?: string
  showComments?: boolean
}

export default function ({
  workloadValues,
  setWorkloadValues,
  rerender,
  showComments = false,
}: Props): React.ReactElement {
  const [show, setShow] = useState(false)

  // re-render the CodeEditor component with values changes from the parent component
  useEffect(() => {
    setShow(false)
    setTimeout(() => setShow(true), 1000)
  }, [rerender])
  // END HOOKS
  const yaml = YAML.stringify(workloadValues)

  return (
    <Box pt={2}>
      {show && workloadValues ? (
        <CodeEditor
          code={yaml}
          onChange={(data) => {
            setWorkloadValues(data)
          }}
          setWorkloadValues={setWorkloadValues}
          showComments={showComments}
        />
      ) : (
        <CircularProgress sx={{ mb: '1rem' }} />
      )}
    </Box>
  )
}
