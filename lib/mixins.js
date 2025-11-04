"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusBoxShadow = exports.default = void 0;
var _darkMode = require("./darkMode");
var _variables = _interopRequireWildcard(require("./variables"));
var _excluded = ["border", "invalid", "focused", "disabled", "within"];
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
var focusBoxShadow = exports.focusBoxShadow = function focusBoxShadow() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    invalid = _ref.invalid,
    _ref$space = _ref.space,
    space = _ref$space === void 0 ? 2 : _ref$space,
    _ref$outline = _ref.outline,
    outline = _ref$outline === void 0 ? 2 : _ref$outline,
    _ref$inset = _ref.inset,
    inset = _ref$inset === void 0 ? false : _ref$inset;
  var outlineColor = invalid ? _variables.default.colors.error : _variables.default.colors.focus;
  return "0 0 0 ".concat(space, "px ").concat(_variables.default.colors.background, ", 0 0 0 ").concat(space + outline, "px ").concat(outlineColor, " ").concat(inset ? 'inset' : '');
};
var focusMixin = function focusMixin() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    border = _ref2.border,
    invalid = _ref2.invalid,
    focused = _ref2.focused,
    disabled = _ref2.disabled,
    within = _ref2.within,
    boxShadowProps = _objectWithoutProperties(_ref2, _excluded);
  var focusedProperties = _objectSpread({
    outline: 'none',
    transition: 'box-shadow 300ms ease',
    boxShadow: focusBoxShadow(_objectSpread({
      invalid: invalid
    }, boxShadowProps))
  }, border && !disabled ? {
    borderColor: invalid ? _variables.default.colors.error : _variables.default.colors.focus
  } : {});
  return _objectSpread(_objectSpread({}, focused ? focusedProperties : {}), {}, _defineProperty({}, "&:focus".concat(within ? '-within' : '-visible'), _objectSpread({}, focusedProperties)));
};
var errorMixin = function errorMixin(_ref3) {
  var compact = _ref3.compact;
  return {
    color: _variables.default.colors.error,
    fontSize: _variables.fontSizes[compact ? 1 : 2]
  };
};
var linkMixin = function linkMixin(_ref4) {
  var disabled = _ref4.disabled;
  return {
    display: 'inline-block',
    color: disabled ? _variables.default.colors.gray[4] : _variables.default.colors.link,
    transition: 'all 150ms ease',
    cursor: disabled ? 'default !important' : 'pointer',
    '& svg': {
      fill: 'currentColor'
    },
    '&:hover': {
      color: disabled ? _variables.default.colors.gray[4] : (0, _darkMode.isDarkMode)() ? _variables.default.colors.orange[3] : _variables.default.colors.blue[2],
      '& svg': {
        fill: 'currentColor'
      }
    },
    '&:active': {
      color: disabled ? _variables.default.colors.gray[4] : (0, _darkMode.isDarkMode)() ? _variables.default.colors.orange[3] : _variables.default.colors.blue[2],
      outline: 'none',
      '& svg': {
        fill: 'currentColor'
      }
    },
    '&:focus': {
      color: disabled ? _variables.default.colors.gray[4] : _variables.default.colors.blue[5]
    }
  };
};
var shadowMixin = function shadowMixin() {
  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref5$x = _ref5.x,
    x = _ref5$x === void 0 ? 2 : _ref5$x,
    _ref5$y = _ref5.y,
    y = _ref5$y === void 0 ? 4 : _ref5$y,
    _ref5$spread = _ref5.spread,
    spread = _ref5$spread === void 0 ? 0 : _ref5$spread,
    blur = _ref5.blur,
    opacity = _ref5.opacity;
  opacity = opacity !== null && opacity !== void 0 ? opacity : (0, _darkMode.isDarkMode)() ? 0.4 : 0.15;
  blur = blur !== null && blur !== void 0 ? blur : (0, _darkMode.isDarkMode)() ? 9 : 20;
  return {
    boxShadow: "".concat(x, "px ").concat(y, "px ").concat(blur, "px ").concat(spread, " rgba(0,0,0,").concat(opacity, ")")
  };
};
var inputMixin = function inputMixin(_ref6) {
  var invalid = _ref6.invalid,
    disabled = _ref6.disabled,
    radius = _ref6.radius,
    color = _ref6.color,
    inline = _ref6.inline,
    compact = _ref6.compact;
  return {
    fontFamily: _variables.default.fontFamily,
    fontSize: compact ? 1 : 2,
    outline: 'none',
    color: color || _variables.default.colors.gray[1],
    opacity: disabled ? 0.5 : 1,
    backgroundColor: disabled ? _variables.default.colors.gray[8] : inline ? 'transparent' : _variables.default.colors.white,
    borderWidth: '1px',
    borderStyle: inline ? 'none' : 'solid',
    borderColor: invalid && !disabled ? _variables.default.colors.error : _variables.default.colors.gray[(0, _darkMode.isDarkMode)() ? 4 : 5],
    borderRadius: radius !== null && radius !== void 0 ? radius : _variables.default.radii[2],
    transition: 'border-color 0.2s ease',
    '&:hover': _objectSpread({}, disabled ? {} : {
      borderColor: invalid ? _variables.default.colors.error : _variables.default.colors.focus
    }),
    '&:active': _objectSpread({}, disabled ? {} : {
      borderColor: invalid ? _variables.default.colors.error : _variables.default.colors.focus
    }),
    '&::placeholder': {
      color: _variables.default.colors.gray[(0, _darkMode.isDarkMode)() ? 4 : 4]
    }
  };
};
var _default = exports.default = {
  focus: focusMixin,
  error: errorMixin,
  shadow: shadowMixin,
  link: linkMixin,
  input: inputMixin
};