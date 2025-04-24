import React from 'react'
import { Box } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import { Theme } from '@mui/material/styles'
import KeyValue from 'components/KeyValue'

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
const countQuotaKeys = new Set(['services.loadbalancers', 'services.nodeports'])
const computeQuotaKeys = new Set(['limits.cpu', 'requests.cpu', 'limits.memory', 'requests.memory'])
const computeDecorators: Record<string, string> = {
  'limits.cpu': 'Cores',
  'requests.cpu': 'Cores',
  'limits.memory': 'Gi',
  'requests.memory': 'Gi',
}

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
