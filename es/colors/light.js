function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import colorsV1 from './lightScalesV1';
// V2 Colors are not exposed to the theme directly. Logical color names must be
// used instead - see, for example, table colors below
import colorsV2 from './lightScalesV2';
var background = colorsV1.white;
var text = colorsV2.gray[0];
export default _objectSpread(_objectSpread({}, colorsV1), {}, {
  background,
  text: colorsV1.gray[1],
  textMuted: colorsV1.gray[4],
  error: colorsV1.red[4],
  focus: colorsV2.blue[5],
  link: colorsV1.blue[4],
  table: {
    background,
    border: colorsV2.gray[8],
    text: colorsV2.gray[0],
    separator: colorsV2.gray[0],
    sortArrow: colorsV2.blue[5]
  },
  menu: {
    background,
    text: colorsV2.gray[0],
    disabledText: colorsV2.gray[6],
    border: colorsV2.gray[8],
    separator: colorsV2.gray[9],
    shadow: colorsV2.black,
    hover: colorsV2.gray[9]
  },
  button: {
    primary: {
      normal: {
        text: colorsV2.white,
        background: colorsV2.blue[5]
      },
      hover: {
        text: colorsV2.white,
        background: colorsV2.blue[3]
      },
      focus: {
        text: colorsV2.white,
        background: colorsV2.blue[3]
      },
      active: {
        text: colorsV2.white,
        background: colorsV2.blue[1]
      }
    },
    danger: {
      normal: {
        text: colorsV2.white,
        background: colorsV2.red[5]
      },
      hover: {
        text: colorsV2.white,
        background: colorsV2.red[3]
      },
      focus: {
        text: colorsV2.white,
        background: colorsV2.red[3]
      },
      active: {
        text: colorsV2.white,
        background: colorsV2.red[1]
      }
    },
    plain: {
      normal: {
        text: colorsV2.blue[5],
        background
      },
      hover: {
        text: colorsV2.blue[3],
        background: colorsV2.blue[9]
      },
      active: {
        text: colorsV2.blue[1],
        background: colorsV2.blue[7]
      },
      focus: {
        text: colorsV2.blue[3],
        background: colorsV2.blue[9]
      }
    },
    plainMono: {
      normal: {
        text,
        background
      },
      hover: {
        text,
        background: colorsV2.gray[9]
      },
      active: {
        text,
        background: colorsV2.gray[8]
      },
      focus: {
        text,
        background: colorsV2.gray[9]
      }
    },
    plainDestructive: {
      normal: {
        text: colorsV2.red[5],
        background
      },
      hover: {
        text: colorsV2.red[3],
        background: colorsV2.red[9]
      },
      active: {
        text: colorsV2.red[1],
        background: colorsV2.red[7]
      },
      focus: {
        text: colorsV2.red[3],
        background: colorsV2.red[9]
      }
    }
  }
});