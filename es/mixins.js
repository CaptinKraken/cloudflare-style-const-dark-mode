var _excluded = ["border", "invalid", "focused", "disabled", "within"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import { isDarkMode } from './darkMode';
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
  var {
    x = 2,
    y = 4,
    spread = 0,
    blur,
    opacity
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  opacity = opacity !== null && opacity !== void 0 ? opacity : isDarkMode() ? 0.4 : 0.15;
  blur = blur !== null && blur !== void 0 ? blur : isDarkMode() ? 9 : 20;
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