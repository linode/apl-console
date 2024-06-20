import { useSnackbar } from 'notistack'
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material'
import { IconButton, InputAdornment } from '@mui/material'
import { FieldValues } from 'react-hook-form'
import { TextFieldElementProps } from 'react-hook-form-mui'
import RHFTextField from './RHFTextField'

export default function RHFTextFieldCopy<TFieldValues extends FieldValues>({
  disabled,
  name,
  label,
  value,
  ...other
}: TextFieldElementProps<TFieldValues>) {
  const { enqueueSnackbar } = useSnackbar()
  return (
    <RHFTextField
      disabled
      name={name}
      label={label}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='copy to clipboard'
              onClick={() => {
                navigator.clipboard.writeText(`${value}`)
                enqueueSnackbar(`Field "${label}" copied to clipboard!`)
              }}
              onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
              }}
              edge='end'
            >
              <ContentCopyIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...other}
    />
  )
}
