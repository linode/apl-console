import MuiAutocomplete from '@mui/material/Autocomplete'
import React, { JSX, useState } from 'react'

import type { AutocompleteProps, AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import ArrowDropDownIcon from '@mui/icons-material/ExpandMore'
import { TextField } from './TextField'

import type { TextFieldProps } from './TextField'

export interface EnhancedAutocompleteProps<
  T extends { label: string },
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
> extends Omit<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> {
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
    errorText = '',
    helperText,
    label,
    limitTags = 2,
    loading = false,
    loadingText,
    noOptionsText,
    onBlur,
    options,
    placeholder,
    renderInput,
    textFieldProps,
    value,
    onChange,
    ...rest
  } = props
  const [inPlaceholder, setInPlaceholder] = useState('')

  return (
    <MuiAutocomplete
      options={options}
      renderInput={
        renderInput ||
        ((params) => (
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
              sx: {
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                paddingRight: '44px',
              },
            }}
            InputLabelProps={{
              ...textFieldProps?.InputLabelProps,
            }}
          />
        ))
      }
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
      popupIcon={<ArrowDropDownIcon />}
      value={value}
      {...rest}
      onChange={onChange}
    />
  )
}
