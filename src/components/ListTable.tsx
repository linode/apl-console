import React, { useEffect, useMemo, useState } from 'react'
import { Box, Button, MenuItem } from '@mui/material'
import { useSession } from 'providers/Session'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { TextField } from 'components/forms/TextField'
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

  hasDropdownFilter?: boolean
  dropdownFilterLabel?: string
  dropdownFilterItems?: string[]
  dropdownFilterAccessor?: (row: any) => string | undefined | null
  dropdownFilterValue?: string
  onDropdownFilterChange?: (value: string) => void
}

export default function ({
  teamId,
  hasTeamScope = true,
  title: inTitle,
  resourceType,
  adminOnly = false,
  noCrud = false,
  idKey = 'name',
  to,
  customButton = null,
  customButtonText = null,

  hasDropdownFilter = false,
  dropdownFilterLabel = 'Filter',
  dropdownFilterItems = [],
  dropdownFilterAccessor = (row) => row?.metadata?.namespace,

  dropdownFilterValue,
  onDropdownFilterChange,

  ...other
}: ListTableProps): React.ReactElement {
  const {
    user: { isPlatformAdmin },
    oboTeamId,
  } = useSession()
  const { t } = useTranslation()

  const resourceTypePlural = `${resourceType}_plural`
  const title = t('LIST_TITLE_NOSCOPE', { model: t(resourceTypePlural) })
  const resourceTypeLow = t(resourceTypePlural).replaceAll(' ', '-').toLowerCase()
  const redirect = to || (adminOnly ? `/${resourceTypeLow}/create` : `/teams/${oboTeamId}/${resourceTypeLow}/create`)

  const { rows = [], ...enhancedTableProps } = other as any

  const [internalSelected, setInternalSelected] = useState<string>('')
  const selectedFilter = dropdownFilterValue ?? internalSelected

  // When items load/change, select first item if nothing selected
  useEffect(() => {
    if (!hasDropdownFilter) return
    if (selectedFilter) return
    if (dropdownFilterItems.length > 0) {
      const first = dropdownFilterItems[0]
      if (onDropdownFilterChange) onDropdownFilterChange(first)
      else setInternalSelected(first)
    }
  }, [hasDropdownFilter, dropdownFilterItems, selectedFilter])

  const setSelected = (value: string) => {
    if (onDropdownFilterChange) onDropdownFilterChange(value)
    else setInternalSelected(value)
  }

  const filteredRows = useMemo(() => {
    if (!hasDropdownFilter) return rows

    if (!selectedFilter) return []

    return (rows || []).filter((row: any) => dropdownFilterAccessor(row) === selectedFilter)
  }, [hasDropdownFilter, rows, selectedFilter])

  return (
    <>
      <Box sx={{ backgroundColor: 'background.default' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1 }}>
            <HeaderTitle title={inTitle || title} resourceType={resourceType} />
          </Box>

          {(isPlatformAdmin || oboTeamId) && !noCrud && (
            <Box mb={1}>
              <Button variant='contained' component={Link} to={redirect} data-cy={`button-create-${resourceType}`}>
                {customButtonText || t('BUTTON_NEW_RESOURCE', { model: resourceType })}
              </Button>
            </Box>
          )}

          {customButton && <Box mb={1}>{customButton}</Box>}
        </Box>
      </Box>

      {hasDropdownFilter && (
        <Box mb={2} mr={2} sx={{ minWidth: 260 }}>
          <TextField
            label={dropdownFilterLabel}
            sx={{ mt: 2 }}
            select
            width='large'
            value={selectedFilter}
            onChange={(e: any) => setSelected(e.target.value)}
            disabled={dropdownFilterItems.length === 0}
            helperText={
              dropdownFilterItems.length === 0
                ? `No ${resourceType}s available in namespace ${dropdownFilterValue || internalSelected}`
                : undefined
            }
          >
            {dropdownFilterItems.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      )}

      <EnhancedTable
        disableSelect
        {...enhancedTableProps}
        rows={filteredRows}
        idKey={(o) => `${o[idKey]}-${o.teamId}-${o.title}`}
      />
    </>
  )
}
