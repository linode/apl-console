import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Box, Button } from '@mui/material'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import EnhancedTable, { EnhancedTableProps } from './EnhancedTable'
import Header from './Header'

interface ListTableProps extends EnhancedTableProps {
  teamId?: string
  title?: string
  hasTeamScope?: boolean
  resourceType: string
  adminOnly?: boolean
  noCrud?: boolean
}
export default function ({
  teamId,
  hasTeamScope = true,
  title: inTitle,
  resourceType,
  adminOnly = false,
  noCrud = false,
  ...other
}: ListTableProps): React.ReactElement {
  const {
    user: { isAdmin },
    oboTeamId,
  } = useSession()
  const { t } = useTranslation()
  // END HOOKS
  const resourceTypePlural = `${resourceType}_plural`
  let title
  if ((adminOnly || !teamId) && !hasTeamScope) title = t('LIST_TITLE_NOSCOPE', { model: t(resourceTypePlural) })
  if ((adminOnly || !teamId) && hasTeamScope) title = t('LIST_TITLE', { model: t(resourceTypePlural) })
  if (!adminOnly && teamId) title = t('LIST_TITLE_TEAM', { model: t(resourceTypePlural), teamId })
  const resourceTypeLow = resourceType.toLowerCase()
  return (
    <>
      <Header title={inTitle || title} resourceType={resourceType} />
      {(isAdmin || oboTeamId) && !noCrud && (
        <Box mb={1}>
          <Button
            component={Link}
            to={adminOnly ? `/create-${resourceTypeLow}` : `/teams/${oboTeamId}/create-${resourceTypeLow}`}
            startIcon={<AddCircleIcon />}
            // disabled={!adminOnly && isAdmin && !oboTeamId}
            data-cy={`button-create-${resourceType}`}
          >
            {t('BUTTON_NEW_RESOURCE', { model: resourceType })}
          </Button>
        </Box>
      )}
      <EnhancedTable disableSelect {...other} idKey={teamId ? (o) => `${o.id}-${o.teamId}-${o.title}` : 'id'} />
    </>
  )
}
