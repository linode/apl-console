// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { FieldValues } from 'react-hook-form'
import { Slider } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import { SliderElementProps } from 'react-hook-form-mui'
import { styled } from '@mui/system'

const CustomSlider = styled(Slider)(({ thumbSize, thumbColor }) => ({
  '& .MuiSlider-thumb': {
    width: thumbSize,
    height: thumbSize,
    backgroundColor: thumbColor,
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: `0 0 0 8px rgba(0, 0, 0, 0.08)`,
    },
  },
  '& .MuiSlider-rail': {
    height: 8,
    background: 'linear-gradient(to right, #4E49B2, #57A97B)',
    opacity: 1,
  },
  '& .MuiSlider-track': {
    background: 'none',
  },
}))

function ValueLabelComponent(props) {
  const { children, value } = props
  const serverA = value
  const serverB = 100 - value

  return (
    <Tooltip enterTouchDelay={0} placement='top' title={`Server A: ${serverA}% - Server B: ${serverB}%`}>
      {children}
    </Tooltip>
  )
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  value: PropTypes.number.isRequired,
}

export default function RHFSlider<TFieldValues extends FieldValues>({ ...other }: SliderElementProps<TFieldValues>) {
  const [sliderValue, setSliderValue] = useState(50)
  const sliderRef = useRef(null)

  const handleSliderChange = (event, value) => {
    setSliderValue(value)
  }

  const getThumbSize = (value) => {
    const minSize = 14
    const maxSize = 22
    if (value < 50) return minSize + ((50 - value) / 50) * (maxSize - minSize)

    return minSize + ((value - 50) / 50) * (maxSize - minSize)
  }

  const blendColors = (value) => {
    const blue = Math.round((value / 100) * 255)
    const green = Math.round((1 - value / 100) * 255)
    return `rgb(0, ${green}, ${blue})`
  }

  const updateTrackColor = (value) => {
    const railElement = sliderRef.current.querySelector('.MuiSlider-rail')
    if (railElement) railElement.style.background = `linear-gradient(to right, #4E49B2 ${value}%, #57A97B ${value}%)`
  }

  useEffect(() => {
    const thumbSize = getThumbSize(sliderValue)
    const thumbColor = blendColors(sliderValue)
    const thumbElement = sliderRef.current.querySelector('.MuiSlider-thumb')
    if (thumbElement) {
      thumbElement.style.width = `${thumbSize}px`
      thumbElement.style.height = `${thumbSize}px`
      thumbElement.style.backgroundColor = thumbColor
      thumbElement.style.boxShadow = `${thumbColor} !important`
    }
    updateTrackColor(sliderValue)
  }, [sliderValue])

  return (
    <CustomSlider
      {...other}
      ref={sliderRef}
      value={sliderValue}
      onChange={(e, value) => {
        handleSliderChange(e, value)
        if (other.onChange) other.onChange(e, value)
      }}
      thumbSize={`${getThumbSize(sliderValue)}px`}
      thumbColor={blendColors(sliderValue)}
      ValueLabelComponent={ValueLabelComponent}
      valueLabelDisplay='auto'
    />
  )
}
