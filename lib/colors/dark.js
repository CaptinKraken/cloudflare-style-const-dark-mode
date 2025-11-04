"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _darkScalesV = _interopRequireDefault(require("./darkScalesV1"));
var _darkScalesV2 = _interopRequireDefault(require("./darkScalesV2"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // V2 Colors are not exposed to the theme directly. Logical color names must be
// used instead - see, for example, table colors below
var background = '#0a0a0a';
var text = _darkScalesV2.default.gray[0];
var _default = exports.default = _objectSpread(_objectSpread({}, _darkScalesV.default), {}, {
  background: background,
  text: _darkScalesV.default.gray[1],
  textMuted: _darkScalesV.default.gray[3],
  error: _darkScalesV.default.red[3],
  focus: _darkScalesV.default.blue[3],
  link: _darkScalesV.default.blue[4],
  table: {
    background: background,
    border: _darkScalesV2.default.gray[8],
    text: _darkScalesV2.default.gray[0],
    separator: _darkScalesV2.default.gray[0],
    sortArrow: _darkScalesV2.default.blue[5]
  },
  menu: {
    background: background,
    text: _darkScalesV2.default.gray[0],
    disabledText: _darkScalesV2.default.gray[6],
    border: _darkScalesV2.default.gray[8],
    separator: _darkScalesV2.default.gray[9],
    shadow: _darkScalesV2.default.gray[7],
    hover: _darkScalesV2.default.gray[9]
  },
  button: {
    primary: {
      normal: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.blue[2]
      },
      hover: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.blue[3]
      },
      focus: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.blue[2]
      },
      active: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.blue[4]
      }
    },
    danger: {
      normal: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.red[2]
      },
      hover: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.red[3]
      },
      focus: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.red[2]
      },
      active: {
        text: _darkScalesV2.default.white,
        background: _darkScalesV.default.red[4]
      }
    },
    plain: {
      normal: {
        text: _darkScalesV.default.blue[2],
        background: background
      },
      hover: {
        text: _darkScalesV.default.blue[2],
        background: _darkScalesV.default.gray[8]
      },
      active: {
        text: _darkScalesV2.default.blue[1],
        background: _darkScalesV2.default.blue[7]
      },
      focus: {
        text: _darkScalesV2.default.blue[3],
        background: _darkScalesV2.default.blue[9]
      }
    },
    plainMono: {
      normal: {
        text: text,
        background: background
      },
      hover: {
        text: text,
        background: _darkScalesV2.default.gray[9]
      },
      active: {
        text: text,
        background: _darkScalesV2.default.gray[8]
      },
      focus: {
        text: text,
        background: _darkScalesV2.default.gray[9]
      }
    },
    plainDestructive: {
      normal: {
        text: _darkScalesV.default.red[2],
        background: background
      },
      hover: {
        text: _darkScalesV.default.red[2],
        background: _darkScalesV.default.gray[8]
      },
      active: {
        text: _darkScalesV2.default.red[1],
        background: _darkScalesV2.default.red[7]
      },
      focus: {
        text: _darkScalesV2.default.red[3],
        background: _darkScalesV2.default.red[9]
      }
    }
  }
});