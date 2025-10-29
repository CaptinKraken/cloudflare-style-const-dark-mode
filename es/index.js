import variables from './variables';
import lightModeColors from './colors/lightScalesV1';
import lightModeColorsV2 from './colors/lightScalesV2';
import darkModeColors from './colors/darkScalesV1';
import darkModeColorsV2 from './colors/darkScalesV2';
import { focusBoxShadow } from './mixins';
import { DarkModeSettings, getDarkModeSetting, isDarkMode, observeDarkMode, setDarkMode, setDarkModeKey, toggleDarkMode } from './utils';
export { variables, variables as theme, isDarkMode, toggleDarkMode, setDarkMode, setDarkModeKey, observeDarkMode, getDarkModeSetting, lightModeColors, lightModeColorsV2, darkModeColors, darkModeColorsV2, DarkModeSettings, focusBoxShadow };
export * from './variables';