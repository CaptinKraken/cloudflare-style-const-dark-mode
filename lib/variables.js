"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setColorOverride = exports.revertColorOverrides = exports.fontSizes = exports.default = void 0;

var _utils = require("./utils");

var _light = _interopRequireDefault(require("./colors/light"));

var _dark = _interopRequireDefault(require("./colors/dark"));

var _mixins = _interopRequireDefault(require("./mixins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var colorScales = ['red', 'orange', 'gold', 'green', 'cyan', 'blue', 'indigo', 'violet', 'pink', 'gray'];
var colors = {
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
}; // Ensure that the type consists of only colors that appear in both light
// and dark modes

var lightColorOverrides = {};
var darkColorOverrides = {}; // Create getters for the colors that will change between dark and light mode.
// This assumes lightColors and darkColors will contain the same set of
// properties.

Object.keys(_light.default).forEach(function (key) {
  Object.defineProperty(colors, key, {
    get: function get() {
      var darkMode = (0, _utils.isDarkMode)();
      var colors = darkMode ? _dark.default[key] : _light.default[key];
      var colorOverrides = darkMode ? darkColorOverrides : lightColorOverrides;
      var overrides = colorOverrides === null || colorOverrides === void 0 ? void 0 : colorOverrides[key]; // TODO Make more efficient by caching the merged array rather than
      // continually recreating it

      if (overrides !== null && overrides !== void 0 && overrides.length) {
        var colorsWithOverrides = _toConsumableArray(colors);

        overrides.forEach(function (color, index) {
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

var setColorOverride = function setColorOverride(color, index, value) {
  var colorOverrides = (0, _utils.isDarkMode)() ? darkColorOverrides : lightColorOverrides;

  if (value) {
    if (!colorOverrides[color]) {
      colorOverrides[color] = [];
    }

    colorOverrides[color][index] = value;
  } else {
    var _colorOverrides$color;

    (_colorOverrides$color = colorOverrides[color]) === null || _colorOverrides$color === void 0 ? true : delete _colorOverrides$color[index];
  }
};

exports.setColorOverride = setColorOverride;

var revertColorOverrides = function revertColorOverrides() {
  var colorOverrides = (0, _utils.isDarkMode)() ? darkColorOverrides : lightColorOverrides;
  Object.keys(colorOverrides).forEach(function (key) {
    return delete colorOverrides[key];
  });
};

exports.revertColorOverrides = revertColorOverrides;
var fontSizes = [10, 12, 14, 16, 20, 24, 32, 48, 64, 80];
exports.fontSizes = fontSizes;
var theme = {
  modeTransitionTime: _utils.modeTransitionTime,
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
  fontSizes: fontSizes,
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
  colors: colors,
  mixins: _mixins.default,
  fontSize: '15px',
  boxShadow: '0 0 20px 0 rgba(136,136,136,0.50)',
  inputFontSize: '13px',
  lineHeight: 1.5,
  inputLineHeight: 1.4,
  inputHeight: '2.26667rem',
  em: '1em',
  rem: '1rem',
  fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, "Helvetica Neue",  Arial, sans-serif',
  weightLight: 300,
  weightNormal: 400,
  weightSemiBold: 600,
  weightBold: 700,
  fontWeight: 400,
  fontWeightLight: 300,
  borderRadius: "2px",
  zIndexMax: 1000,
  zIndexModal: 1400
};
var _default = theme;
exports.default = _default;