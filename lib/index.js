"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

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
  focusBoxShadow: true,
  DarkModeSettings: true,
  getDarkModeSetting: true,
  isDarkMode: true,
  observeDarkMode: true,
  setDarkMode: true,
  setDarkModeKey: true,
  toggleDarkMode: true
};
Object.defineProperty(exports, "DarkModeSettings", {
  enumerable: true,
  get: function get() {
    return _utils.DarkModeSettings;
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
Object.defineProperty(exports, "getDarkModeSetting", {
  enumerable: true,
  get: function get() {
    return _utils.getDarkModeSetting;
  }
});
Object.defineProperty(exports, "isDarkMode", {
  enumerable: true,
  get: function get() {
    return _utils.isDarkMode;
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
    return _utils.observeDarkMode;
  }
});
Object.defineProperty(exports, "setDarkMode", {
  enumerable: true,
  get: function get() {
    return _utils.setDarkMode;
  }
});
Object.defineProperty(exports, "setDarkModeKey", {
  enumerable: true,
  get: function get() {
    return _utils.setDarkModeKey;
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
    return _utils.toggleDarkMode;
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

var _mixins = require("./mixins");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }