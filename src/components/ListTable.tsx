import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Box, Button } from '@mui/material'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import EnhancedTable, { EnhancedTableProps } from './EnhancedTable'

const useStyles = makeStyles()(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    '& .MuiGrid-item': {
      padding: '16px !important',
    },
  },
}))

interface ListTableProps extends EnhancedTableProps {
  teamId?: string
  resourceType: string
  adminOnly?: boolean
}
export default function ({ teamId, resourceType, adminOnly = false, ...other }: ListTableProps): React.ReactElement {
  const { user: isAdmin, oboTeamId } = useSession()
  const { classes } = useStyles()
  const { t } = useTranslation()
  // END HOOKS
  const resourceTypeLow = resourceType.toLowerCase()
  return (
    <>
      <div className={classes.root}>
        <h1 data-cy={`h1-list-${resourceTypeLow}`}>
          {(adminOnly || !teamId) && t('LIST_TITLE', { model: t(`${resourceType}_plural`) })}
          {!adminOnly && teamId && t('LIST_TITLE_TEAM', { model: t(`${resourceType}_plural`), teamId })}
        </h1>
      </div>
      <Box mb={1}>
        {(isAdmin || oboTeamId) && (
          <Button
            component={Link}
            to={adminOnly ? `/create-${resourceTypeLow}` : `/teams/${oboTeamId}/create-${resourceTypeLow}`}
            startIcon={<AddCircleIcon />}
            disabled={!adminOnly && isAdmin && !oboTeamId}
            data-cy={`button-create-${resourceType}`}
          >
            {t('BUTTON_NEW_RESOURCE', { model: resourceType })}
          </Button>
        )}
      </Box>
      <EnhancedTable disableSelect {...other} />
    </>
  )
}
