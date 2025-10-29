"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.focusBoxShadow = exports.default = void 0;

var _utils = require("./utils");

var _variables = _interopRequireWildcard(require("./variables"));

var _excluded = ["border", "invalid", "focused", "disabled", "within"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var focusBoxShadow = function focusBoxShadow() {
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

exports.focusBoxShadow = focusBoxShadow;

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
      color: disabled ? _variables.default.colors.gray[4] : (0, _utils.isDarkMode)() ? _variables.default.colors.orange[3] : _variables.default.colors.blue[2],
      '& svg': {
        fill: 'currentColor'
      }
    },
    '&:active': {
      color: disabled ? _variables.default.colors.gray[4] : (0, _utils.isDarkMode)() ? _variables.default.colors.orange[3] : _variables.default.colors.blue[2],
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
  var _opacity, _blur;

  var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref5$x = _ref5.x,
      x = _ref5$x === void 0 ? 2 : _ref5$x,
      _ref5$y = _ref5.y,
      y = _ref5$y === void 0 ? 4 : _ref5$y,
      _ref5$spread = _ref5.spread,
      spread = _ref5$spread === void 0 ? 0 : _ref5$spread,
      blur = _ref5.blur,
      opacity = _ref5.opacity;

  opacity = (_opacity = opacity) !== null && _opacity !== void 0 ? _opacity : (0, _utils.isDarkMode)() ? 0.4 : 0.15;
  blur = (_blur = blur) !== null && _blur !== void 0 ? _blur : (0, _utils.isDarkMode)() ? 9 : 20;
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
    borderColor: invalid && !disabled ? _variables.default.colors.error : _variables.default.colors.gray[(0, _utils.isDarkMode)() ? 4 : 5],
    borderRadius: radius !== null && radius !== void 0 ? radius : _variables.default.radii[2],
    transition: 'border-color 0.2s ease',
    '&:hover': _objectSpread({}, disabled ? {} : {
      borderColor: invalid ? _variables.default.colors.error : _variables.default.colors.focus
    }),
    '&:active': _objectSpread({}, disabled ? {} : {
      borderColor: invalid ? _variables.default.colors.error : _variables.default.colors.focus
    }),
    '&::placeholder': {
      color: _variables.default.colors.gray[(0, _utils.isDarkMode)() ? 4 : 4]
    }
  };
};

var _default = {
  focus: focusMixin,
  error: errorMixin,
  shadow: shadowMixin,
  link: linkMixin,
  input: inputMixin
};
exports.default = _default;