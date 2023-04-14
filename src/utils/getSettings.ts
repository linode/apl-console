// next
// config
import { cookiesKey, defaultSettings } from '../config'

// ----------------------------------------------------------------------

export const getSettings = (cookies) => {
  const themeMode = getData(cookies[cookiesKey.themeMode] as string) || defaultSettings.themeMode

  const themeColorPresets =
    getData(cookies[cookiesKey.themeColorPresets] as string) || defaultSettings.themeColorPresets

  const themeLayout = getData(cookies[cookiesKey.themeLayout] as string) || defaultSettings.themeLayout

  const themeContrast = getData(cookies[cookiesKey.themeContrast] as string) || defaultSettings.themeContrast

  const themeStretch = getData(cookies[cookiesKey.themeStretch] as string) || defaultSettings.themeStretch

  return {
    themeMode,
    themeLayout,
    themeStretch,
    themeContrast,
    themeColorPresets,
  }
}

// ----------------------------------------------------------------------

const getData = (value: string) => {
  if (value === 'true' || value === 'false') return JSON.parse(value)

  if (value === 'undefined' || !value) return ''

  return value
}
