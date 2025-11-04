"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  variables: true,
  theme: true,
  lightModeColors: true,
  lightModeColorsV2: true,
  darkModeColors: true,
  darkModeColorsV2: true,
  alphaValues: true,
  focusBoxShadow: true,
  DarkModeSettings: true,
  DarkModeNamingStrategy: true,
  getDarkModeSetting: true,
  getDarkModeCookieName: true,
  getDarkModeFromCookieHeader: true,
  getDarkModeFromRequest: true,
  getInlineThemeScript: true,
  initDarkMode: true,
  isDarkMode: true,
  isLocalDevelopment: true,
  observeDarkMode: true,
  resetDarkMode: true,
  setDarkMode: true,
  setDarkModeKey: true,
  toggleDarkMode: true,
  addDarkModeChangeListener: true,
  removeDarkModeChangeListener: true,
  getDarkModeTimestamp: true,
  setDarkModeNamingStrategy: true,
  getDarkModeNamingStrategy: true,
  translateDarkModeSetting: true,
  isDarkModeNewerThan: true
};
Object.defineProperty(exports, "DarkModeNamingStrategy", {
  enumerable: true,
  get: function get() {
    return _darkMode.DarkModeNamingStrategy;
  }
});
Object.defineProperty(exports, "DarkModeSettings", {
  enumerable: true,
  get: function get() {
    return _darkMode.DarkModeSettings;
  }
});
Object.defineProperty(exports, "addDarkModeChangeListener", {
  enumerable: true,
  get: function get() {
    return _darkMode.addDarkModeChangeListener;
  }
});
Object.defineProperty(exports, "alphaValues", {
  enumerable: true,
  get: function get() {
    return _alpha.alphaValues;
  }
});
Object.defineProperty(exports, "darkModeColors", {
  enumerable: true,
  get: function get() {
    return _darkScalesV.default;
  }
});
Object.defineProperty(exports, "darkModeColorsV2", {
  enumerable: true,
  get: function get() {
    return _darkScalesV2.default;
  }
});
Object.defineProperty(exports, "focusBoxShadow", {
  enumerable: true,
  get: function get() {
    return _mixins.focusBoxShadow;
  }
});
Object.defineProperty(exports, "getDarkModeCookieName", {
  enumerable: true,
  get: function get() {
    return _darkMode.getDarkModeCookieName;
  }
});
Object.defineProperty(exports, "getDarkModeFromCookieHeader", {
  enumerable: true,
  get: function get() {
    return _darkMode.getDarkModeFromCookieHeader;
  }
});
Object.defineProperty(exports, "getDarkModeFromRequest", {
  enumerable: true,
  get: function get() {
    return _darkMode.getDarkModeFromRequest;
  }
});
Object.defineProperty(exports, "getDarkModeNamingStrategy", {
  enumerable: true,
  get: function get() {
    return _darkMode.getDarkModeNamingStrategy;
  }
});
Object.defineProperty(exports, "getDarkModeSetting", {
  enumerable: true,
  get: function get() {
    return _darkMode.getDarkModeSetting;
  }
});
Object.defineProperty(exports, "getDarkModeTimestamp", {
  enumerable: true,
  get: function get() {
    return _darkMode.getDarkModeTimestamp;
  }
});
Object.defineProperty(exports, "getInlineThemeScript", {
  enumerable: true,
  get: function get() {
    return _darkMode.getInlineThemeScript;
  }
});
Object.defineProperty(exports, "initDarkMode", {
  enumerable: true,
  get: function get() {
    return _darkMode.initDarkMode;
  }
});
Object.defineProperty(exports, "isDarkMode", {
  enumerable: true,
  get: function get() {
    return _darkMode.isDarkMode;
  }
});
Object.defineProperty(exports, "isDarkModeNewerThan", {
  enumerable: true,
  get: function get() {
    return _darkMode.isDarkModeNewerThan;
  }
});
Object.defineProperty(exports, "isLocalDevelopment", {
  enumerable: true,
  get: function get() {
    return _darkMode.isLocalDevelopment;
  }
});
Object.defineProperty(exports, "lightModeColors", {
  enumerable: true,
  get: function get() {
    return _lightScalesV.default;
  }
});
Object.defineProperty(exports, "lightModeColorsV2", {
  enumerable: true,
  get: function get() {
    return _lightScalesV2.default;
  }
});
Object.defineProperty(exports, "observeDarkMode", {
  enumerable: true,
  get: function get() {
    return _darkMode.observeDarkMode;
  }
});
Object.defineProperty(exports, "removeDarkModeChangeListener", {
  enumerable: true,
  get: function get() {
    return _darkMode.removeDarkModeChangeListener;
  }
});
Object.defineProperty(exports, "resetDarkMode", {
  enumerable: true,
  get: function get() {
    return _darkMode.resetDarkMode;
  }
});
Object.defineProperty(exports, "setDarkMode", {
  enumerable: true,
  get: function get() {
    return _darkMode.setDarkMode;
  }
});
Object.defineProperty(exports, "setDarkModeKey", {
  enumerable: true,
  get: function get() {
    return _darkMode.setDarkModeKey;
  }
});
Object.defineProperty(exports, "setDarkModeNamingStrategy", {
  enumerable: true,
  get: function get() {
    return _darkMode.setDarkModeNamingStrategy;
  }
});
Object.defineProperty(exports, "theme", {
  enumerable: true,
  get: function get() {
    return _variables.default;
  }
});
Object.defineProperty(exports, "toggleDarkMode", {
  enumerable: true,
  get: function get() {
    return _darkMode.toggleDarkMode;
  }
});
Object.defineProperty(exports, "translateDarkModeSetting", {
  enumerable: true,
  get: function get() {
    return _darkMode.translateDarkModeSetting;
  }
});
Object.defineProperty(exports, "variables", {
  enumerable: true,
  get: function get() {
    return _variables.default;
  }
});
var _variables = _interopRequireWildcard(require("./variables"));
Object.keys(_variables).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _variables[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _variables[key];
    }
  });
});
var _lightScalesV = _interopRequireDefault(require("./colors/lightScalesV1"));
var _lightScalesV2 = _interopRequireDefault(require("./colors/lightScalesV2"));
var _darkScalesV = _interopRequireDefault(require("./colors/darkScalesV1"));
var _darkScalesV2 = _interopRequireDefault(require("./colors/darkScalesV2"));
var _alpha = require("./colors/alpha");
var _mixins = require("./mixins");
var _darkMode = require("./darkMode");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }