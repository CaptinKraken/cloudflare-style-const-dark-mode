"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lightScalesV = _interopRequireDefault(require("./lightScalesV1"));

var _lightScalesV2 = _interopRequireDefault(require("./lightScalesV2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var background = _lightScalesV.default.white;
var text = _lightScalesV2.default.gray[0];

var _default = _objectSpread(_objectSpread({}, _lightScalesV.default), {}, {
  background: background,
  text: _lightScalesV.default.gray[1],
  textMuted: _lightScalesV.default.gray[4],
  error: _lightScalesV.default.red[4],
  focus: _lightScalesV2.default.blue[5],
  link: _lightScalesV.default.blue[4],
  table: {
    background: background,
    border: _lightScalesV2.default.gray[8],
    text: _lightScalesV2.default.gray[0],
    separator: _lightScalesV2.default.gray[0],
    sortArrow: _lightScalesV2.default.blue[5]
  },
  menu: {
    background: background,
    text: _lightScalesV2.default.gray[0],
    disabledText: _lightScalesV2.default.gray[6],
    border: _lightScalesV2.default.gray[8],
    separator: _lightScalesV2.default.gray[9],
    shadow: _lightScalesV2.default.black,
    hover: _lightScalesV2.default.gray[9]
  },
  button: {
    primary: {
      normal: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.blue[5]
      },
      hover: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.blue[3]
      },
      focus: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.blue[3]
      },
      active: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.blue[1]
      }
    },
    danger: {
      normal: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.red[5]
      },
      hover: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.red[3]
      },
      focus: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.red[3]
      },
      active: {
        text: _lightScalesV2.default.white,
        background: _lightScalesV2.default.red[1]
      }
    },
    plain: {
      normal: {
        text: _lightScalesV2.default.blue[5],
        background: background
      },
      hover: {
        text: _lightScalesV2.default.blue[3],
        background: _lightScalesV2.default.blue[9]
      },
      active: {
        text: _lightScalesV2.default.blue[1],
        background: _lightScalesV2.default.blue[7]
      },
      focus: {
        text: _lightScalesV2.default.blue[3],
        background: _lightScalesV2.default.blue[9]
      }
    },
    plainMono: {
      normal: {
        text: text,
        background: background
      },
      hover: {
        text: text,
        background: _lightScalesV2.default.gray[9]
      },
      active: {
        text: text,
        background: _lightScalesV2.default.gray[8]
      },
      focus: {
        text: text,
        background: _lightScalesV2.default.gray[9]
      }
    },
    plainDestructive: {
      normal: {
        text: _lightScalesV2.default.red[5],
        background: background
      },
      hover: {
        text: _lightScalesV2.default.red[3],
        background: _lightScalesV2.default.red[9]
      },
      active: {
        text: _lightScalesV2.default.red[1],
        background: _lightScalesV2.default.red[7]
      },
      focus: {
        text: _lightScalesV2.default.red[3],
        background: _lightScalesV2.default.red[9]
      }
    }
  }
});

exports.default = _default;