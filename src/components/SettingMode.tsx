// @mui
import { styled } from '@mui/material/styles'
import { CardActionArea, Grid, RadioGroup, Tooltip } from '@mui/material'
import useSettings from 'hooks/useSettings'
//
import Iconify from './Iconify'
import BoxMask from './BoxMask'

// ----------------------------------------------------------------------

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.cm.textBox,
  border: `solid 1px ${theme.palette.cm.textBoxBorder}`,
  borderRadius: 0,
  boxShadow: 'none',
  '&:hover': {
    color: theme.palette.cm.buttonPrimaryHover,
    borderColor: theme.palette.cm.buttonPrimaryHover,
  },
}))

// ----------------------------------------------------------------------

export default function SettingMode() {
  const { themeMode, onChangeMode } = useSettings()

  const modes = ['light', 'dark', 'system']
  const icons = ['ph:sun-duotone', 'ph:moon-duotone', 'ph:monitor-duotone']

  const getModeLabel = (mode: string) => {
    return mode.charAt(0).toUpperCase() + mode.slice(1)
  }

  return (
    <RadioGroup name='themeMode' value={themeMode} onChange={onChangeMode}>
      <Grid dir='ltr' container spacing={2.5}>
        {modes.map((mode, index) => {
          const isSelected = themeMode === mode

          return (
            <Grid key={mode} item xs={4}>
              <Tooltip title={getModeLabel(mode)} arrow placement='bottom'>
                <span>
                  <BoxStyle
                    sx={{
                      ...(isSelected && {
                        color: 'cm.linkActiveLight',
                        borderColor: 'cm.linkActiveLight',
                      }),
                    }}
                  >
                    <Iconify icon={icons[index]} width={28} height={28} />
                    <BoxMask value={mode} />
                  </BoxStyle>
                </span>
              </Tooltip>
            </Grid>
          )
        })}
      </Grid>
    </RadioGroup>
  )
}
