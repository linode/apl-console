import _Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import * as React from 'react'

import CheckboxIcon from '../../assets/icons/checkbox'
import CheckboxCheckedIcon from '../../assets/icons/checkboxChecked'
import { FormControlLabel } from '../FormControlLabel'
import { TooltipIcon } from '../TooltipIcon'

interface Props extends CheckboxProps {
  /**
   * Styles applied to the `FormControlLabel`. Only works when `text` is defined.
   */
  sxFormLabel?: any
  /**
   * Renders a `FormControlLabel` that controls the underlying Checkbox with a label of `text`
   */
  text?: React.JSX.Element | string
  /**
   * Renders a tooltip to the right of the Checkbox
   */
  toolTipText?: React.JSX.Element | string
}

/**
 * ## Usage
 *
 * - Used when there are lists of options and the user may select any number of choices, including none, one, or many.
 * - A standalone checkbox is used for a single option that the user can turn on or off (i.e., accepting terms and conditions).
 *
 * ## Guidelines
 *
 * - Visually present groups of choices as groups, and clearly separate them from other groups on the same page.
 * - Lay out lists vertically, with one choice per line.
 * - Write checkbox labels so that users know what will happen if they check a particular box.
 * - Checkboxes often default to having none of the options selected.
 * - Changed settings should not take effect until the user clicks the action button.
 * - If the user clicks the Back button, any changes made to checkboxes should be discarded and the original settings reinstated.
 */
export function Checkbox(props: Props) {
  const { sxFormLabel, text, toolTipText, ...rest } = props

  const BaseCheckbox = (
    <StyledCheckbox
      checkedIcon={<CheckboxCheckedIcon />}
      color='primary'
      data-qa-checked={props.checked}
      icon={<CheckboxIcon />}
      {...rest}
    />
  )

  const CheckboxComponent = props.text ? (
    <StyledFormControlLabel control={BaseCheckbox} label={text} sx={sxFormLabel} />
  ) : (
    BaseCheckbox
  )

  return (
    <>
      {CheckboxComponent}
      {toolTipText ? <TooltipIcon status='help' text={toolTipText} /> : null}
    </>
  )
}

const StyledCheckbox = styled(_Checkbox)(({ theme, ...props }) => ({
  '& .defaultFill': {
    transition: theme.transitions.create(['fill']),
  },
  '&:hover': {
    color: theme.palette.primary.main,
  },
  color: '#ccc',
  transition: theme.transitions.create(['color']),
  ...(props.checked && {
    color: theme.palette.primary.main,
  }),
  ...(props.disabled && {
    '& .defaultFill': {
      fill: `${theme.palette.cm.bgmain}`,
      opacity: 0.5,
    },
    color: '#ccc !important',
    fill: `${theme.palette.cm.bgmain} !important`,
    pointerEvents: 'none',
  }),
}))

const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  marginRight: 0,
}))
