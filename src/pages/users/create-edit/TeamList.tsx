import SearchIcon from '@mui/icons-material/Search'
import { Box, Divider, InputAdornment, Typography } from '@mui/material'
import { Checkbox } from 'components/cmCheckbox/Checkbox'
import { TextField } from 'components/forms/TextField'
import Section from 'components/Section'
import React, { useId, useMemo, useState } from 'react'

interface Props {
  onChange: (teams: string[]) => void
  options: string[]
  value: string[]
  disabled?: boolean
  helperText?: string
}

export default function TeamList({
  onChange,
  options,
  value,
  disabled = false,
  helperText,
}: Props): React.ReactElement {
  const [search, setSearch] = useState('')
  const helperTextId = useId()
  const visibleTeams = useMemo(
    () => [...new Set(options)].filter((team) => team.toLowerCase().includes(search.trim().toLowerCase())),
    [options, search],
  )
  const selectedTeams = new Set(value)
  const allSelected = visibleTeams.length > 0 && visibleTeams.every((team) => selectedTeams.has(team))
  const partiallySelected = !allSelected && visibleTeams.some((team) => selectedTeams.has(team))

  const toggleTeam = (team: string) => {
    if (disabled) return
    onChange(value.includes(team) ? value.filter((selectedTeam) => selectedTeam !== team) : [...value, team])
  }

  const toggleAll = () => {
    if (disabled || visibleTeams.length === 0) return
    onChange(
      allSelected ? value.filter((team) => !visibleTeams.includes(team)) : [...new Set([...value, ...visibleTeams])],
    )
  }

  return (
    <Section title='Teams'>
      <Box
        role='group'
        aria-label='Team selection'
        aria-describedby={helperText ? helperTextId : undefined}
        sx={{ maxWidth: 420, width: '100%' }}
      >
        <TextField
          hideLabel
          label='Search teams'
          placeholder='Search team(s)'
          value={search}
          width='fullwidth'
          disabled={disabled}
          onChange={(event) => {
            if (!disabled) setSearch(event.target.value)
          }}
          InputProps={{
            inputProps: { 'aria-label': 'Search teams' },
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon color='disabled' />
              </InputAdornment>
            ),
          }}
        />
        {helperText && (
          <Typography id={helperTextId} color='text.secondary' sx={{ mt: 1 }} variant='body2'>
            {helperText}
          </Typography>
        )}
        <Box
          sx={{
            bgcolor: 'cm.textBox',
            border: '1px solid',
            borderColor: 'cm.textBoxBorder',
            boxSizing: 'border-box',
            mt: 2,
            width: '100%',
          }}
        >
          <Checkbox
            text='Select all'
            checked={allSelected}
            indeterminate={partiallySelected}
            disabled={disabled || visibleTeams.length === 0}
            onChange={toggleAll}
            sxFormLabel={{ display: 'flex', m: 0, px: 1 }}
          />
          <Divider />

          <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
            {visibleTeams.map((team) => (
              <Checkbox
                key={team}
                text={team}
                checked={selectedTeams.has(team)}
                disabled={disabled}
                onChange={() => toggleTeam(team)}
                sxFormLabel={{
                  display: 'flex',
                  m: 0,
                  px: 1,
                  overflowWrap: 'anywhere',
                  '&:hover': { bgcolor: disabled ? undefined : 'action.hover' },
                }}
              />
            ))}
            {visibleTeams.length === 0 && (
              <Typography color='text.secondary' sx={{ p: 2 }} variant='body2'>
                {options.length === 0 ? 'No teams available' : 'No teams found'}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Section>
  )
}
