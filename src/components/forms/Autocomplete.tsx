import MuiAutocomplete from '@mui/material/Autocomplete'
import React, { JSX, useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ExpandMore'

import type {
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteProps,
  AutocompleteRenderInputParams,
} from '@mui/material/Autocomplete'
import { TextField } from './TextField'
import type { TextFieldProps } from './TextField'

export interface EnhancedAutocompleteProps<
  T,
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
  /** Hide placeholder and minimize input width when values are selected (for cleaner multi-select UX) */
  compactMultiSelect?: boolean
}

export function Autocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined,
>(props: EnhancedAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const {
    clearOnBlur,
    defaultValue,
    disablePortal = false,
    errorText = '',
    helperText,
    hideLabel = false,
    label,
    limitTags = 2,
    loading = false,
    loadingText,
    multiple,
    disableSelectAll = false,
    noMarginTop = false,
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
    compactMultiSelect = false,
    ...rest
  } = props

  const [inPlaceholder, setInPlaceholder] = useState('')

  // Check if there are selected values (for hiding placeholder when values exist)
  const hasValues = multiple ? Array.isArray(value) && value.length > 0 : !!value

  // --- select-all logic ---
  const isSelectAllActive = multiple && Array.isArray(value) && value.length === options.length

  const selectAllText = isSelectAllActive ? 'Deselect All' : 'Select All'
  const selectAllOption = { label: `${selectAllText} ${selectAllLabel}` } as unknown as T
  const optionsWithSelectAll = [selectAllOption, ...options]

  const handleChange: AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>['onChange'] = (
    e,
    newValue,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>,
  ) => {
    if (!onChange) return

    // if they clicked the "Select All" option
    if (details?.option === selectAllOption) {
      const next = isSelectAllActive ? ([] as unknown as typeof newValue) : (options as unknown as typeof newValue)
      onChange(e, next, reason, details)
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
            noMarginTop={noMarginTop}
            placeholder={compactMultiSelect && hasValues ? '' : inPlaceholder || placeholder || 'Select an option'}
            {...params}
            {...textFieldProps}
            error={!!errorText}
            helperText={helperText}
            InputProps={{
              ...params.InputProps,
              ...textFieldProps?.InputProps,
              sx: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                paddingRight: '44px',
                '& input': {
                  minWidth: compactMultiSelect && hasValues && multiple ? '30px !important' : undefined,
                  width: compactMultiSelect && hasValues && multiple ? '30px !important' : undefined,
                },
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
