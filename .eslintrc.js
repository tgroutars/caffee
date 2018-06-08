module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:prettier/recommended'],
  env: {
    node: true
  },
  rules: {
    'no-restricted-globals': ['error', 'Promise'],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'class-methods-use-this': 'off'
  }
};
