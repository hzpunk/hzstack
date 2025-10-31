module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-prettier',
  ],
  plugins: ['stylelint-scss', 'stylelint-order', 'stylelint-selector-bem-pattern'],
  rules: {
    'plugin/selector-bem-pattern': {
      preset: 'bem',
      implicitComponents: 'src/**/*.tsx',
      componentSelectors: {
        initial: '^\.([a-z]+(?:-[a-z]+)*)$',
      },
    },
    'selector-class-pattern': [
      '^[a-z]+(?:-[a-z]+)*(?:__[a-z]+(?:-[a-z]+)*)?(?:--[a-z]+(?:-[a-z]+)*)?$',
      { message: 'Use BEM naming (block__element--modifier) with kebab-case' },
    ],
    'order/properties-alphabetical-order': true,
  },
  ignoreFiles: ['**/node_modules/**', 'public/**'],
};


