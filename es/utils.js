var _window$matchMedia, _window, _darkModeMatch$addEve;

export var modeTransitionTime = 500;
var darkModeClassName = 'dark-mode';
var noTransitionClassName = 'mode-transition';
export var DarkModeSettings; // Defensive checks in case component library is used outside the browser
// E.g. server side rendering

(function (DarkModeSettings) {
  DarkModeSettings["ON"] = "on";
  DarkModeSettings["OFF"] = "off";
  DarkModeSettings["SYSTEM"] = "system";
})(DarkModeSettings || (DarkModeSettings = {}));

var classList = typeof document !== 'undefined' && document.documentElement.classList;
/**
 * Allow customizing the class name/local storage key used for dark mode.
 * By default, it will also remove the old key from local storage and add the new one.
 */

export var setDarkModeKey = function setDarkModeKey(newKey) {
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
export var isDarkMode = () => classList && classList.contains(darkModeClassName);
export var toggleDarkMode = condition => {
  if (classList) {
    // mode-transition class prevents color transitions from taking place
    classList.add(noTransitionClassName);
    setTimeout(() => {
      classList.toggle(darkModeClassName, condition);
    }, 0); // Timeout must match transition time value in stylesheet

    setTimeout(() => {
      classList.remove(noTransitionClassName);
    }, modeTransitionTime);
  }
};
var darkModeMatch = typeof window !== 'undefined' && ((_window$matchMedia = (_window = window).matchMedia) === null || _window$matchMedia === void 0 ? void 0 : _window$matchMedia.call(_window, '(prefers-color-scheme: dark)'));
darkModeMatch && ((_darkModeMatch$addEve = darkModeMatch.addEventListener) === null || _darkModeMatch$addEve === void 0 ? void 0 : _darkModeMatch$addEve.call(darkModeMatch, 'change', e => {
  systemDarkMode = e.matches;

  if (userDarkModeSetting === DarkModeSettings.SYSTEM) {
    setDarkMode(userDarkModeSetting, false);
  }
}));
var systemDarkMode = darkModeMatch ? darkModeMatch.matches : false;
export var setDarkMode = function setDarkMode(darkMode) {
  var updateStorage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  toggleDarkMode(darkMode === DarkModeSettings.ON || darkMode === DarkModeSettings.SYSTEM && systemDarkMode);
  userDarkModeSetting = darkMode;
  updateStorage && (localStorage[darkModeClassName] = darkMode);
};
var userDarkModeSetting = typeof localStorage !== 'undefined' && localStorage[darkModeClassName] || DarkModeSettings.OFF;
setDarkMode(userDarkModeSetting, false);
export var getDarkModeSetting = () => userDarkModeSetting;
export var observeDarkMode = fn => {
  var _observer;

  var darkMode = isDarkMode();
  var hasWindow = typeof window !== 'undefined';
  var observer;

  if (hasWindow) {
    observer = window.MutationObserver && new MutationObserver(() => {
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