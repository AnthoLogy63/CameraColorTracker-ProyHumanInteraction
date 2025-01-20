module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb-typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'postcss.config.js', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/react-in-jsx-scope': 0,
    "import/prefer-default-export": 0,
    "react/require-default-props": 0,
    "react/jsx-props-no-spreading": 0,
    "react-refresh/only-export-components": 0,
    "react/jsx-no-bind": 0,
    "no-console": 0
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
}