import React from 'react'
import { Box, Container, Paper } from '@mui/material'
import { makeStyles } from 'tss-react/mui'
import Error from 'components/Error'
import Loader from 'components/Loader'
import MainLayout from './Base'

const useStyles = makeStyles()((theme) => ({
  container: {
    paddingTop: 0,
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  paper: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    paddingTop: '1px',
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
  // paper: {
  //   padding: theme.spacing(2),
  //   display: 'flex',
  //   overflow: 'auto',
  //   flexDirection: 'column',
  // },
}))

interface Props {
  loading?: boolean
  comp: React.ReactElement
}

export default function ({ loading, comp }: Props): React.ReactElement {
  const { classes } = useStyles()
  return (
    <MainLayout>
      <Container maxWidth='lg' className={classes.container}>
        <Box component={Paper} className={classes.paper}>
          <Error />
          {loading && <Loader />}
          {!loading && comp}
        </Box>
      </Container>
    </MainLayout>
  )
}
