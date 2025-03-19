import MuiAutocomplete from '@mui/material/Autocomplete'
import React, { JSX, useState } from 'react'

import type { AutocompleteProps, AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import ArrowDropUpIcon from '@mui/icons-material/ExpandLess'
import ArrowDropDownIcon from '@mui/icons-material/ExpandMore'
import { InputAdornment } from '@mui/material'
import { CircleProgress } from 'components/CircleProgress'
import { TextField } from './TextField'

import type { TextFieldProps } from './TextField'

export interface EnhancedAutocompleteProps<
  T extends { label: string },
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> {
  /** Removes "select all" option for multiselect */
  disableSelectAll?: boolean
  /** Provides a hint with error styling to assist users. */
  errorText?: string
  /** Provides a hint with normal styling to assist users. */
  helperText?: TextFieldProps['helperText']
  /** A required label for the Autocomplete to ensure accessibility. */
  label: string
  /** Removes the top margin from the input label, if desired. */
  noMarginTop?: boolean
  /** Element to show when the Autocomplete search yields no results. */
  noOptionsText?: JSX.Element | string
  placeholder?: string
  renderInput?: (_params: AutocompleteRenderInputParams) => React.ReactNode
  /** Label for the "select all" option. */
  selectAllLabel?: string
  textFieldProps?: Partial<TextFieldProps>
  setValue?: any
}

/**
 * An Autocomplete component that provides a user-friendly select input
 * allowing selection between options.
 *
 * @example
 * <Autocomplete
 *  label="Select a Fruit"
 *  onSelectionChange={(selected) => console.log(selected)}
 *  options={[
 *    {
 *      label: 'Apple',
 *      value: 'apple',
 *    }
 *  ]}
 * />
 */
export function Autocomplete<
  T extends { label: string },
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(props: EnhancedAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const {
    clearOnBlur,
    defaultValue,
    disablePortal = true,
    disableSelectAll = false,
    errorText = '',
    helperText,
    label,
    limitTags = 2,
    loading = false,
    loadingText,
    noMarginTop,
    noOptionsText,
    onBlur,
    onChange,
    options,
    placeholder,
    renderInput,
    renderOption,
    selectAllLabel = '',
    textFieldProps,
    value,
    setValue,
    ...rest
  } = props
  const [inPlaceholder, setInPlaceholder] = useState('')

  return (
    <MuiAutocomplete
      options={options}
      renderInput={
        renderInput ||
        ((params) => (
          // @ts-ignore
          <TextField
            label={label}
            width='medium'
            loading={loading}
            placeholder={inPlaceholder || (placeholder ?? 'Select an option')}
            {...params}
            error={!!errorText}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              ...textFieldProps?.InputProps,
              endAdornment: (
                <>
                  {loading && (
                    <InputAdornment position='end'>
                      <CircleProgress noPadding size='xs' />
                    </InputAdornment>
                  )}
                  {textFieldProps?.InputProps?.endAdornment}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        ))
      }
      ChipProps={{ deleteIcon: <ArrowDropUpIcon /> }}
      clearOnBlur={clearOnBlur}
      data-qa-autocomplete={label}
      defaultValue={defaultValue}
      disablePortal={disablePortal}
      limitTags={limitTags}
      loading={loading}
      loadingText={loadingText || 'Loading...'}
      noOptionsText={noOptionsText || <i>You have no options to choose from</i>}
      onBlur={onBlur}
      onOpen={() => setInPlaceholder('Search')}
      onClose={() => setInPlaceholder(placeholder || '')}
      popupIcon={<ArrowDropDownIcon data-testid='KeyboardArrowDownIcon' />}
      value={value}
      {...rest}
      onChange={(e, value, reason, details) => {
        console.log('auto value', value)
        setValue(value)
        onChange(e, value, reason, details)
      }}
    />
  )
}
