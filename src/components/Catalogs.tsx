import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, Typography } from '@mui/material'
import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import React, { useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'
import CatalogCard from './CatalogCard'
import TableToolbar from './TableToolbar'

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
    title: 'What is the Template Catalog?',
    text: 'The Template Catalog offers golden path Helm templates for your projects. Choose the Helm template to use, customize the values and submit to create a Workload.',
  },
  {
    title: 'Who maintaining the Template Catalog?',
    text: 'The templates in the Catalog are maintained by the platform administrator.',
  },
  {
    title: 'Why use the Template Catalog?',
    text: 'The Template Catalog streamlines your workflow and makes deploying workloads a smooth and efficient process.',
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
    <div className={cx(classes.root)}>
      <Accordion className={classes.info} expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary>
          <Box sx={{ fontWeight: 'bold', mr: '12px' }}>Welcome to the Template Catalog!</Box>
          <HelpRoundedIcon />
        </AccordionSummary>
        <AccordionDetails>
          {developerCatalogInfo.map((info) => {
            return (
              <Box sx={{ mb: '12px' }}>
                <Box sx={{ fontWeight: 'bold' }}>{info.title}</Box>
                <Typography sx={{ ml: '1rem' }}>{info.text}</Typography>
              </Box>
            )
          })}
        </AccordionDetails>
      </Accordion>
      <TableToolbar filterName={filterName} onFilterName={handleFilterName} placeholderText='search chart' noPadding />
      <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
        {filteredCatalog.map((item) => {
          const img = item?.icon || '/logos/akamai_logo.svg'
          return (
            <Grid item xs={12} sm={4} md={3} lg={2} key={item.name}>
              <CatalogCard img={img} teamId={teamId} name={item.name} isBeta={item.isBeta} />
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
