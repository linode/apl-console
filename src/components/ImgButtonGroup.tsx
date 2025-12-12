import React from 'react'
import { Controller } from 'react-hook-form'
import { Box, Button, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)<{ selected: boolean }>(({ theme, selected }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.grey[500]}`,
  minHeight: 50,
  minWidth: 180,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  filter: selected ? 'none' : 'grayscale(1)',
}))

const StyledTypography = styled(Typography)<{ selected: boolean }>(({ theme, selected }) => ({
  fontSize: 20,
  textTransform: 'none',
  fontWeight: 500,
  color: selected ? theme.palette.primary.main : theme.palette.grey[500],
}))

const StyledCaption = styled(Typography)<{ selected: boolean }>(({ theme, selected }) => ({
  fontSize: 10,
  textTransform: 'none',
  color: selected ? theme.palette.primary.main : theme.palette.grey[500],
  marginLeft: '1px',
}))

interface ImgButtonGroupProps {
  title?: string
  description?: string
  name: string
  control: any
  value: string
  options: { value: string; label: string; imgSrc?: string; caption?: string }[]
  onChange?: (value: string) => void
  disabled?: boolean
}

function ImgButtonGroup({
  title,
  description,
  name,
  control,
  value,
  options,
  onChange,
  disabled = false,
}: ImgButtonGroupProps) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={value}
      render={({ field }) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, my: 2 }}>
          {title && (
            <Box>
              <Typography variant='h6' sx={{ fontSize: 16, fontWeight: 400 }}>
                {title}
              </Typography>
              {description && <Typography>{description}</Typography>}
            </Box>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {options.map((option) => (
              <StyledButton
                key={option.value}
                onClick={() => {
                  if (disabled) return
                  field.onChange(option.value)
                  onChange?.(option.value)
                }}
                selected={field.value === option.value}
              >
                {option.imgSrc && (
                  <img
                    style={{ width: 20, height: 20 }}
                    src={option.imgSrc}
                    onError={({ currentTarget }) => {
                      // eslint-disable-next-line no-param-reassign
                      currentTarget.onerror = null // prevents looping
                      // eslint-disable-next-line no-param-reassign
                      currentTarget.src = `${option.imgSrc}`
                    }}
                    alt={`Logo for ${option.imgSrc}`}
                  />
                )}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <StyledTypography selected={field.value === option.value}>{option.label}</StyledTypography>
                  <StyledCaption selected={field.value === option.value}>{option.caption}</StyledCaption>
                </Box>
              </StyledButton>
            ))}
          </Box>
        </Box>
      )}
    />
  )
}

export default ImgButtonGroup
