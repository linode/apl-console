import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import CatalogCard from './CatalogCard'
import TableToolbar from './TableToolbar'
import CatalogAddChartCard from './CatalogAddChartCard'
import NewChartModal from './NewChartModal'

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
  catalogs: any[]
}

export default function ({ teamId, catalogs }: Props): React.ReactElement {
  const { classes, cx } = useStyles()
  const [filterName, setFilterName] = useState('')
  const [openNewChartModal, setOpenNewChartModal] = useState<boolean>(false)
  const [filteredCatalog, setFilteredCatalog] = useState<any[]>([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    setFilteredCatalog(catalogs)
  }, [catalogs])

  const handleFilterName = (name: string) => {
    setFilterName(name)
    const filtered = catalogs.filter((item) => item.name.includes(name))
    setFilteredCatalog(filtered)
  }

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
        <TableToolbar
          filterName={filterName}
          onFilterName={handleFilterName}
          placeholderText='search chart'
          noPadding
        />
        <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
          {filteredCatalog.map((item) => {
            const img = item?.icon || '/logos/akamai_logo.svg'
            return (
              <Grid item xs={12} sm={6} md={4} lg={4} key={item.name}>
                <CatalogCard img={img} teamId={teamId} name={item.name} isBeta={item.isBeta} />
              </Grid>
            )
          })}
          <Grid item xs={12} sm={6} md={4} lg={4} key='name'>
            <CatalogAddChartCard openNewChartModal={() => setOpenNewChartModal(true)} />
          </Grid>
        </Grid>
      </Box>
      <NewChartModal
        actionButtonColor='primary'
        actionButtonText='Add Chart'
        title='Add Helm Chart'
        open={openNewChartModal}
        handleClose={() => setOpenNewChartModal(false)}
      />
    </>
  )
}
