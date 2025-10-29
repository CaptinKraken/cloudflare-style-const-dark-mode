import { ValueOfArray } from '@cloudflare/types';
import { isDarkMode } from './darkMode';
import lightColors from './colors/light';
import darkColors from './colors/dark';
import mixins from './mixins';

const colorScales = [
  'red',
  'orange',
  'gold',
  'green',
  'cyan',
  'blue',
  'indigo',
  'violet',
  'pink',
  'gray'
] as const;

export type ColorOnScale = (typeof colorScales)[number];

export type ThemeColor = {
  [K in ColorOnScale]: ValueOfArray<(typeof lightColors)[K]>;
}[ColorOnScale];

const colors = {
  cfOrange: '#F6821F',
  marketing: {
    orange: '#F6821F',
    lightOrange: '#FBAD41',
    red: '#e04e64',
    lightRed: '#e27179',
    green: '#71c492',
    lightGreen: '#9fd3b5',
    cyan: '#2da7cb',
    lightCyan: '#89c4e1',
    purple: '#7d4788',
    lightPurple: '#af7baf',
    blue: '#00517f',
    lightBlue: '#4f8cc8',
    gray: ['#404242', '#707070', '#aaaaaa', '#dddddd', '#f5f5f5'],
    black: '#222222'
  },
  vendor: {
    twitter: '#00aced',
    facebook: '#3b5998'
  }
};

// Ensure that the type consists of only colors that appear in both light
// and dark modes
type CommonColors = keyof typeof lightColors & keyof typeof darkColors;
type OnlyCommonColors =
  | Pick<typeof lightColors, CommonColors>
  | Pick<typeof darkColors, CommonColors>;

type MergedColors = typeof colors & OnlyCommonColors;

const lightColorOverrides: { [key: string]: string[] } = {};
const darkColorOverrides: { [key: string]: string[] } = {};

// Create getters for the colors that will change between dark and light mode.
// This assumes lightColors and darkColors will contain the same set of
// properties.
Object.keys(lightColors).forEach(key => {
  Object.defineProperty(colors, key, {
    get: function () {
      const darkMode = isDarkMode();
      const colors = darkMode
        ? darkColors[key as ColorOnScale]
        : lightColors[key as ColorOnScale];

      const colorOverrides = darkMode
        ? darkColorOverrides
        : lightColorOverrides;
      const overrides = colorOverrides?.[key];

      // TODO Make more efficient by caching the merged array rather than
      // continually recreating it
      if (overrides?.length) {
        const colorsWithOverrides = [...colors];
        overrides.forEach((color, index) => {
          if (color) {
            colorsWithOverrides[index] = overrides[index];
          }
        });
        return colorsWithOverrides;
      }

      return colors;
    },
    enumerable: true
  });
});

export const setColorOverride = (
  color: string,
  index: number,
  value?: string
) => {
  const colorOverrides = isDarkMode()
    ? darkColorOverrides
    : lightColorOverrides;

  if (value) {
    if (!colorOverrides[color]) {
      colorOverrides[color] = [];
    }

    colorOverrides[color][index] = value;
  } else {
    delete colorOverrides[color]?.[index];
  }
};

export const revertColorOverrides = () => {
  const colorOverrides = isDarkMode()
    ? darkColorOverrides
    : lightColorOverrides;

  Object.keys(colorOverrides).forEach(key => delete colorOverrides[key]);
};

export const fontSizes = [10, 12, 14, 16, 20, 24, 32, 48, 64, 80];

const theme = {
  breakpoints: {
    mobile: '218px',
    mobileWide: '487px',
    tablet: '755px',
    tabletLegacy: '788px',
    tabletWide: '880px',
    desktop: '1024px',
    desktopLegacy: '1056px',
    desktopLarge: '1562px'
  },
  fontSizes,
  space: [0, 4, 8, 16, 32, 64, 128, 256],
  radii: [0, 3, 5],
  measure: {
    narrow: '20em',
    default: '30em',
    wide: '34em'
  },
  lineHeights: {
    solid: 1,
    title: 1.25,
    copy: 1.5
  },
  gradient: {
    skyDew: 'linear-gradient(to right, #76C4E2, #85CBA8)',
    twilightDew: 'linear-gradient(to right, #8176B5, #85CBA8)',
    twilightSky: 'linear-gradient(to right, #8176B5, #76C4E2)',
    twilightSunset: 'linear-gradient(to right, #8176B5, #BA77B1)',
    twilightDawn: 'linear-gradient(to right, #8176B5, #F16975)',
    dawnSunrise: 'linear-gradient(to right, #F16975, #F69259)',
    sunriseLightning: 'linear-gradient(to right, #F69259, #FFDB6F)',
    dewLightning: 'linear-gradient(to right, #85CBA8, #FFDB6F)'
  },
  shadows: ['0 0 20px 0 rgba(136,136,136,0.50)'],

  colors: colors as MergedColors,
  mixins,

  fontSize: '15px',
  boxShadow: '0 0 20px 0 rgba(136,136,136,0.50)',
  inputFontSize: '13px',
  lineHeight: 1.5,
  inputLineHeight: 1.4,
  inputHeight: '2.26667rem',
  em: '1em',
  rem: '1rem',
  fontFamily:
    '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Helvetica Neue",  Arial, sans-serif',
  weightLight: 300,
  weightNormal: 400,
  weightSemiBold: 600,
  weightBold: 700,
  fontWeight: 400,
  fontWeightLight: 300,
  borderRadius: `2px`,
  zIndexMax: 1000,
  zIndexModal: 1400
} as const;

export default theme;
