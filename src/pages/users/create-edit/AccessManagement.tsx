import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { Box, FormControlLabel, Radio, RadioGroup, SvgIcon, Typography } from '@mui/material'
import Section from 'components/Section'
import React, { useId } from 'react'
import type { AccessLevel } from './user-create-edit.types'

interface AccessOption {
  description: string
  permissions: string[]
  title: string
  value: AccessLevel
}

interface Props {
  disabled?: boolean
  disabledOptions?: AccessLevel[]
  onChange: (value: AccessLevel) => void
  value: AccessLevel
}

const accessOptions: AccessOption[] = [
  {
    value: 'user',
    title: 'User',
    description: 'Participate in teams',
    permissions: ['Create Kubernetes resources', 'View team resources'],
  },
  {
    value: 'teamAdmin',
    title: 'Team admin',
    description: 'Manage teams',
    permissions: ['Create Kubernetes resources', 'Manage team resources and members'],
  },
  {
    value: 'platformAdmin',
    title: 'Platform admin',
    description: 'Manage entire platform',
    permissions: ['Create Kubernetes resources', 'Manage all platform resources', 'Manage users and teams'],
  },
]

const accessIcons: Record<AccessLevel, React.ReactNode> = {
  user: <KeyboardArrowUpIcon sx={{ color: 'cm.linkActiveLight', fontSize: 32, mb: 2 }} />,
  teamAdmin: <KeyboardDoubleArrowUpIcon sx={{ color: 'cm.linkActiveLight', fontSize: 32, mb: 2 }} />,
  platformAdmin: (
    <SvgIcon
      data-testid='platform-admin-level-icon'
      sx={{ color: 'cm.linkActiveLight', fontSize: 32, mb: '10px', mt: '7px' }}
    >
      <path
        d='M7 20l5-5 5 5M7 13l5-5 5 5M7 6l5-5 5 5'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
    </SvgIcon>
  ),
}

export default function AccessManagement({
  disabled = false,
  disabledOptions = [],
  onChange,
  value,
}: Props): React.ReactElement {
  const id = useId()

  return (
    <Section title='Access Management'>
      <RadioGroup
        aria-label='Access Management'
        aria-disabled={disabled}
        value={value}
        onChange={(_, nextValue) => {
          const option = accessOptions.find((item) => item.value === nextValue)
          if (option && !disabled && !disabledOptions.includes(option.value)) onChange(option.value)
        }}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 2,
          maxWidth: 840,
          mt: 2,
        }}
      >
        {accessOptions.map((option) => {
          const selected = value === option.value
          const optionDisabled = disabled || disabledOptions.includes(option.value)
          const descriptionId = `${id}-${option.value}-description`
          const permissionsId = `${id}-${option.value}-permissions`

          return (
            <FormControlLabel
              key={option.value}
              value={option.value}
              disabled={optionDisabled}
              disableTypography
              control={
                <Radio
                  icon={<RadioButtonUncheckedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  inputProps={{
                    'aria-label': option.title,
                    'aria-describedby': `${descriptionId} ${permissionsId}`,
                  }}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'divider',
                    '&.Mui-checked': { color: 'cm.linkActiveLight' },
                  }}
                />
              }
              sx={{
                position: 'relative',
                alignItems: 'flex-start',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: selected ? 'cm.linkActiveLight' : 'divider',
                boxShadow: selected ? (theme) => `inset 0 0 0 1px ${theme.palette.cm.linkActiveLight}` : 'none',
                borderRadius: '8px',
                boxSizing: 'border-box',
                minHeight: { xs: 260, md: 300 },
                m: 0,
                p: 2.5,
                opacity: optionDisabled ? 0.6 : 1,
                '&:focus-within': {
                  outline: '2px solid',
                  outlineColor: 'cm.linkActiveLight',
                  outlineOffset: 3,
                },
              }}
              label={
                <Box component='span' sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {accessIcons[option.value]}
                  <Typography component='span' sx={{ fontWeight: 700 }}>
                    {option.title}
                  </Typography>
                  <Typography component='span' id={descriptionId} color='text.secondary' variant='body2'>
                    {option.description}
                  </Typography>
                  <Typography component='span' sx={{ fontWeight: 700, mt: 3 }} variant='body2'>
                    {option.title.toLowerCase()}s can:
                  </Typography>
                  <Box component='span' id={permissionsId} sx={{ mt: 1, pl: 2.5 }}>
                    {option.permissions.map((permission) => (
                      <Typography
                        component='span'
                        key={permission}
                        variant='body2'
                        sx={{ display: 'list-item', listStyleType: 'disc' }}
                      >
                        {permission}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              }
            />
          )
        })}
      </RadioGroup>
    </Section>
  )
}
