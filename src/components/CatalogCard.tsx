import { Box, ButtonGroup, IconButton, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from 'tss-react/mui'
import { useTranslation } from 'react-i18next'
import Iconify from './Iconify'

const useStyles = makeStyles()((theme) => {
  return {
    root: {
      position: 'relative',
      textAlign: 'center',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(4),
      border: `1px solid ${theme.palette.divider}`,
      margin: '5px',
      borderRadius: '8px',
      maxHeight: '200px',
      height: '200px',
      '& .hidden-button': {
        visibility: 'hidden',
        position: 'absolute',
        bottom: '0',
        transform: 'translateX(-50%)',
        left: '50%',
        width: '100%',
      },
      '&:hover .hidden-button': {
        visibility: 'visible',
      },
    },
    img: {
      height: theme.spacing(8),
      maxWidth: theme.spacing(8),
      margin: 'auto',
    },
    title: {
      textAlign: 'center',
      verticalAlign: 'bottom',
      color: theme.palette.text.primary,
      fontWeight: '200',
      marginTop: '5px',
    },
  }
})

export default function ({ img, imgAlt, teamId, catalogItem }: any): React.ReactElement {
  const { classes, cx } = useStyles()
  const { t } = useTranslation()
  const image = (
    <img
      draggable={false}
      className={cx(classes.img)}
      src={img}
      onError={({ currentTarget }) => {
        // eslint-disable-next-line no-param-reassign
        currentTarget.onerror = null // prevents looping
        // eslint-disable-next-line no-param-reassign
        currentTarget.src = imgAlt
      }}
      alt={`Logo for ${catalogItem.name}`}
    />
  )

  const linkStyle = { textDecoration: 'none' }

  return (
    <Box className={cx(classes.root)}>
      <Link to={`/catalogs/${teamId}/${catalogItem.name}`} style={linkStyle}>
        {image}
        <Typography className={cx(classes.title)} variant='h6'>
          {catalogItem.name.replace('otomi-quickstart-', '')}
        </Typography>
      </Link>

      <Box className='hidden-button'>
        <ButtonGroup
          variant='text'
          color='primary'
          size='large'
          disableElevation
          sx={{
            borderColor: 'primary.main',
            backgroundColor: 'transparent',
            paddingBottom: '10px',
          }}
        >
          {false && (
            <IconButton
              component={Link}
              to={`/teams/${teamId}/create-workload`}
              title={t('Click to create a workload chart')}
            >
              <Iconify icon='ri:share-forward-fill' />
            </IconButton>
          )}

          <IconButton
            component={Link}
            to={{
              pathname: `/catalogs/${teamId}/${catalogItem.name}`,
              state: catalogItem,
            }}
            title={t('Click to edit workload chart')}
          >
            <Iconify icon='material-symbols:settings' />
          </IconButton>
        </ButtonGroup>
      </Box>
    </Box>
  )
}
