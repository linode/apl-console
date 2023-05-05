import { Box, Button } from '@mui/material'
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
}

export default function ({
  editable = false,
  onSubmit,
  workloadValues,
  setWorkloadValues,
  hideTitle = false,
  ...other
}: Props): React.ReactElement {
  const [isEdit, setIsEdit] = useState(editable)
  const [rawValues, setRawValues] = useState(workloadValues?.values)
  const [validRaw, setValidRaw] = useState(true)
  const { t } = useTranslation()
  const { classes } = useStyles()
  useEffect(() => {
    setRawValues(workloadValues?.values)
  }, [workloadValues])
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
      <CodeEditor
        code={yaml}
        onChange={(data) => {
          setRawValues(data || {})
          setWorkloadValues?.((prev: any) => {
            return { ...prev, values: data }
          })
        }}
        disabled={!isEdit}
        setValid={setValidRaw}
      />
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
