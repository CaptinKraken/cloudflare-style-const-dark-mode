import { isDarkMode } from './darkMode';
import theme, { fontSizes } from './variables';

type FocusBoxShadowProps = {
  invalid?: boolean;
  space?: number;
  outline?: number;
  inset?: boolean;
};

type FocusProps = {
  border?: boolean;
  focused?: boolean;
  within?: boolean;
  disabled?: boolean;
} & FocusBoxShadowProps;

export const focusBoxShadow = ({
  invalid,
  space = 2,
  outline = 2,
  inset = false
}: FocusBoxShadowProps = {}) => {
  const outlineColor = invalid ? theme.colors.error : theme.colors.focus;
  return `0 0 0 ${space}px ${theme.colors.background}, 0 0 0 ${
    space + outline
  }px ${outlineColor} ${inset ? 'inset' : ''}`;
};

const focusMixin = ({
  border,
  invalid,
  focused,
  disabled,
  within,
  ...boxShadowProps
}: FocusProps = {}) => {
  const focusedProperties = {
    outline: 'none',
    transition: 'box-shadow 300ms ease',
    boxShadow: focusBoxShadow({ invalid, ...boxShadowProps }),
    ...(border && !disabled
      ? {
          borderColor: invalid ? theme.colors.error : theme.colors.focus
        }
      : {})
  };

  return {
    ...(focused ? focusedProperties : {}),
    [`&:focus${within ? '-within' : '-visible'}`]: { ...focusedProperties }
  };
};

type ErrorProps = {
  compact?: boolean;
};

const errorMixin = ({ compact }: ErrorProps) => ({
  color: theme.colors.error,
  fontSize: fontSizes[compact ? 1 : 2]
});

type LinkProps = {
  disabled?: boolean;
};

const linkMixin = ({ disabled }: LinkProps) => ({
  display: 'inline-block',
  color: disabled ? theme.colors.gray[4] : theme.colors.link,
  transition: 'all 150ms ease',
  cursor: disabled ? 'default !important' : 'pointer',

  '& svg': {
    fill: 'currentColor'
  },

  '&:hover': {
    color: disabled
      ? theme.colors.gray[4]
      : isDarkMode()
      ? theme.colors.orange[3]
      : theme.colors.blue[2],
    '& svg': {
      fill: 'currentColor'
    }
  },

  '&:active': {
    color: disabled
      ? theme.colors.gray[4]
      : isDarkMode()
      ? theme.colors.orange[3]
      : theme.colors.blue[2],
    outline: 'none',
    '& svg': {
      fill: 'currentColor'
    }
  },
  '&:focus': {
    color: disabled ? theme.colors.gray[4] : theme.colors.blue[5]
  }
});

type ShadowProps = {
  x?: number;
  y?: number;
  spread?: number;
  blur?: number;
  opacity?: number;
};

const shadowMixin = ({
  x = 2,
  y = 4,
  spread = 0,
  blur,
  opacity
}: ShadowProps = {}) => {
  opacity = opacity ?? (isDarkMode() ? 0.4 : 0.15);
  blur = blur ?? (isDarkMode() ? 9 : 20);
  return {
    boxShadow: `${x}px ${y}px ${blur}px ${spread} rgba(0,0,0,${opacity})`
  };
};

type InputProps = {
  invalid?: boolean;
  disabled?: boolean;
  loading?: boolean;
  radius?: any;
  color?: string;
  inline?: boolean;
  compact?: boolean;
};

const inputMixin = ({
  invalid,
  disabled,
  radius,
  color,
  inline,
  compact
}: InputProps) => ({
  fontFamily: theme.fontFamily,
  fontSize: compact ? 1 : 2,
  outline: 'none',
  color: color || theme.colors.gray[1],
  opacity: disabled ? 0.5 : 1,
  backgroundColor: disabled
    ? theme.colors.gray[8]
    : inline
    ? 'transparent'
    : theme.colors.white,
  borderWidth: '1px',
  borderStyle: inline ? 'none' : 'solid',
  borderColor:
    invalid && !disabled
      ? theme.colors.error
      : theme.colors.gray[isDarkMode() ? 4 : 5],
  borderRadius: radius ?? theme.radii[2],
  transition: 'border-color 0.2s ease',

  '&:hover': {
    ...(disabled
      ? {}
      : {
          borderColor: invalid ? theme.colors.error : theme.colors.focus
        })
  },
  '&:active': {
    ...(disabled
      ? {}
      : {
          borderColor: invalid ? theme.colors.error : theme.colors.focus
        })
  },
  '&::placeholder': {
    color: theme.colors.gray[isDarkMode() ? 4 : 4]
  }
});

export default {
  focus: focusMixin,
  error: errorMixin,
  shadow: shadowMixin,
  link: linkMixin,
  input: inputMixin
};
