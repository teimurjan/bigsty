module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  plugins: ['react', '@typescript-eslint', 'prettier', 'react-hooks'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/camelcase': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error'
  },
};
