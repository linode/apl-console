/* eslint-disable import/prefer-default-export */

import { SettingsValueProps } from 'components/SettingsType'

// ---- statics --------------------------------
export const HEADER = {
  MOBILE_HEIGHT: 50,
  MAIN_DESKTOP_HEIGHT: 88,
  DASHBOARD_DESKTOP_HEIGHT: 50,
  DASHBOARD_DESKTOP_OFFSET_HEIGHT: 92 - 32,
}

export const NAVBAR = {
  BASE_WIDTH: 200,
  DASHBOARD_WIDTH: 230,
  DASHBOARD_COLLAPSE_WIDTH: 50,
  //
  DASHBOARD_ITEM_ROOT_HEIGHT: 36,
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
  themeMode: 'system',
  themeContrast: 'default',
  themeLayout: 'horizontal',
  themeColorPresets: 'cyan',
  themeStretch: false,
}
