const baseConfig = {
  globals: {
    bootstrap: true,
    describe: true,
    it: true,
    beforeEach: true,
    afterEach: true,
    before: true,
    after: true,
    beforeAll: true,
    afterAll: true,
    test: true,
    expect: true,
    jest: true,
    CF_PACKAGES: false,
    BUILD_TIMESTAMP: false
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    'no-debugger': 'error',
    eqeqeq: 'error',
    'mocha/no-exclusive-tests': 'error',
    'block-scoped-var': 'error',
    'default-case': 'error',
    'guard-for-in': 'error',
    'no-else-return': 'error',
    'no-floating-decimal': 'error',
    'no-self-compare': 'error',
    'no-void': 'error',
    radix: 'error',
    'wrap-iife': ['error', 'inside'],
    'no-catch-shadow': 'error',
    'handle-callback-err': 'error',
    camelcase: 'off',
    'no-duplicate-imports': 'error',
    'no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }
    ],
    'no-undef': 'error',
    'no-return-await': 'error',
    'jsx-a11y/label-has-for': [
      'error',
      {
        allowChildren: true
      }
    ],
    'getsentry/jsx-needs-i18n': 'error'
  }
};
const javascriptOverrides = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    babelOptions: {
      configFile: require.resolve('@cloudflare/stratus-core/babel.config.js')
    },
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: true,
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  extends: [
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended' // TODO: Enable the following
    // 'eslint:recommended'
  ],
  plugins: [
    'react',
    'json',
    'cflint',
    'compat',
    'mocha',
    'behance',
    'jsx-a11y',
    'getsentry'
  ],
  rules: {
    'compat/compat': 'error',
    'react/prop-types': [
      'error',
      {
        skipUndeclared: false
      }
    ],
    'react-hooks/rules-of-hooks': 'warn',
    'behance/no-deprecated': [
      'error',
      {
        imports: {
          'style-const': 'the theme variable passed through the context',
          'react-fela': 'style-container or style-provider',
          fela: 'style-container',
          'fela-dom': 'style-provider'
        }
      }
    ]
  }
};
const typescriptOverrides = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended' // TODO: Enable the following
    // 'eslint:recommended',
    // 'plugin:react/recommended'
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // These settings align eslint with our ts compiler config and should
    // remain off
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-empty-function': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    // These are settings which we plan to change to 'error' as we resolve
    // issues accrued over an extended period where linting was inactive
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-array-constructor': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    eqeqeq: 'off',
    'prefer-const': 'off',
    'prefer-spread': 'off',
    'no-void': 'off',
    'block-scoped-var': 'off',
    'guard-for-in': 'off',
    'no-duplicate-imports': 'error',
    'no-else-return': 'off',
    'no-var': 'off',
    radix: 'off',
    'no-catch-shadow': 'off',
    'prefer-rest-params': 'off',
    'default-case': 'off',
    'no-return-await': 'off',
    'getsentry/jsx-needs-i18n': 'off'
  }
};
module.exports = {
  root: true,
  ...baseConfig,
  overrides: [
    {
      files: [
        '**/tests/*.js',
        '**/__tests__/**/*.js',
        '**/src/apps/!(dash)/**/*.js',
        '**/ninjapanel/**/*.js',
        '**/example/**',
        '**/playground/**'
      ],
      parser: '@babel/eslint-parser',
      rules: {
        'getsentry/jsx-needs-i18n': 'off'
      }
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      ...typescriptOverrides
    },
    {
      files: ['**/*.js', '**/*.jsx'],
      ...javascriptOverrides
    }
  ],
  extends: ['plugin:storybook/recommended']
};
