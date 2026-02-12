import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import PaperLayout from 'layouts/Paper'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import {
  useCreateWorkloadCatalogMutation,
  useGetAllAplCatalogsQuery,
  useGetAplCatalogsChartsQuery,
  useGetWorkloadCatalogMutation,
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

interface Props {
  teamId: string
}

// TODO: this needs to be fetched from APL Api
interface NewChartValues {
  gitRepositoryUrl: string
  chartTargetDirName: string
  chartIcon?: string
  allowTeams: boolean
}

export default function ({ teamId }: Props): React.ReactElement {
  const { t } = useTranslation()
  const { classes, cx } = useStyles()
  const [filterName, setFilterName] = useState('')
  const [openNewChartModal, setOpenNewChartModal] = useState<boolean>(false)
  const [catalogs, setCatalogs] = useState<any[]>([])
  const [catalogFilterName, setCatalogFilterName] = useState('')
  const [filteredCatalog, setFilteredCatalog] = useState<any[]>([])
  const [chartCatalog, setChartCatalog] = useState<any[]>([])
  const [getWorkloadCatalog, { isLoading }] = useGetWorkloadCatalogMutation()

  const [expanded, setExpanded] = useState(false)
  const { user } = useSession()
  const { isPlatformAdmin } = user

  const { enqueueSnackbar } = useSnackbar()
  const [createWorkloadCatalog] = useCreateWorkloadCatalogMutation()
  const {
    data: allCatalogs,
    isLoading: isCatalogsLoading,
    isFetching: isFetchingCatalogs,
    isError: isCatalogsError,
    refetch: refetchCatalogs,
  } = useGetAllAplCatalogsQuery()

  const { data: chartCatalogData } = useGetAplCatalogsChartsQuery(
    { catalogId: catalogFilterName },
    { skip: !catalogFilterName || catalogFilterName === 'default' },
  )

  useEffect(() => {
    setCatalogFilterName('default')
  }, [])

  useEffect(() => {
    fetchCatalog()
  }, [catalogFilterName])

  useEffect(() => {
    if (allCatalogs) fetchCatalogs()
  }, [allCatalogs])

  useEffect(() => {
    setFilteredCatalog(chartCatalog)
  }, [chartCatalog])

  const handleFilterName = (name: string) => {
    setFilterName(name)
    const filtered = chartCatalog.filter((item) => item.name.includes(name))
    setFilteredCatalog(filtered)
  }

  const fetchCatalogs = () => {
    const catalogs = allCatalogs
    console.log('all catalogs', catalogs)
    setCatalogs(catalogs)
  }

  const fetchCatalog = () => {
    if (catalogFilterName === 'default') {
      getWorkloadCatalog({ body: { sub: user.sub, teamId } }).then((res: any) => {
        const { catalog }: { catalog: any[] } = res.data
        setChartCatalog(catalog)
      })
    }
  }

  useEffect(() => {
    if (chartCatalogData) setChartCatalog((chartCatalogData as any)?.catalog)
  }, [chartCatalogData])

  console.log('catalogs', catalogs)
  console.log('catalogFilterName', catalogFilterName)
  console.log('chartcatalogData', chartCatalogData)
  console.log('chartCatalog', chartCatalog)
  const isDirty = useAppSelector(({ global: { isDirty } }) => isDirty)

  useEffect(() => {
    if (isDirty !== false) return
    if (!isFetchingCatalogs) refetchCatalogs()
  }, [isDirty])

  const addChart = async (data: NewChartValues) => {
    try {
      const result = await createWorkloadCatalog({ body: data }).unwrap()
      fetchCatalog()
      if (result) enqueueSnackbar('Chart successfully added', { variant: 'success' })
      else enqueueSnackbar('Error adding chart', { variant: 'error' })

      setOpenNewChartModal(false)
    } catch (error) {
      enqueueSnackbar('Error adding chart', { variant: 'error' })
    }
  }
  if (isCatalogsLoading || isFetchingCatalogs) return <PaperLayout loading title={t('TITLE_SERVICE')} />
  return (
    <>
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
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12} sm={4}>
            <Autocomplete<string, false, false, false>
              label='Choose Catalog'
              width='large'
              options={allCatalogs?.map((catalogOption) => catalogOption.spec.name) || []}
              getOptionLabel={(catalogOption) => catalogOption}
              placeholder='default'
              value={catalogFilterName}
              onChange={(_, newValue) => setCatalogFilterName(newValue || '')}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant='body2' sx={{ color: 'text.secondary', mb: 1 }}>
              Repository
            </Typography>
            <Box>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                <strong>URL:</strong> {(chartCatalog as any)?.url || ''}
              </Typography>
            </Box>
            <Box>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                <strong>Branch:</strong> {(chartCatalog as any)?.branch || ''}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <TableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          placeholderText='search chart'
          noPadding
        />
        <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
          {isPlatformAdmin && teamId === 'admin' && (
            <Grid item xs={12} sm={6} md={4} lg={4} key='name'>
              <CatalogAddChartCard openNewChartModal={() => setOpenNewChartModal(true)} />
            </Grid>
          )}
          {filteredCatalog?.map((item) => {
            const img = item?.icon || '/logos/akamai_logo.svg'
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} key={item.name}>
                <CatalogCard img={img} teamId={teamId} name={item.name} isBeta={item.isBeta} />
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
    </>
  )
}
