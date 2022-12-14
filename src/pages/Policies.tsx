import Policies from 'components/Policies'
import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'redux/hooks'
import { useGetSettingsQuery } from 'redux/otomiApi'

export default function (): React.ReactElement {
  const { data, isLoading, isFetching, isError, refetch } = useGetSettingsQuery({ ids: ['policies'] })
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty === false && !isFetching) refetch()
  }, [isDirty])
  const { t } = useTranslation()
  // END HOOKS
  const policies = data?.policies ?? ({ policies: [] } as any)
  const comp = !isError && <Policies policies={policies} />
  return <PaperLayout comp={comp} loading={isLoading} title={t('TITLE_POLICIES')} />
}
