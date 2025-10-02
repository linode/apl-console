import PaperLayout from 'layouts/Paper'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router-dom'
import { getRole } from 'utils/data'
import { useGetAplKnowledgeBasesQuery } from 'redux/otomiApi'
import { useAppSelector } from 'redux/hooks'
import { HeadCell } from '../../../components/EnhancedTable'
import RLink from '../../../components/Link'
import ListTable from '../../../components/ListTable'

const getKnowledgeBaseName = (): CallableFunction =>
  function (row: any): string | React.ReactElement {
    const { teamId, name }: { teamId: string; name: string } = row
    const path = `/teams/${teamId}/knowledge-bases/${encodeURIComponent(name)}`
    return (
      <RLink to={path} label={name}>
        {name}
      </RLink>
    )
  }

const getStatus = (): CallableFunction =>
  function (row: any): string {
    const { status } = row
    return status?.phase || 'Unknown'
  }

const getDataSource = (): CallableFunction =>
  function (row: any): string | React.ReactElement {
    const { sourceUrl }: { sourceUrl: string } = row
    return sourceUrl || 'N/A'
  }

const getEmbeddingModel = (): CallableFunction =>
  function (row: any): string {
    const { modelName } = row
    return modelName || 'N/A'
  }

interface Params {
  teamId: string
}

export default function KnowledgeBasesOverviewPage({
  match: {
    params: { teamId },
  },
}: RouteComponentProps<Params>): React.ReactElement {
  const { t } = useTranslation()

  const { data: knowledgeBases, isLoading, isFetching, refetch } = useGetAplKnowledgeBasesQuery({ teamId })

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)
  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetching) refetch()
  }, [isDirty])

  // Transform API response to match table format
  const transformedData =
    knowledgeBases?.map((kb) => ({
      name: kb.metadata.name,
      teamId,
      status: kb.status,
      sourceUrl: kb.spec.sourceUrl,
      modelName: kb.spec.modelName,
    })) || []

  const headCells: HeadCell[] = [
    {
      id: 'name',
      label: t('Name'),
      renderer: getKnowledgeBaseName(),
    },
    {
      id: 'status',
      label: t('Status'),
      renderer: getStatus(),
    },
    {
      id: 'datasource',
      label: t('Data Source'),
      renderer: getDataSource(),
    },
    {
      id: 'embeddingModel',
      label: t('Embedding Model'),
      renderer: getEmbeddingModel(),
    },
  ]

  const customButtonText = () => <span>Create Knowledge Base</span>

  const comp = (
    <ListTable
      teamId={teamId}
      headCells={headCells}
      rows={transformedData}
      resourceType='Knowledge-base'
      customButtonText={customButtonText()}
    />
  )
  return <PaperLayout loading={isLoading} comp={comp} title={t('TITLE_KNOWLEDGE_BASES', { scope: getRole(teamId) })} />
}
