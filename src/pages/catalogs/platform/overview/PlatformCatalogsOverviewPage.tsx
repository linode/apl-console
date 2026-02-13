import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetAllAplCatalogsQuery } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import { HeadCell } from '../../../../components/EnhancedTable'
import RLink from '../../../../components/Link'
import ListTable from '../../../../components/ListTable'

interface Row {
  metadata: {
    name: string
  }
  spec: {
    enabled: boolean
  }
}
// -- Styles -------------------------------------------------------------

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  return {
    tableText: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: '#FFFFFF',
    },
  }
})

const getCatalogName = (row: Row) => {
  const { name }: { name: string } = row.metadata
  return (
    <RLink to={`/catalogs/${name}`} label={name}>
      {name}
    </RLink>
  )
}

export default function PlatformCatalogsOverviewPage(): React.ReactElement {
  const {
    data: allCatalogs,
    isLoading: isCatalogsLoading,
    isFetching: isFetchingCatalogs,
    isError: isCatalogsError,
    refetch: refetchCatalogs,
  } = useGetAllAplCatalogsQuery()
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false && !isFetchingCatalogs) refetchCatalogs()
  }, [isDirty])

  const { t } = useTranslation()
  const headCells: HeadCell[] = [
    {
      id: 'metadata.name',
      label: t('Name'),
      renderer: (row: Row) => getCatalogName(row),
    },
    {
      id: 'spec.enabled',
      label: t('Enabled'),
      renderer: (row: Row) => row.spec.enabled.toString(),
    },
  ]
  // END HOOKS
  const comp = (
    <ListTable headCells={headCells} rows={allCatalogs} resourceType='Catalog' adminOnly hasTeamScope={false} />
  )
  return <PaperLayout loading={isCatalogsLoading} comp={comp} title={t('TITLE_CATALOGS')} />
}
