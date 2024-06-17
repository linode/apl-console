/* eslint-disable import/prefer-default-export */

import { SettingsValueProps } from 'components/SettingsType'

// ---- statics --------------------------------
export const HEADER = {
  MOBILE_HEIGHT: 64,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 92,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
}

export const NAVBAR = {
  BASE_WIDTH: 260,
  DASHBOARD_WIDTH: 280,
  DASHBOARD_COLLAPSE_WIDTH: 88,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 48,
  DASHBOARD_ITEM_SUB_HEIGHT: 40,
  DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
}

export const ICON = {
  NAVBAR_ITEM: 22,
  NAVBAR_ITEM_HORIZONTAL: 20,
}

// ---- cookies --------------------------------

export const cookiesExpires = 3

export const cookiesKey = {
  themeView: 'themeView',
  themeMode: 'themeMode',
  themeLayout: 'themeLayout',
  themeStretch: 'themeStretch',
  themeContrast: 'themeContrast',
  themeColorPresets: 'themeColorPresets',
}

export const defaultSettings: SettingsValueProps = {
  themeView: 'platform',
  themeMode: 'dark',
  themeContrast: 'default',
  themeLayout: 'horizontal',
  themeColorPresets: 'blue',
  themeStretch: false,
}
