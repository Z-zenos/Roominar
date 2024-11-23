export const Colors = [
  'purple-main',
  'purple-sub',
  'light-main',
  'light-sub',
  'gray-main',
  'gray-sub',
  'blue-main',
  'blue-sub',
  'green-main',
  'green-sub',
  'dark-main',
  'dark-sub',
  'success-main',
  'success-sub',
  'info-main',
  'info-sub',
  'warning-main',
  'warning-sub',
  'error-main',
  'error-sub',
  'disable-main',
  'disable-sub',
  'white-main',
  'white-sub',
  'black-main',
  'black-sub',
  'hover-main',
  'hover-sub',
  'default-main',
  'default-sub',
] as const;

type Color = (typeof Colors)[number];

export const colors: {
  [k in Color]: string;
} = {
  'default-main': '#484855',
  'default-sub': '#d8d8ff',

  'info-main': '#246cff',
  'info-sub': '#d8fcff',

  'error-main': '#d84800',
  'error-sub': '#fcd8aa',

  'success-main': '#249055',
  'success-sub': '#d8fcff',

  'warning-main': '#fcb400',
  'warning-sub': '#fcfcaa',

  'purple-main': '#7f56d9',
  'purple-sub': '#efeeef',
  'dark-main': '#101828',
  'dark-sub': '#363636',
  'light-main': '#838383',
  'light-sub': '#838383',
  'gray-main': '#d9dde3',
  'gray-sub': '#f4ebff',
  'blue-main': '#0056D2',
  'blue-sub': '#f0f5ff',
  'green-main': '#00a973',
  'green-sub': '#e8f9f3',
  'disable-main': '#B5B5B5',
  'disable-sub': '#B5B5B5',
  'white-main': '#FFFFFF',
  'white-sub': '#FFFFFF',
  'black-main': '#000000',
  'black-sub': '#000000',
  'hover-main': '#D9D9D9',
  'hover-sub': '#D9D9D9',
} as const;
