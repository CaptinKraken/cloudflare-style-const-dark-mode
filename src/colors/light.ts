import colorsV1 from './lightScalesV1';
// V2 Colors are not exposed to the theme directly. Logical color names must be
// used instead - see, for example, table colors below
import colorsV2 from './lightScalesV2';

const background = colorsV1.white;
const text = colorsV2.gray[0];

export default {
  ...colorsV1,
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
};
