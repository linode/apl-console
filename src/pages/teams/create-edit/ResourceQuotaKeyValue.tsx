import React from 'react'
import { Box } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import KeyValue from 'components/forms/KeyValue'

const useStyles = makeStyles()((theme: Theme) => ({
  decorator: {
    borderLeft: '1px solid #777777',
    height: 'auto',
    padding: '7px',
    width: '65px',
    textAlign: 'right',
    backgroundColor: theme.palette.cm.disabledBackground,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  decoratortext: {
    fontWeight: 'bold',
    fontSize: '10px',
    color: theme.palette.cl.text.title,
  },
  keyValueWrapper: {
    marginTop: '32px',
  },
}))

// Define which keys belong to each group.
const countQuotaKeys = new Set(['services.loadbalancers', 'services.nodeports', 'pods', 'count/pods'])
const computeQuotaKeys = new Set(['requests.cpu', 'requests.memory'])
const computeDecorators: Record<string, string> = {
  'requests.cpu': 'Cores',
  'requests.memory': 'Gi',
}
// count/pods added just in case it's still lingering around somewhere
const mutableValues = new Set(['pods', 'count/pods'])

interface ResourceQuotaKeyValueProps {
  name: string
  disabled?: boolean
}

export default function ResourceQuotaKeyValue({ name, disabled }: ResourceQuotaKeyValueProps) {
  const { classes } = useStyles()

  return (
    <Box>
      {/* Count Quota Section */}
      <KeyValue
        title='Count Quota'
        keyLabel='Name'
        valueLabel='Value'
        name={name}
        filterFn={(item) => countQuotaKeys.has(item.name)}
        hideWhenEmpty
        compressed
        valueSize='medium'
        keySize='medium'
        showLabel={false}
        disabled={disabled}
        keyDisabled
        valueDisabled
        valueIsNumber
        mutableValue={mutableValues}
      />

      {/* Compute Resource Quota Section */}
      <Box className={classes.keyValueWrapper}>
        <KeyValue
          title='Compute Resource Quota'
          keyLabel='Name'
          valueLabel='Value'
          name={name}
          filterFn={(item) => computeQuotaKeys.has(item.name)}
          hideWhenEmpty
          keyDisabled
          valueIsNumber
          compressed
          valueSize='medium'
          keySize='medium'
          showLabel={false}
          decoratorMapping={computeDecorators}
          disabled={disabled}
        />
      </Box>

      {/* Custom Resource Quota Section */}
      <Box className={classes.keyValueWrapper}>
        <KeyValue
          title='Custom Resource Quota'
          keyLabel='Name'
          valueLabel='Value'
          name={name}
          compressed
          valueSize='medium'
          keySize='medium'
          showLabel={false}
          filterFn={(item) => !countQuotaKeys.has(item.name) && !computeQuotaKeys.has(item.name)}
          addLabel='Add Custom Quota'
          disabled={disabled}
        />
      </Box>
    </Box>
  )
}
