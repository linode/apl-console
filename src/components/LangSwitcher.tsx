import { MenuItem, Select } from '@mui/material'
import { getThemeMode } from 'common/theme'
import { availableLanguages } from 'i18n/i18n'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()((theme) => {
  const isDark = getThemeMode() === 'dark'
  const color = isDark ? theme.palette.secondary.contrastText : theme.palette.secondary.main
  const background = isDark ? theme.palette.primary.light : theme.palette.primary.dark
  return {
    root: {
      // minWidth: '6rem !important',
      marginRight: '0.5rem',
      paddingLeft: '0.5rem',
      marginLeft: 3,
      background,
      fontSize: '1rem',
      color,
      fontWeight: 'bold',
      height: 36,
      borderRadius: 18,
      borderWidth: 0,
    },
    switchLabel: {
      // minWidth: '6rem !important',
      marginRight: '0.5rem',
      paddingLeft: '0.5rem',
      marginLeft: 3,
      fontSize: '1rem',
      fontWeight: 'bold',
    },
    icon: {
      fill: color,
    },
  }
})

export default function (): React.ReactElement {
  const { classes } = useStyles()
  const { i18n } = useTranslation()
  return (
    <Select
      className={classes.root}
      color='secondary'
      renderValue={(val) => val}
      value={i18n.language}
      inputProps={{
        classes: {
          icon: classes.icon,
        },
      }}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      {Object.keys(availableLanguages).map((id) => (
        <MenuItem key={id} value={id} data-cy={`select-language-${id}`}>
          {availableLanguages[id]}
        </MenuItem>
      ))}
    </Select>
  )
}
