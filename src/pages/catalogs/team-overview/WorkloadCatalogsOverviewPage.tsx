import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import PaperLayout from 'layouts/Paper'
import React, { useCallback, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import {
  useCreateWorkloadCatalogMutation,
  useGetAllAplCatalogsQuery,
  useGetAplCatalogsChartsQuery,
} from 'redux/otomiApi'
import { useSession } from 'providers/Session'
import { useSnackbar } from 'notistack'
import { Autocomplete } from 'components/forms/Autocomplete'
import { useAppSelector } from 'redux/hooks'
import { useTranslation } from 'react-i18next'
import CatalogCard from '../../../components/CatalogCard'
import TableToolbar from '../../../components/TableToolbar'
import CatalogAddChartCard from '../../../components/CatalogAddChartCard'
import NewChartModal from '../../../components/NewChartModal'

// -- Styles -------------------------------------------------------------

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  return {
    root: {
      color: p.text.secondary,
      fontWeight: '200',
      marginTop: '5px',
    },
    info: {
      border: `1px solid ${p.text.secondary}`,
      borderRadius: '8px',
      background: 'transparent',
    },
    repositoryText: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: p.text.primary,
    },
    strongText: {
      fontWeight: 500,
      fontSize: '0.875rem',
      color: p.text.primary,
    },
  }
})

const developerCatalogInfo = [
  {
    title: 'What is the Catalog?',
    text: 'The Catalog offers golden path Helm charts for your projects. Choose the chart to use, customize the values and submit to create a Workload.',
  },
  {
    title: 'Who is maintaining the Catalog?',
    text: 'The Helm charts in the Catalog are maintained by the platform administrator.',
  },
  {
    title: 'Why use the Catalog?',
    text: 'The Catalog helps to streamline your workflow and makes deploying workloads a smooth and efficient process.',
  },
]

// ---- JSX -------------------------------------------------------------
interface NewChartValues {
  gitRepositoryUrl: string
  chartTargetDirName: string
  chartIcon?: string
  allowTeams: boolean
}

export default function (Props): React.ReactElement {
  const { t } = useTranslation()
  const { classes, cx } = useStyles()
  const [filterName, setFilterName] = useState('')
  const [openNewChartModal, setOpenNewChartModal] = useState<boolean>(false)
  const [catalogFilterName, setCatalogFilterName] = useState('')
  const [filteredCatalog, setFilteredCatalog] = useState<any[]>([])
  const [chartCatalog, setChartCatalog] = useState<any[]>([])

  const [expanded, setExpanded] = useState(false)
  const { user, oboTeamId } = useSession()
  const { isPlatformAdmin } = user

  const { enqueueSnackbar } = useSnackbar()
  const [createWorkloadCatalog] = useCreateWorkloadCatalogMutation()
  const {
    data: allCatalogs,
    isLoading: isCatalogsLoading,
    isFetching: isFetchingCatalogs,
    isError: isCatalogsError,
    refetch: refetchCatalogs,
  } = useGetAllAplCatalogsQuery({ enabled: true })

  const { data: chartCatalogData } = useGetAplCatalogsChartsQuery(
    { catalogId: catalogFilterName },
    { skip: !catalogFilterName },
  )

  useEffect(() => {
    if (chartCatalogData) setChartCatalog((chartCatalogData as any)?.catalog || [])
  }, [chartCatalogData])

  useEffect(() => {
    if (allCatalogs) {
      const defaultCatalog = allCatalogs.find((catalog) => catalog.metadata?.name === 'default')
      const selectedCatalog = defaultCatalog || allCatalogs[0]
      setCatalogFilterName(selectedCatalog?.metadata?.name || '')
    }
  }, [allCatalogs])

  useEffect(() => {
    setFilteredCatalog(chartCatalog)
  }, [chartCatalog])

  const handleCatalogChange = useCallback((catalogName: string) => {
    setCatalogFilterName(catalogName)
    handleFilterName('')
  }, [])

  const handleFilterName = useCallback(
    (name: string) => {
      setFilterName(name)
      const filtered = chartCatalog.filter((item) => item.name.includes(name))
      setFilteredCatalog(filtered)
    },
    [chartCatalog],
  )

  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetchingCatalogs) refetchCatalogs()
  }, [isDirty])

  const addChart = async (data: NewChartValues) => {
    try {
      const result = await createWorkloadCatalog({ body: data }).unwrap()
      setCatalogFilterName((prev) => prev)
      if (result) enqueueSnackbar('Chart successfully added', { variant: 'success' })
      else enqueueSnackbar('Error adding chart', { variant: 'error' })

      setOpenNewChartModal(false)
    } catch (error) {
      enqueueSnackbar('Error adding chart', { variant: 'error' })
    }
  }

  if (isCatalogsLoading || isFetchingCatalogs) return <PaperLayout loading title={t('TITLE_CATALOGS')} />
  return (
    <PaperLayout loading={isCatalogsLoading || isCatalogsError} title={t('TITLE_CATALOGS')}>
      <Box p={5} className={cx(classes.root)}>
        <Accordion className={classes.info} expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary>
            <Box sx={{ fontWeight: 'bold', mr: '12px' }}>Welcome to the Catalog!</Box>
            <HelpRoundedIcon />
          </AccordionSummary>
          <AccordionDetails>
            {developerCatalogInfo.map((info) => {
              return (
                <Box key={info.title} sx={{ mb: '12px' }}>
                  <Box sx={{ fontWeight: 'bold' }}>{info.title}</Box>
                  <Typography sx={{ ml: '1rem' }}>{info.text}</Typography>
                </Box>
              )
            })}
          </AccordionDetails>
        </Accordion>
        <Box sx={{ display: 'flex', gap: 3, my: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Autocomplete<string, false, false, false>
              label='Select Catalog'
              width='large'
              options={allCatalogs?.map((catalogOption) => catalogOption.spec.name) || []}
              getOptionLabel={(catalogOption) => catalogOption}
              placeholder={catalogFilterName || 'Select a catalog to view its charts'}
              value={catalogFilterName}
              onChange={(_, newValue) => handleCatalogChange(newValue || '')}
            />
          </Box>

          <Box sx={{ flex: 2 }}>
            <Box
              sx={{
                textAlign: 'left',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                mt: '5px',
              }}
            >
              <Typography variant='body2' className={classes.repositoryText}>
                Repository
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  <strong className={classes.strongText}>URL:</strong> {(chartCatalogData as any)?.url || ''}
                </Typography>
                <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                  <strong className={classes.strongText}>Branch:</strong> {(chartCatalogData as any)?.branch || ''}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <TableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          placeholderText='search chart'
          noPadding
        />
        <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
          {isPlatformAdmin && oboTeamId === 'admin' && (
            <Grid item xs={12} sm={6} md={4} lg={4} key='name'>
              <CatalogAddChartCard openNewChartModal={() => setOpenNewChartModal(true)} />
            </Grid>
          )}
          {oboTeamId !== 'admin' && filteredCatalog.length === 0 && (
            <Box sx={{ width: '100%' }}>
              <Typography
                variant='body2'
                sx={{ textAlign: 'center', color: 'text.secondary', fontWeight: 'bold', mb: 1 }}
              >
                No charts found.
              </Typography>
            </Box>
          )}
          {filteredCatalog?.map((item) => {
            const img = item?.icon || '/logos/akamai_logo.svg'
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} key={item.name}>
                <CatalogCard img={img} teamId={oboTeamId} name={item.name} isBeta={item.isBeta} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
      <NewChartModal
        actionButtonColor='primary'
        actionButtonText='Submit'
        title='Add Helm Chart'
        open={openNewChartModal}
        handleAction={(handleActionValues) => addChart(handleActionValues)}
        handleClose={() => setOpenNewChartModal(false)}
        chartDirectories={filteredCatalog?.map((item) => item.name) || []}
      />
    </PaperLayout>
  )
}
