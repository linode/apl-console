import { Box, Button } from '@mui/material'
import { useSession } from 'providers/Session'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import EnhancedTable, { EnhancedTableProps } from './EnhancedTable'
import HeaderTitle from './HeaderTitle'

interface ListTableProps extends EnhancedTableProps {
  teamId?: string
  title?: string
  hasTeamScope?: boolean
  resourceType: string
  adminOnly?: boolean
  noCrud?: boolean
  idKey?: string
  collection?: string
  to?: string
  customButton?: React.ReactElement
  customButtonText?: React.ReactElement
}
export default function ({
  teamId,
  hasTeamScope = true,
  title: inTitle,
  resourceType,
  adminOnly = false,
  noCrud = false,
  idKey = 'id',
  to,
  customButton = null,
  customButtonText = null,
  ...other
}: ListTableProps): React.ReactElement {
  const {
    user: { isPlatformAdmin },
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
  const redirect = to || (adminOnly ? `/create-${resourceTypeLow}` : `/teams/${oboTeamId}/create-${resourceTypeLow}`)
  return (
    <>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <HeaderTitle title={inTitle || title} resourceType={resourceType} />
          </Box>
          {(isPlatformAdmin || oboTeamId) && !noCrud && (
            <Box mb={1}>
              <Button
                variant='contained'
                component={Link}
                to={redirect}
                // disabled={!adminOnly && isAdmin && !oboTeamId}
                data-cy={`button-create-${resourceType}`}
              >
                {customButtonText || t('BUTTON_NEW_RESOURCE', { model: resourceType })}
              </Button>
            </Box>
          )}
          {customButton && <Box mb={1}>{customButton}</Box>}
        </Box>
      </Box>

      <EnhancedTable disableSelect {...other} idKey={(o) => `${o[idKey]}-${o.teamId}-${o.title}`} />
    </>
  )
}
