import { useSession } from 'providers/Session'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import PaperLayout from 'layouts/Paper'
import MuiLink from 'components/MuiLink'
import { HeadCell } from 'components/EnhancedTable'
import RLink from 'components/Link'
import ListTable from 'components/ListTable'
import { getStatus } from 'components/Workloads'
import InformationBanner from 'components/InformationBanner'
import { useGetAplNamespaceSealedSecretsQuery, useGetNamespacesWithSealedSecretsQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { useSocket } from 'providers/Socket'

const getSecretLink = (isAdmin, ownerId) =>
  function (row) {
    const teamId = row.metadata?.labels?.['apl.io/teamId']
    const name = row.metadata?.name
    if (!(isAdmin || teamId === ownerId)) return name

    const path =
      isAdmin && !ownerId
        ? `/secrets/${encodeURIComponent(name)}`
        : `/teams/${teamId}/secrets/${encodeURIComponent(name)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

export default function SecretOverviewPage(): React.ReactElement {
  const {
    data: namespacesWithSecrets,
    isLoading: isLoadingNamespaces,
    isFetching: isFetchingNamespaces,
    refetch: refetchNamespaces,
  } = useGetNamespacesWithSealedSecretsQuery(undefined)

  const [namespace, setNamespace] = useState<string>('')

  useEffect(() => {
    if (!namespace && namespacesWithSecrets?.length) setNamespace(namespacesWithSecrets[0])
  }, [namespacesWithSecrets, namespace])

  const {
    data: allSealedSecretsByNamespace,
    isLoading: isLoadingAllSealedSecretsByNamespace,
    isFetching: isFetchingAllSealedSecretsByNamespace,
    refetch: refetchAllSealedSecretsByNamespace,
  } = useGetAplNamespaceSealedSecretsQuery({ namespace }, { skip: !namespace })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!namespace && !isFetchingAllSealedSecretsByNamespace) refetchAllSealedSecretsByNamespace()
  }, [isDirty])

  useEffect(() => {
    console.log('halo reachs')
    if (allSealedSecretsByNamespace) console.log('allSealedSecretsByNamespace', allSealedSecretsByNamespace)
  }, [allSealedSecretsByNamespace])

  const {
    oboTeamId,
    user: { isPlatformAdmin },
  } = useSession()
  const { t } = useTranslation()
  const { statuses } = useSocket()

  const dropdownItems = useMemo(() => namespacesWithSecrets ?? [], [namespacesWithSecrets])
  // END HOOKS
  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getSecretLink(isPlatformAdmin, oboTeamId),
    },
    {
      id: 'type',
      label: t('Type'),
      renderer: (row) => row?.spec?.template?.type,
    },
    {
      id: 'namespace',
      label: t('Namespace'),
      renderer: (row) => row.metadata?.namespace,
    },
    {
      id: 'Status',
      label: 'Status',
      renderer: (row) => getStatus(statuses?.secrets?.[row.metadata?.name]),
    },
  ]
  const loading = isLoadingAllSealedSecretsByNamespace
  const sealedSecrets = allSealedSecretsByNamespace
  console.log('sealedsecrets', sealedSecrets)
  const comp = (
    <Box>
      {isPlatformAdmin && (
        <InformationBanner message='Please make sure to download encryption keys for the disaster recovery purpose.'>
          <MuiLink href='/api/v1/sealedsecretskeys' sx={{ ml: '8px' }}>
            Download Keys
          </MuiLink>
        </InformationBanner>
      )}
      <ListTable
        headCells={headCells}
        rows={sealedSecrets || []}
        resourceType='Secret'
        adminOnly
        hasDropdownFilter
        dropdownFilterLabel='Namespace'
        dropdownFilterItems={dropdownItems} // or build dynamically
        dropdownFilterAccessor={(row) => row?.metadata?.namespace}
      />
    </Box>
  )
  return <PaperLayout loading={loading} comp={comp} title={t('TITLE_TEAMS')} />
}
