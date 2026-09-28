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
  borderRadius: 0,
  border: `1px solid ${selected ? theme.palette.cm.linkActiveLight : theme.palette.cm.textBoxBorder}`,
  boxShadow: 'none',
  fontFamily: theme.font.normal,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  minHeight: 50,
  minWidth: 180,
  backgroundColor: theme.palette.cm.textBox,
  '&:hover:not(.Mui-disabled)': {
    backgroundColor: theme.palette.background.default,
    borderColor: theme.palette.cm.buttonPrimaryHover,
    boxShadow: 'none',
  },
  '&.Mui-disabled': {
    borderColor: theme.palette.action.disabledBackground,
    '& .MuiTypography-root': {
      color: theme.palette.action.disabled,
    },
  },
  '& img': {
    filter: selected ? 'none' : 'grayscale(1)',
  },
}))

const StyledTypography = styled(Typography)<{ selected: boolean }>(({ theme, selected }) => ({
  fontFamily: theme.font.normal,
  fontSize: '14px',
  lineHeight: '20px',
  textTransform: 'none',
  fontWeight: 400,
  color: selected ? theme.palette.cm.linkActiveLight : theme.palette.text.primary,
}))

const StyledCaption = styled(Typography)<{ selected: boolean }>(({ theme, selected }) => ({
  fontFamily: theme.font.normal,
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '20px',
  textTransform: 'none',
  color: selected ? theme.palette.cm.linkActiveLight : theme.palette.text.secondary,
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
              <Typography
                variant='h6'
                sx={{
                  fontFamily: (theme) => theme.font.normal,
                  fontSize: '14px',
                  lineHeight: '20px',
                  fontWeight: 700,
                  color: 'text.primary',
                }}
              >
                {title}
              </Typography>
              {description && (
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.font.normal,
                    fontSize: '14px',
                    lineHeight: '20px',
                    fontWeight: 400,
                    color: 'text.secondary',
                  }}
                >
                  {description}
                </Typography>
              )}
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
