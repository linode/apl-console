import {
  useRadioGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControlLabelProps,
  makeStyles,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(() => ({
  labelChecked: {},
  lastItem: {
    marginRight: 0,
  },
}))

interface Props {
  disabled: boolean
  channel: string
  setChannel: CallableFunction
}

interface LabelProps extends FormControlLabelProps {
  value: any
}

function MyFormControlLabel(props: LabelProps) {
  const classes = useStyles()
  const radioGroup = useRadioGroup()

  let checked = false

  if (radioGroup) {
    checked = radioGroup.value === props.value
  }

  return (
    <FormControlLabel
      classes={{
        label: checked ? classes.labelChecked : '',
      }}
      {...props}
    />
  )
}

export default ({ channel, setChannel, disabled }: Props): React.ReactElement => {
  const classes = useStyles()
  return (
    <RadioGroup
      row
      onChange={(event) => {
        setChannel(event)
      }}
      name='use-radio-group'
      defaultValue={channel}
    >
      <MyFormControlLabel disabled={disabled} value='alpha' label='alpha' control={<Radio />} />
      <MyFormControlLabel disabled={disabled} value='beta' label='beta' control={<Radio />} />
      <MyFormControlLabel
        disabled={disabled}
        className={classes.lastItem}
        value='stable'
        label='stable'
        control={<Radio />}
      />
    </RadioGroup>
  )
}
