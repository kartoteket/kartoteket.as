module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  // extends: ['@nuxtjs'],
  extends: ['@nuxtjs', 'prettier/vue'],
  // extends: ['@nuxtjs', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    'no-console': 'off',
    semi: 'off',
    // 'quotes': ['error', 'single'],
    'arrow-parens': ['error', 'as-needed'],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }]
  }
};
