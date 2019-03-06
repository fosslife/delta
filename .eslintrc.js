'use strict';

module.exports = {
    env: {
        commonjs: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 2018
    },
    rules: {
        indent: 'error',
        'linebreak-style': 'error',
        quotes: [ 'error', 'single' ],
        semi: 'error',
        strict: 'error',
        'eol-last': 'error'
    }
};
