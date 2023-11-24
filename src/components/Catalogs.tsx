/* eslint-disable no-plusplus */
import { Grid } from '@mui/material'
import { useSession } from 'providers/Session'
import React, { useEffect, useState } from 'react'
import { useWorkloadCatalogMutation } from 'redux/otomiApi'
import { makeStyles } from 'tss-react/mui'
import CatalogCard from './CatalogCard'
import TableToolbar from './TableToolbar'
import LoadingScreen from './LoadingScreen'

// -- Styles -------------------------------------------------------------

const useStyles = makeStyles()((theme) => {
  const p = theme.palette
  return {
    root: {
      color: theme.palette.text.secondary,
      fontWeight: '200',
      marginTop: '5px',
    },
    out: {
      backgroundColor: p.error.main,
    },
    in: {
      backgroundColor: p.success.main,
    },
  }
})

// ---- JSX -------------------------------------------------------------

interface Props {
  teamId: string
}

export default function ({ teamId }: Props): React.ReactElement {
  const session = useSession()
  const { classes, cx } = useStyles()
  const [filterName, setFilterName] = useState('')
  const [getWorkloadCatalog, { isLoading }] = useWorkloadCatalogMutation()
  const [catalog, setCatalog] = useState<any[]>([])
  const [filteredCatalog, setFilteredCatalog] = useState<any[]>([])
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    getWorkloadCatalog({ body: { url, sub: session.user.sub, teamId } }).then((res: any) => {
      const { url, catalog }: { url: string; catalog: any[] } = res.data
      setUrl(url)
      setCatalog(catalog)
      setFilteredCatalog(catalog)
    })
  }, [])

  const handleFilterName = (name: string) => {
    setFilterName(name)
    const filtered = catalog.filter((item) => item.name.includes(name))
    setFilteredCatalog(filtered)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <div className={cx(classes.root)}>
      <TableToolbar filterName={filterName} onFilterName={handleFilterName} placeholderText='search chart' noPadding />
      <Grid container direction='row' alignItems='center' spacing={1} data-cy='grid-apps'>
        {filteredCatalog.map((item) => {
          return (
            <Grid item xs={12} sm={4} md={3} lg={2} key={item.name}>
              <CatalogCard
                img='/logos/otomi_logo.svg'
                imgAlt='/logos/otomi_logo.svg'
                teamId={teamId}
                catalogItem={item}
              />
            </Grid>
          )
        })}
      </Grid>
    </div>
  )
}
