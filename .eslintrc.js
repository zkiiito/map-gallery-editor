module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module',
    },
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'airbnb-base',
        'plugin:vue/recommended',
    ],
    globals: {
        __static: true,
    },
    plugins: [
        'html',
    ],
    'rules': {
        'global-require': 0,
        'import/no-unresolved': 0,
        'no-param-reassign': 0,
        'no-shadow': 0,
        'import/extensions': 0,
        'import/newline-after-import': 0,
        'no-multi-assign': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'indent': ['error', 4],
        'max-len': ['warn', 120],
        'linebreak-style': 0,
        'vue/html-indent': ['error', 4],
        'vue/singleline-html-element-content-newline': 0,
        'vue/max-attributes-per-line': 0,
        'vue/html-closing-bracket-spacing': ['error', {
            'startTag': 'never',
            'endTag': 'never',
            'selfClosingTag': 'never'
        }],
        'vue/component-name-in-template-casing': ["warn", "PascalCase", {
            'ignores': ['webview', 'vue-progress-bar']
        }],
    }
};
