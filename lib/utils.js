"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleDarkMode = exports.setDarkModeKey = exports.setDarkMode = exports.observeDarkMode = exports.modeTransitionTime = exports.isDarkMode = exports.getDarkModeSetting = exports.DarkModeSettings = void 0;

var _window$matchMedia, _window, _darkModeMatch$addEve;

var modeTransitionTime = 500;
exports.modeTransitionTime = modeTransitionTime;
var darkModeClassName = 'dark-mode';
var noTransitionClassName = 'mode-transition';
var DarkModeSettings; // Defensive checks in case component library is used outside the browser
// E.g. server side rendering

exports.DarkModeSettings = DarkModeSettings;

(function (DarkModeSettings) {
  DarkModeSettings["ON"] = "on";
  DarkModeSettings["OFF"] = "off";
  DarkModeSettings["SYSTEM"] = "system";
})(DarkModeSettings || (exports.DarkModeSettings = DarkModeSettings = {}));

var classList = typeof document !== 'undefined' && document.documentElement.classList;
/**
 * Allow customizing the class name/local storage key used for dark mode.
 * By default, it will also remove the old key from local storage and add the new one.
 */

var setDarkModeKey = function setDarkModeKey(newKey) {
  var updateStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var prevKey = darkModeClassName;
  darkModeClassName = newKey;

  if (updateStorage) {
    if (localStorage[newKey]) {
      // If there's a setting stored for the new key, use it.
      setDarkMode(localStorage[newKey], true);
    } else if (localStorage[prevKey]) {
      // If there's a setting stored for the old key, copy it over.
      localStorage.setItem(newKey, localStorage[prevKey]);
    }

    localStorage.removeItem(prevKey);
  }
};

exports.setDarkModeKey = setDarkModeKey;

var isDarkMode = function isDarkMode() {
  return classList && classList.contains(darkModeClassName);
};

exports.isDarkMode = isDarkMode;

var toggleDarkMode = function toggleDarkMode(condition) {
  if (classList) {
    // mode-transition class prevents color transitions from taking place
    classList.add(noTransitionClassName);
    setTimeout(function () {
      classList.toggle(darkModeClassName, condition);
    }, 0); // Timeout must match transition time value in stylesheet

    setTimeout(function () {
      classList.remove(noTransitionClassName);
    }, modeTransitionTime);
  }
};

exports.toggleDarkMode = toggleDarkMode;
var darkModeMatch = typeof window !== 'undefined' && ((_window$matchMedia = (_window = window).matchMedia) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.call(_window, '(prefers-color-scheme: dark)'));
darkModeMatch && ((_darkModeMatch$addEve = darkModeMatch.addEventListener) === null || _darkModeMatch$addEve === void 0 ? void 0 : _darkModeMatch$addEve.call(darkModeMatch, 'change', function (e) {
  systemDarkMode = e.matches;

  if (userDarkModeSetting === DarkModeSettings.SYSTEM) {
    setDarkMode(userDarkModeSetting, false);
  }
}));
var systemDarkMode = darkModeMatch ? darkModeMatch.matches : false;

var setDarkMode = function setDarkMode(darkMode) {
  var updateStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  toggleDarkMode(darkMode === DarkModeSettings.ON || darkMode === DarkModeSettings.SYSTEM && systemDarkMode);
  userDarkModeSetting = darkMode;
  updateStorage && (localStorage[darkModeClassName] = darkMode);
};

exports.setDarkMode = setDarkMode;
var userDarkModeSetting = typeof localStorage !== 'undefined' && localStorage[darkModeClassName] || DarkModeSettings.OFF;
setDarkMode(userDarkModeSetting, false);

var getDarkModeSetting = function getDarkModeSetting() {
  return userDarkModeSetting;
};

exports.getDarkModeSetting = getDarkModeSetting;

var observeDarkMode = function observeDarkMode(fn) {
  var _observer;

  var darkMode = isDarkMode();
  var hasWindow = typeof window !== 'undefined';
  var observer;

  if (hasWindow) {
    observer = window.MutationObserver && new MutationObserver(function () {
      var currentDarkMode = isDarkMode();

      if (darkMode !== currentDarkMode) {
        darkMode = currentDarkMode;
        fn(darkMode);
      }
    });
  }

  (_observer = observer) === null || _observer === void 0 ? void 0 : _observer.observe(document.documentElement, {
    attributes: true
  });
};

exports.observeDarkMode = observeDarkMode;