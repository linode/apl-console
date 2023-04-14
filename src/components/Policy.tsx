/* eslint-disable no-nested-ternary */
import { Box, Typography } from '@mui/material'
import { getSpec } from 'common/api-spec'
import { cloneDeep, get } from 'lodash'
import { CrudProps } from 'pages/types'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import Iconify from './Iconify'
import Form from './rjsf/Form'

const getPolicySchema = (policyId): any => {
  const schema = cloneDeep(get(getSpec(), `components.schemas.Settings.properties.policies.properties[${policyId}]`))
  switch (policyId) {
    default:
      break
  }
  return schema
}

interface Props extends CrudProps {
  policies: any
  policyId: string
}

export default function ({ policies, policyId, ...other }: Props): React.ReactElement {
  const { appsEnabled } = useSession()
  const [data, setData]: any = useState(policies[policyId])
  useEffect(() => {
    setData(policies[policyId])
  }, [policyId, policies])
  // END HOOKS
  const schema = getPolicySchema(policyId)
  return (
    <>
      {!appsEnabled.gatekeeper && (
        <Box
          sx={{
            backgroundColor: '#f2f2894d',
            padding: '10px',
            border: '1px solid #d4d402',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Iconify icon='material-symbols:info' width={40} height={28} color='#c7d030d9' />
          <Typography>Please enable gatekeeper to activate policies</Typography>
        </Box>
      )}

      <Form
        key={policyId}
        schema={schema}
        data={data}
        onChange={setData}
        disabled={!appsEnabled.gatekeeper}
        resourceType='Policy'
        idProp={null}
        adminOnly
        {...other}
      />
    </>
  )
}
