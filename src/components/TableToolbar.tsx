import { InputAdornment, Stack, TextField } from '@mui/material'
import Iconify from './Iconify'

// ----------------------------------------------------------------------

type Props = {
  filterName: string
  onFilterName: (value: string) => void
  placeholderText?: string
  noPadding?: boolean
}

export default function TableToolbar({ filterName, onFilterName, placeholderText = 'Search', noPadding }: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: !noPadding && 2 }}>
      {/* <TextField
        fullWidth
        select
        label='Provider'
        value={filterProvider}
        onChange={(event) => onFilterProvider(event.target.value)}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsProvider.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField> */}

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={placeholderText || 'Search service...'}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Iconify icon='eva:search-fill' sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  )
}
