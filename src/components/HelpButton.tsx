import HelpRoundedIcon from '@mui/icons-material/HelpRounded'
import { Button, ButtonProps, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => ({
  root: {
    border: '1px solid transparent',
    borderRadius: 0,
    boxShadow: 'none',
    fontFamily: theme.font.normal,
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    '&.MuiButton-containedPrimary:not(.Mui-disabled):not([aria-disabled="true"])': {
      backgroundColor: theme.palette.cm.linkActiveLight,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.cm.buttonPrimaryHover,
      },
    },
    '&:hover, &:active': {
      boxShadow: 'none',
    },
  },
  icon: {
    // float: 'right',
    height: '24px',
    padding: 0,
    paddingLeft: '5px',
    minWidth: 0,
    paddingBottom: '3px',
  },
  small: {
    height: '36px',
  },
  medium: {
    height: '48px',
  },
  large: {
    height: '56px',
  },
}))

interface HelpProps extends ButtonProps {
  icon?: boolean
  id?: string
}

export default function ({ icon, id, href, size: inSize, color }: HelpProps): React.ReactElement {
  const size = inSize || 'small'
  const { classes, cx } = useStyles()
  const { t } = useTranslation()
  // END HOOKS
  return (
    <Tooltip title='Click to visit docs on techdocs.akamai.com!' enterDelay={1000} enterNextDelay={1000}>
      <Button
        size={size}
        color={color}
        className={cx(classes.root, icon ? classes.icon : classes[size])}
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
