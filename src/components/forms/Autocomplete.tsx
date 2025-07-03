// @ts-nocheck

/**
 * ^^^^^^^^^^^^^
 *
 * remove this
 *
 *
 *
 *
 *
 */

import MuiAutocomplete from '@mui/material/Autocomplete'
import React, { JSX, useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ExpandMore'

import type { AutocompleteProps, AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
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
  /** Optional field to hide label, mostly used in Key value components */
  hideLabel?: boolean
  /** Removes the top margin from the input label, if desired. */
  noMarginTop?: boolean
  /** Element to show when the Autocomplete search yields no results. */
  noOptionsText?: JSX.Element | string
  placeholder?: string
  renderInput?: (_params: AutocompleteRenderInputParams) => React.ReactNode
  /** Label for the "select all" option. */
  selectAllLabel?: string
  /** Removes the "select all" option for multiselect */
  disableSelectAll?: boolean
  textFieldProps?: Partial<TextFieldProps>
  width?: 'small' | 'medium' | 'large'
}

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
    hideLabel = false,
    label,
    limitTags = 2,
    loading = false,
    loadingText,
    multiple,
    disableSelectAll = false,
    noOptionsText,
    onBlur,
    options,
    placeholder,
    renderInput,
    selectAllLabel = '',
    textFieldProps,
    value,
    onChange,
    width = 'medium',
    ...rest
  } = props

  const [inPlaceholder, setInPlaceholder] = useState('')

  // --- select-all logic ---
  const isSelectAllActive = multiple && Array.isArray(value) && value.length === options.length

  const selectAllText = isSelectAllActive ? 'Deselect All' : 'Select All'
  const selectAllOption = { label: `${selectAllText} ${selectAllLabel}` } as T
  const optionsWithSelectAll = [selectAllOption, ...options]

  const handleChange = (e: React.SyntheticEvent, newValue: T | T[], reason: any, details?: any) => {
    if (!onChange) return

    // if they clicked the "Select All" option
    if (details?.option === selectAllOption) {
      if (isSelectAllActive) onChange(e, [] as T[] as typeof newValue, reason, details)
      else onChange(e, options as typeof newValue, reason, details)
    } else onChange(e, newValue, reason, details)
  }
  // --------------------------

  return (
    <MuiAutocomplete
      options={multiple && !disableSelectAll && options.length > 0 ? optionsWithSelectAll : options}
      multiple={multiple}
      disableCloseOnSelect={multiple}
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
      renderInput={
        renderInput ||
        ((params) => (
          <TextField
            hideLabel={hideLabel}
            label={label}
            width={width}
            loading={loading}
            placeholder={inPlaceholder || placeholder || 'Select an option'}
            {...params}
            error={!!errorText}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              ...textFieldProps?.InputProps,
              sx: {
                // overflow: 'hidden',
                // whiteSpace: 'nowrap',
                // textOverflow: 'ellipsis',
                // paddingRight: '44px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1, // small gap between chips
                paddingRight: '44px',
              },
            }}
            InputLabelProps={{
              ...textFieldProps?.InputLabelProps,
            }}
          />
        ))
      }
      value={value}
      onChange={handleChange}
      {...rest}
    />
  )
}
