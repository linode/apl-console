import { Box, Card, Container, useTheme } from '@mui/material'
import React from 'react'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()(() => ({
  container: {
    padding: 0,
  },
}))

interface Props {
  children?: any
  title?: string
}
export default function ({ children, title }: Props): React.ReactElement {
  const theme = useTheme()
  const dashboardStyle = {
    backgroundColor: '#181B1F',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    fontColor: '#fff',
  }
  const { classes } = useStyles()
  return (
    <Box sx={{ backgroundColor: '#161c24', height: '100vh' }}>
      <Container sx={{ paddingTop: '20px' }} maxWidth='lg' className={classes.container} title={title}>
        <Card sx={{ p: 3, ...dashboardStyle }}>{children}</Card>
      </Container>
    </Box>
  )
}
