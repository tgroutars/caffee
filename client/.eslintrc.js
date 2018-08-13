module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    browser: true,
  },
  rules: {
    'no-restricted-globals': ['error', 'Promise'],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': [2, { props: false }],
    'no-underscore-dangle': 'off',
    'import/prefer-default-export': 'off',
  },
};