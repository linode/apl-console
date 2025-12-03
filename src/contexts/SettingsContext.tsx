/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-no-constructed-context-values */
import Cookies from 'js-cookie'
import React, { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from 'react'
import getColorPresets, { colorPresets, defaultPreset } from 'utils/getColorPresets'
import {
  SettingsContextProps,
  SettingsValueProps,
  ThemeColorPresets,
  ThemeContrast,
  ThemeLayout,
  ThemeMode,
  ThemeView,
} from 'components/SettingsType'
import { cookiesExpires, cookiesKey, defaultSettings } from '../config'

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  // View
  onToggleView: () => {},
  onChangeView: () => {},
  // Mode
  onToggleMode: () => {},
  onChangeMode: () => {},

  // Layout
  onToggleLayout: () => {},
  onChangeLayout: () => {},

  // Contrast
  onToggleContrast: () => {},
  onChangeContrast: () => {},

  // Color
  onChangeColor: () => {},
  setColor: defaultPreset,
  colorOption: [],

  // Stretch
  onToggleStretch: () => {},

  // Reset
  onResetSetting: () => {},
}

const SettingsContext = createContext(initialState)

// ----------------------------------------------------------------------

type SettingsProviderProps = {
  children: ReactNode
  defaultSettings: SettingsValueProps
}

function SettingsProvider({ children, defaultSettings }: SettingsProviderProps) {
  const [settings, setSettings] = useSettingCookies(defaultSettings)

  // View

  const onToggleView = () => {
    setSettings({
      ...settings,
      themeView: settings.themeView === 'platform' ? 'team' : 'platform',
    })
  }

  const onChangeView = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeView: (event.target as HTMLInputElement).value as ThemeView,
    })
  }

  // Mode

  const onToggleMode = () => {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(settings.themeMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setSettings({
      ...settings,
      themeMode: modes[nextIndex],
    })
  }

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    })
  }

  // Layout

  const onToggleLayout = () => {
    setSettings({
      ...settings,
      themeLayout: settings.themeLayout === 'vertical' ? 'horizontal' : 'vertical',
    })
  }

  const onChangeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeLayout: (event.target as HTMLInputElement).value as ThemeLayout,
    })
  }

  // Contrast

  const onToggleContrast = () => {
    setSettings({
      ...settings,
      themeContrast: settings.themeContrast === 'default' ? 'bold' : 'default',
    })
  }

  const onChangeContrast = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeContrast: (event.target as HTMLInputElement).value as ThemeContrast,
    })
  }

  // Color

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeColorPresets: (event.target as HTMLInputElement).value as ThemeColorPresets,
    })
  }

  // Stretch

  const onToggleStretch = () => {
    setSettings({
      ...settings,
      themeStretch: !settings.themeStretch,
    })
  }

  // Reset

  const onResetSetting = () => {
    setSettings({
      themeView: initialState.themeView,
      themeMode: initialState.themeMode,
      themeLayout: initialState.themeLayout,
      themeStretch: initialState.themeStretch,
      themeContrast: initialState.themeContrast,
      themeColorPresets: initialState.themeColorPresets,
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        // View
        onToggleView,
        onChangeView,

        // Mode
        onToggleMode,
        onChangeMode,

        // Layout
        onToggleLayout,
        onChangeLayout,

        // Contrast
        onChangeContrast,
        onToggleContrast,

        // Stretch
        onToggleStretch,

        // Color
        onChangeColor,
        setColor: getColorPresets(settings.themeColorPresets),
        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),

        // Reset
        onResetSetting,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsProvider, SettingsContext }

// ----------------------------------------------------------------------

function useSettingCookies(
  defaultSettings: SettingsValueProps,
): [SettingsValueProps, Dispatch<SetStateAction<SettingsValueProps>>] {
  const [settings, setSettings] = useState<SettingsValueProps>(defaultSettings)

  const onChangeSetting = () => {
    Cookies.set(cookiesKey.themeView, settings.themeView, { expires: cookiesExpires })

    Cookies.set(cookiesKey.themeMode, settings.themeMode, { expires: cookiesExpires })

    Cookies.set(cookiesKey.themeColorPresets, settings.themeColorPresets, {
      expires: cookiesExpires,
    })

    Cookies.set(cookiesKey.themeLayout, settings.themeLayout, {
      expires: cookiesExpires,
    })

    Cookies.set(cookiesKey.themeContrast, settings.themeContrast, {
      expires: cookiesExpires,
    })

    Cookies.set(cookiesKey.themeStretch, JSON.stringify(settings.themeStretch), {
      expires: cookiesExpires,
    })
  }

  useEffect(() => {
    onChangeSetting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings])

  return [settings, setSettings]
}
