// next
// config
import Cookies from 'js-cookie'
import { cookiesKey, defaultSettings } from '../config'

// ----------------------------------------------------------------------

export const getSettings = () => {
  const themeView = getData(Cookies.get(cookiesKey.themeView)) || defaultSettings.themeView

  const themeMode = getData(Cookies.get(cookiesKey.themeMode)) || defaultSettings.themeMode

  const themeColorPresets = getData(Cookies.get(cookiesKey.themeColorPresets)) || defaultSettings.themeColorPresets

  const themeLayout = getData(Cookies.get(cookiesKey.themeLayout)) || defaultSettings.themeLayout

  const themeContrast = getData(Cookies.get(cookiesKey.themeContrast)) || defaultSettings.themeContrast

  const themeStretch = getData(Cookies.get(cookiesKey.themeStretch)) || defaultSettings.themeStretch

  return {
    themeView,
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
