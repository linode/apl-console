import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import { Button, ButtonProps, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  icon: {
    // float: 'right',
    height: '24px',
    padding: 0,
    paddingLeft: '5px',
    minWidth: 0,
    paddingBottom: '3px',
  },
  small: {
    marginTop: theme.spacing(3),
    height: '36px',
  },
  medium: {
    marginTop: theme.spacing(3),
    height: '48px',
  },
  large: {
    marginTop: theme.spacing(3),
    height: '56px',
  },
}))

interface HelpProps extends ButtonProps {
  icon?: boolean
  id?: string
}

export default function ({ icon, id, href, size: inSize }: HelpProps): React.ReactElement {
  const size = inSize || 'small'
  const { classes } = useStyles()
  const { t } = useTranslation()
  // END HOOKS
  return (
    <Tooltip title='Click to visit docs on otomi.io!' enterDelay={1000} enterNextDelay={1000}>
      <Button
        size={size}
        className={icon ? classes.icon : classes[size]}
        startIcon={<HelpRoundedIcon />}
        variant={icon ? 'text' : 'contained'}
        aria-label={t('Read the documentation')}
        data-cy={`button-help-${id}`}
        target='_blank'
        href={`${href}`}
      >
        {!icon && t('help')}
      </Button>
    </Tooltip>
  )
}
