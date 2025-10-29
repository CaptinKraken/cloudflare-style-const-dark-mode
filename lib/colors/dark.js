"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _darkScalesV = _interopRequireDefault(require("./darkScalesV1"));

var _darkScalesV2 = _interopRequireDefault(require("./darkScalesV2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var background = '#0a0a0a';
var text = _darkScalesV2.default.gray[0];

var _default = _objectSpread(_objectSpread({}, _darkScalesV.default), {}, {
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

exports.default = _default;