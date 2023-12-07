import { Box, Button, CircularProgress } from '@mui/material'
import { getSpec } from 'common/api-spec'
import { cloneDeep } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GetWorkloadValuesApiResponse } from 'redux/otomiApi'
import YAML from 'yaml'
import { makeStyles } from 'tss-react/mui'
import CodeEditor from './CodeEditor'
import HeaderTitle from './HeaderTitle'

const useStyles = makeStyles()((theme) => ({
  header: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  headerText: {},
  headerButtons: {
    marginLeft: 'auto',
  },
  legend: {
    paddingTop: theme.spacing(3),
  },
  content: {
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  paragraph: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  noTabs: {
    padding: theme.spacing(3),
  },
  buffer: {
    height: theme.spacing(2),
  },
  tableRow: {
    '&:last-child td, &:last-child th': { border: 0 },
  },
  tableHead: {
    // minWidth: theme.spacing(12),
  },
}))

export const getWorkloadValuesSchema = (): any => {
  const schema = cloneDeep(getSpec().components.schemas.WorkloadValues)
  return schema
}

interface Props {
  editable?: boolean
  onSubmit?: (formData: any) => void
  workloadValues?: GetWorkloadValuesApiResponse
  setWorkloadValues?: (formData: any) => void
  hideTitle?: boolean
  helmChart?: string
}

export default function ({
  editable = false,
  onSubmit,
  workloadValues,
  setWorkloadValues,
  hideTitle = false,
  helmChart,
}: Props): React.ReactElement {
  const [isEdit, setIsEdit] = useState(editable)
  const [rawValues, setRawValues] = useState(workloadValues)
  const [validRaw, setValidRaw] = useState(true)
  const { t } = useTranslation()
  const { classes } = useStyles()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setRawValues(workloadValues)
  }, [workloadValues])

  // re-render the CodeEditor component with the new helm chart values
  useEffect(() => {
    setShow(false)
    setTimeout(() => setShow(true), 1000)
  }, [helmChart])
  // END HOOKS
  const yaml = YAML.stringify(rawValues)
  const handleSubmit = () => {
    if (validRaw) onSubmit(rawValues)
  }

  return (
    <>
      {!hideTitle && (
        <HeaderTitle
          title={t('WORKLOAD_VALUES_TITLE', { name: workloadValues.name, teamId: workloadValues.teamId })}
          description={t('WORKLOAD_VALUES_DESC')}
          resourceType='WorkloadValues'
        />
      )}
      <div className={classes.buffer}> </div>{' '}
      {show && workloadValues ? (
        <CodeEditor
          code={yaml}
          onChange={(data) => {
            setRawValues(data || {})
            setWorkloadValues?.(data)
          }}
          disabled={!isEdit}
          setValid={setValidRaw}
        />
      ) : (
        <CircularProgress sx={{ mb: '1rem' }} />
      )}
      {!editable && (
        <Box display='flex' flexDirection='row-reverse' m={1}>
          <Button
            color='primary'
            variant='contained'
            data-cy='button-edit-rawvalues'
            onClick={() => {
              if (isEdit) handleSubmit()
              setIsEdit(!isEdit)
            }}
            disabled={!validRaw}
          >
            {isEdit ? t('Submit') : t('Edit')}
          </Button>
        </Box>
      )}
    </>
  )
}
