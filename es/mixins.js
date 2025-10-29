var _excluded = ["border", "invalid", "focused", "disabled", "within"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

import { isDarkMode } from './utils';
import theme, { fontSizes } from './variables';
export var focusBoxShadow = function focusBoxShadow() {
  var {
    invalid,
    space = 2,
    outline = 2,
    inset = false
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var outlineColor = invalid ? theme.colors.error : theme.colors.focus;
  return "0 0 0 ".concat(space, "px ").concat(theme.colors.background, ", 0 0 0 ").concat(space + outline, "px ").concat(outlineColor, " ").concat(inset ? 'inset' : '');
};

var focusMixin = function focusMixin() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      {
    border,
    invalid,
    focused,
    disabled,
    within
  } = _ref,
      boxShadowProps = _objectWithoutProperties(_ref, _excluded);

  var focusedProperties = _objectSpread({
    outline: 'none',
    transition: 'box-shadow 300ms ease',
    boxShadow: focusBoxShadow(_objectSpread({
      invalid
    }, boxShadowProps))
  }, border && !disabled ? {
    borderColor: invalid ? theme.colors.error : theme.colors.focus
  } : {});

  return _objectSpread(_objectSpread({}, focused ? focusedProperties : {}), {}, {
    ["&:focus".concat(within ? '-within' : '-visible')]: _objectSpread({}, focusedProperties)
  });
};

var errorMixin = _ref2 => {
  var {
    compact
  } = _ref2;
  return {
    color: theme.colors.error,
    fontSize: fontSizes[compact ? 1 : 2]
  };
};

var linkMixin = _ref3 => {
  var {
    disabled
  } = _ref3;
  return {
    display: 'inline-block',
    color: disabled ? theme.colors.gray[4] : theme.colors.link,
    transition: 'all 150ms ease',
    cursor: disabled ? 'default !important' : 'pointer',
    '& svg': {
      fill: 'currentColor'
    },
    '&:hover': {
      color: disabled ? theme.colors.gray[4] : isDarkMode() ? theme.colors.orange[3] : theme.colors.blue[2],
      '& svg': {
        fill: 'currentColor'
      }
    },
    '&:active': {
      color: disabled ? theme.colors.gray[4] : isDarkMode() ? theme.colors.orange[3] : theme.colors.blue[2],
      outline: 'none',
      '& svg': {
        fill: 'currentColor'
      }
    },
    '&:focus': {
      color: disabled ? theme.colors.gray[4] : theme.colors.blue[5]
    }
  };
};

var shadowMixin = function shadowMixin() {
  var _opacity, _blur;

  var {
    x = 2,
    y = 4,
    spread = 0,
    blur,
    opacity
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  opacity = (_opacity = opacity) !== null && _opacity !== void 0 ? _opacity : isDarkMode() ? 0.4 : 0.15;
  blur = (_blur = blur) !== null && _blur !== void 0 ? _blur : isDarkMode() ? 9 : 20;
  return {
    boxShadow: "".concat(x, "px ").concat(y, "px ").concat(blur, "px ").concat(spread, " rgba(0,0,0,").concat(opacity, ")")
  };
};

var inputMixin = _ref4 => {
  var {
    invalid,
    disabled,
    radius,
    color,
    inline,
    compact
  } = _ref4;
  return {
    fontFamily: theme.fontFamily,
    fontSize: compact ? 1 : 2,
    outline: 'none',
    color: color || theme.colors.gray[1],
    opacity: disabled ? 0.5 : 1,
    backgroundColor: disabled ? theme.colors.gray[8] : inline ? 'transparent' : theme.colors.white,
    borderWidth: '1px',
    borderStyle: inline ? 'none' : 'solid',
    borderColor: invalid && !disabled ? theme.colors.error : theme.colors.gray[isDarkMode() ? 4 : 5],
    borderRadius: radius !== null && radius !== void 0 ? radius : theme.radii[2],
    transition: 'border-color 0.2s ease',
    '&:hover': _objectSpread({}, disabled ? {} : {
      borderColor: invalid ? theme.colors.error : theme.colors.focus
    }),
    '&:active': _objectSpread({}, disabled ? {} : {
      borderColor: invalid ? theme.colors.error : theme.colors.focus
    }),
    '&::placeholder': {
      color: theme.colors.gray[isDarkMode() ? 4 : 4]
    }
  };
};

export default {
  focus: focusMixin,
  error: errorMixin,
  shadow: shadowMixin,
  link: linkMixin,
  input: inputMixin
};