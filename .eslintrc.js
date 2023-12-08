module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off', // require explicit return types on functions and class methods
    '@typescript-eslint/explicit-module-boundary-types': 'off', // require explicit return and argument types on exported functions' and classes' public class methods
    '@typescript-eslint/no-explicit-any': 'off', // disallow the any type
    'eol-last': ['warn', 'always'], //	require or disallow newline at the end of files
    quotes: ['warn', 'single', { avoidEscape: true }], //enforce the consistent use of either backticks, double, or single quotes
    semi: ['off', 'always'], // require or disallow semicolons instead of ASI
    'arrow-spacing': 'warn', // enforce consistent spacing before and after the arrow in arrow functions
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
