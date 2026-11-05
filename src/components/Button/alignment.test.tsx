import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import LoadingButton from '@mui/material/Button'
import { useForm } from 'react-hook-form'
import palette from '../../theme/palette'
import font from '../../theme/font'
import shadows, { customShadows } from '../../theme/shadows'
import componentsOverride from '../../theme/overrides'
import SubmitButton from '../SubmitButton'
import HelpButton from '../HelpButton'
import ButtonGroup from '../ButtonGroup'
import ImgButtonGroup from '../ImgButtonGroup'
import { IconButton } from '../IconButton'
import { Button } from './Button'
import { StyledActionButton } from './StyledActionButton'
import { StyledTagButton } from './StyledTagButton'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

function styleRules(rules: CSSRuleList): CSSStyleRule[] {
  return Array.from(rules).flatMap((rule) => {
    if (rule.type === CSSRule.STYLE_RULE) return [rule as CSSStyleRule]
    if ('cssRules' in rule) return styleRules((rule as CSSGroupingRule).cssRules)
    return []
  })
}

function styleValues(element: HTMLElement, property: string, hover = false) {
  // JSDOM incorrectly applies some compound :hover selectors to computed styles.
  return Array.from(document.styleSheets)
    .flatMap((sheet) => styleRules(sheet.cssRules))
    .filter((rule) => !rule.selectorText.includes('::'))
    .filter(
      (rule) =>
        rule.selectorText.includes(':hover') === hover && element.matches(rule.selectorText.replace(/:hover/g, '')),
    )
    .map((rule) => rule.style.getPropertyValue(property).replace(/\s/g, ''))
}

describe.each(['light', 'dark'] as const)('%s button alignment', (mode) => {
  const theme = createTheme({
    palette: palette[mode],
    font,
    shadows: shadows[mode],
    customShadows: customShadows[mode],
  })
  theme.components = componentsOverride(theme)

  test('uses the application font and blue contained primary styles', () => {
    render(
      <ThemeProvider theme={theme}>
        <SubmitButton />
        <HelpButton href='https://example.com' />
        <Button buttonType='primary'>primary</Button>
      </ThemeProvider>,
    )
    ;['submit', 'Read the documentation', 'primary'].forEach((name) => {
      const button = screen.getByRole(name === 'Read the documentation' ? 'link' : 'button', { name })
      expect(styleValues(button, 'font-family')).toContain(theme.font.normal.replace(/\s/g, ''))
      expect(styleValues(button, 'background-color')).toContain(theme.palette.cm.linkActiveLight)
      expect(styleValues(button, 'color')).toContain(theme.palette.primary.contrastText)
      expect(styleValues(button, 'background-color', true)).toContain(theme.palette.cm.buttonPrimaryHover)
    })
  })

  test.each(['error', 'secondary', 'success', 'warning', 'info'] as const)(
    'preserves explicit %s palette colors',
    (color) => {
      render(
        <ThemeProvider theme={theme}>
          <SubmitButton color={color} />
          <HelpButton color={color} href='https://example.com' />
          <Button color={color}>semantic</Button>
          <StyledActionButton color={color}>action</StyledActionButton>
          <StyledTagButton color={color}>tag</StyledTagButton>
          <IconButton color={color}>icon</IconButton>
        </ThemeProvider>,
      )
      ;['submit', 'Read the documentation', 'semantic', 'action', 'tag'].forEach((name) => {
        const button = screen.getByRole(name === 'Read the documentation' ? 'link' : 'button', { name })
        expect(styleValues(button, '--variant-containedBg')).toContain(theme.palette[color].main)
        expect(styleValues(button, 'background-color')).not.toContain(theme.palette.cm.linkActiveLight)
        expect(styleValues(button, '--variant-containedColor')).toContain(theme.palette[color].contrastText)
        expect(styleValues(button, '--variant-containedBg', true)).toContain(theme.palette[color].dark)
        expect(styleValues(button, 'background-color', true)).not.toContain(theme.palette.cm.buttonPrimaryHover)
      })
      expect(screen.getByRole('button', { name: 'icon' })).toHaveStyle({ color: theme.palette[color].main })
    },
  )

  test('preserves outlined semantic colors and caller sx composition', () => {
    render(
      <ThemeProvider theme={theme}>
        <Button buttonType='outlined' color='error'>
          outlined
        </Button>
        <ButtonGroup
          loading={false}
          disabled={false}
          resourceName='test'
          resourceType='test'
          onDelete={jest.fn()}
          sx={[{ borderRadius: '6px' }, (currentTheme) => ({ backgroundColor: currentTheme.palette.error.main })]}
        />
      </ThemeProvider>,
    )

    expect(styleValues(screen.getByRole('button', { name: 'outlined' }), '--variant-outlinedColor')).toContain(
      theme.palette.error.main,
    )
    expect(screen.getByRole('group')).toHaveStyle({ borderRadius: '6px', backgroundColor: theme.palette.error.main })
  })

  test.each(['start', 'end'] as const)('aligns text loading buttons with a %s icon', (position) => {
    const onClick = jest.fn()
    const { rerender } = render(
      <ThemeProvider theme={theme}>
        <LoadingButton
          loading
          loadingPosition={position}
          startIcon={position === 'start' ? <span>Start</span> : undefined}
          endIcon={position === 'end' ? <span>End</span> : undefined}
          onClick={onClick}
        >
          Save
        </LoadingButton>
      </ThemeProvider>,
    )
    const button = screen.getByRole('button', { name: /Save/ })
    expect(button).toBeDisabled()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    const icon = button.querySelector<HTMLElement>(`.MuiButton-${position}Icon`)
    expect(styleValues(icon, position === 'start' ? 'margin-left' : 'margin-right')).toContainEqual(
      expect.stringMatching(/^0(px)?$/),
    )
    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()

    rerender(
      <ThemeProvider theme={theme}>
        <LoadingButton loading={false} onClick={onClick}>
          Save
        </LoadingButton>
      </ThemeProvider>,
    )
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  test('preserves image button disabled click handling without new attributes', () => {
    const onChange = jest.fn()
    function ImageButtons() {
      const { control } = useForm()
      return (
        <ImgButtonGroup
          control={control}
          name='image'
          value='one'
          options={[{ value: 'one', label: 'One' }]}
          disabled
          onChange={onChange}
        />
      )
    }

    render(
      <ThemeProvider theme={theme}>
        <ImageButtons />
      </ThemeProvider>,
    )
    const button = screen.getByRole('button', { name: 'One' })
    expect(button).not.toHaveAttribute('disabled')
    expect(button).not.toHaveAttribute('aria-pressed')
    fireEvent.click(button)
    expect(onChange).not.toHaveBeenCalled()
  })
})
