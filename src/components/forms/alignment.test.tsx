import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import { FormProvider, useForm } from 'react-hook-form'
import { Checkbox } from '../cmCheckbox/Checkbox'
import palette from '../../theme/palette'
import inputOverrides from '../../theme/overrides/Input'
import { TextField } from './TextField'
import { AutoResizableTextarea } from './TextArea'
import KeyValue from './KeyValue'
import { Autocomplete } from './Autocomplete'

function KeyValueForm() {
  const methods = useForm({ defaultValues: { entries: [{ name: 'cpu', value: '2' }] } })
  return (
    <FormProvider {...methods}>
      <KeyValue
        title='Resources'
        subTitle='Resource limits'
        name='entries'
        keyLabel='Name'
        valueLabel='Value'
        addLabel='Add resource'
        decoratorMapping={{ cpu: 'cores' }}
      />
    </FormProvider>
  )
}

describe.each(['light', 'dark'] as const)('%s form alignment', (mode) => {
  const theme = createTheme({ palette: palette[mode] } as ThemeOptions)
  theme.font = { normal: 'sans-serif', bold: 'sans-serif' }
  theme.components = inputOverrides(theme)

  it('uses a square, compact themed input and preserves trimming', () => {
    const onBlur = jest.fn()
    render(
      <ThemeProvider theme={theme}>
        <TextField id='name' label='Name' value=' initial ' trimmed onBlur={onBlur} />
      </ThemeProvider>,
    )
    const input = screen.getByRole('textbox', { name: 'Name' })
    expect(input.parentElement).toHaveStyle({ backgroundColor: theme.palette.cm.textBox })
    expect(input.parentElement).toHaveStyle({ borderColor: theme.palette.cm.textBoxBorder })
    expect(input.parentElement).toHaveStyle({ borderWidth: '1px', borderStyle: 'solid' })
    expect(input.parentElement).toHaveStyle({ borderRadius: '0', minHeight: '34px' })
    expect(input.parentElement).toHaveStyle({ fontFamily: theme.font.normal, fontWeight: 400 })
    // JSDOM ignores selector specificity across Emotion stylesheets.
    const compactRule = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules) as CSSStyleRule[])
      .find((rule) => rule.selectorText && rule.style.height === '32px' && input.matches(rule.selectorText))
    expect(compactRule?.style.getPropertyValue('box-sizing')).toBe('border-box')
    expect(compactRule?.style.getPropertyValue('padding-top')).toBe('6px')
    expect(compactRule?.style.getPropertyValue('padding-bottom')).toBe('6px')
    expect(screen.getByText('Name')).toHaveStyle({ fontFamily: theme.font.bold, fontWeight: 700 })
    fireEvent.blur(input)
    expect(input).toHaveValue('initial')
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('keeps error, success, focus, and disabled colors distinct', () => {
    render(
      <ThemeProvider theme={theme}>
        <TextField id='invalid' label='Invalid' errorText='Required value' focused className='affirmative' />
        <TextField id='valid' label='Valid' className='affirmative' />
        <TextField id='focused' label='Focused' focused />
        <TextField id='disabled' label='Disabled' disabled className='affirmative' />
      </ThemeProvider>,
    )
    expect(screen.getByRole('textbox', { name: 'Invalid' }).parentElement).toHaveStyle({
      borderColor: theme.palette.error.main,
    })
    expect(screen.getByRole('alert')).toHaveStyle({ color: theme.palette.error.main })
    expect(screen.getByRole('textbox', { name: 'Valid' }).parentElement).toHaveStyle({
      borderColor: theme.palette.success.main,
    })
    expect(screen.getByRole('textbox', { name: 'Focused' }).parentElement).toHaveStyle({
      borderColor: theme.palette.cm.linkActiveLight,
    })
    expect(screen.getByRole('textbox', { name: 'Disabled' })).toBeDisabled()
    expect(screen.getByRole('textbox', { name: 'Disabled' }).parentElement).toHaveStyle({
      borderColor: theme.palette.cm.disabledBorder,
    })
  })

  it('preserves multiline sizing and monospace for secret/code values', () => {
    render(
      <ThemeProvider theme={theme}>
        <TextField id='notes' label='Notes' multiline rows={3} value={'First\nSecond'} />
        <AutoResizableTextarea aria-label='Secret' value={'key=value\nother=value'} error onChange={jest.fn()} />
      </ThemeProvider>,
    )
    const notes = screen.getByRole('textbox', { name: 'Notes' })
    expect(notes.tagName).toBe('TEXTAREA')
    expect(notes).toHaveValue('First\nSecond')
    expect(notes).not.toHaveStyle({ height: '32px' })
    expect(notes.parentElement).not.toHaveStyle({ height: '34px' })
    expect(screen.getByRole('textbox', { name: 'Secret' })).toHaveStyle({
      fontFamily: 'monospace',
      backgroundColor: theme.palette.cm.textBox,
      borderColor: theme.palette.error.main,
      borderRadius: '0',
    })
  })

  it('keeps autocomplete tags wrapping without a fixed container height', () => {
    render(
      <ThemeProvider theme={theme}>
        <Autocomplete label='Options' multiple options={['First', 'Second']} value={['First', 'Second']} />
      </ThemeProvider>,
    )
    const input = screen.getByRole('combobox')
    expect(input.parentElement).toHaveStyle({ flexWrap: 'wrap', minHeight: '34px' })
    expect(input.parentElement).not.toHaveStyle({ height: '34px' })
    expect(screen.getByText('First')).toBeVisible()
    expect(screen.getByText('Second')).toBeVisible()
  })

  it('preserves key/value addition and themed decorators', () => {
    render(
      <ThemeProvider theme={theme}>
        <KeyValueForm />
      </ThemeProvider>,
    )
    expect(screen.getByText('Resource limits')).toHaveStyle({ color: theme.palette.text.secondary })
    expect(screen.getByText('cores').parentElement).toHaveStyle({
      borderLeft: `1px solid ${theme.palette.divider}`,
    })
    const add = screen.getByRole('button', { name: 'Add resource' })
    expect(add).toHaveStyle({ borderRadius: '1px' })
    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    fireEvent.click(add)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('themes uncontrolled and disabled checkboxes without changing interaction', () => {
    render(
      <ThemeProvider theme={theme}>
        <Checkbox text='Enabled option' />
        <Checkbox text='Disabled option' disabled defaultChecked />
      </ThemeProvider>,
    )
    const checkbox = screen.getByRole('checkbox', { name: 'Enabled option' })
    expect(checkbox).not.toBeChecked()
    fireEvent.click(checkbox)
    expect(checkbox).toBeChecked()
    expect(checkbox.parentElement).toHaveStyle({ color: theme.palette.cm.linkActiveLight })
    const disabled = screen.getByRole('checkbox', { name: 'Disabled option' })
    expect(disabled).toBeDisabled()
    expect(disabled).toBeChecked()
    expect(disabled.parentElement).toHaveStyle({ color: theme.palette.cm.disabledBorder })
  })
})
