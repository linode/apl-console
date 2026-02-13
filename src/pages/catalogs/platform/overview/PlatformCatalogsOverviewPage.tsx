import PaperLayout from 'layouts/Paper'
import { useSession } from 'providers/Session'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetAllAplCatalogsQuery } from 'redux/otomiApi'
import { HeadCell } from '../../../../components/EnhancedTable'
import RLink from '../../../../components/Link'
import ListTable from '../../../../components/ListTable'

const getCatalogName = (): CallableFunction =>
  function (row): string | React.ReactElement {
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
  const {
    user: { isPlatformAdmin },
  } = useSession()

  useEffect(() => {
    if (isDirty !== false && !isFetchingCatalogs) refetchCatalogs()
  }, [isDirty])

  const { t } = useTranslation()
  console.log('allCatalogs', allCatalogs)
  const headCells: HeadCell[] = [
    {
      id: 'metadata.name',
      label: t('Name'),
      renderer: getCatalogName(),
    },
  ]
  // END HOOKS
  const comp = (
    <ListTable headCells={headCells} rows={allCatalogs} resourceType='Catalogs' adminOnly hasTeamScope={false} />
  )
  return <PaperLayout loading={isCatalogsLoading} comp={comp} title={t('TITLE_CATALOGS')} />
}
