import React from 'react'
// ----------------------------------------------------------------------

type ColorVariants = {
  name: string
  lighter: string
  light: string
  main: string
  dark: string
  darker: string
  contrastText: string
}

export type ThemeView = 'platform' | 'team'
export type ThemeMode = 'light' | 'dark' | 'system'
export type ThemeContrast = 'default' | 'bold'
export type ThemeLayout = 'vertical' | 'horizontal'
export type ThemeColorPresets = 'default' | 'purple' | 'cyan' | 'blue' | 'orange' | 'red'
export type ThemeStretch = boolean

export type SettingsValueProps = {
  themeView: ThemeView
  themeMode: ThemeMode
  themeLayout: ThemeLayout
  themeStretch: ThemeStretch
  themeContrast: ThemeContrast
  themeColorPresets: ThemeColorPresets
}

export type SettingsContextProps = {
  themeView: ThemeView
  themeMode: ThemeMode
  themeLayout: ThemeLayout
  themeContrast: ThemeContrast
  themeColorPresets: ThemeColorPresets
  themeStretch: boolean
  setColor: ColorVariants
  colorOption: {
    name: string
    value: string
  }[]

  // View
  onToggleView: VoidFunction
  onChangeView: (event: React.ChangeEvent<HTMLInputElement>) => void

  // Mode
  onToggleMode: VoidFunction
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void

  // Layout
  onToggleLayout: VoidFunction
  onChangeLayout: (event: React.ChangeEvent<HTMLInputElement>) => void

  // Contrast
  onToggleContrast: VoidFunction
  onChangeContrast: (event: React.ChangeEvent<HTMLInputElement>) => void

  // Color
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void

  // Stretch
  onToggleStretch: VoidFunction

  // Reset
  onResetSetting: VoidFunction
}
