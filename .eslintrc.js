module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'react-hooks',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/semi': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    'arrow-parens': 'off',
    'interface-name': 'off',
    'interface-over-type-literal': 'off',
    'jsx-no-multiline-js': 'off',
    'max-classes-per-file': 'off',
    'max-len': ['warn', { 'code': 120 }],
    'member-ordering': 'off',
    'new-parens': 'warn',
    'no-angle-bracket-type-assertion': 'off',
    'no-bitwise': 'warn',
    'no-consecutive-blank-lines': 'off',
    'no-console': 'off',
    'no-empty': 'warn',
    'no-extra-semi': 'off',
    'no-return-await': 'off',
    'no-shadowed-variable': 'off',
    'no-trailing-whitespace': 'off',
    'object-curly-spacing': ['warn', 'always'],
    'object-literal-sort-keys': 'off',
    'ordered-imports': 'off',
    'prefer-const': 'warn',
    'quotemark': 'off',
    'semi': 'off', // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
    'trailing-comma': 'off',
    'variable-name': 'off',
    'react/prop-types': 'off',
    'react/jsx-curly-brace-presence': ['warn', { props: "never", children: "never" }],
    'react/jsx-curly-spacing': ['warn', { "when": "never", "children": { "when": "never" } }],
    'react/display-name': 'off',
  },
  "settings": {
    "react": {
      "createClass": "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      "pragma": "React",  // Pragma to use, default to "React"
      "version": "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      "flowVersion": "0.53" // Flow version
    },
    "propWrapperFunctions": [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { "property": "freeze", "object": "Object" },
      { "property": "myFavoriteWrapper" }
    ],
    "linkComponents": [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { "name": "Link", "linkAttribute": "to" }
    ]
  }
};
