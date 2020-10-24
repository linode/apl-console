import {
  useRadioGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormControlLabelProps,
  makeStyles,
} from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles(theme => ({
  labelChecked: {},
  lastItem: {
    marginRight: 0,
  },
}))

interface Props {
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

export default ({ channel, setChannel }: Props): any => {
  const classes = useStyles()
  return (
    <RadioGroup
      row
      onChange={event => {
        setChannel(event)
      }}
      name='use-radio-group'
      defaultValue={channel}
    >
      <MyFormControlLabel value='alpha' label='alpha' control={<Radio />} />
      <MyFormControlLabel value='beta' label='beta' control={<Radio />} />
      <MyFormControlLabel className={classes.lastItem} value='stable' label='stable' control={<Radio />} />
    </RadioGroup>
  )
}
