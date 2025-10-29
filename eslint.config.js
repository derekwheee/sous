import pluginQuery from '@tanstack/eslint-plugin-query';
import expoConfig from 'eslint-config-expo/flat.js';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    ...pluginQuery.configs['flat/recommended'],
    ...expoConfig,
    {
        ignores: ['dist/*', 'builds/*', 'node_modules/*'],
    },
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
            'prettier/prettier': [
                'error',
                {
                    arrowParens: 'always',
                    bracketSameLine: false,
                    bracketSpacing: true,
                    endOfLine: 'lf',
                    jsxSingleQuote: true,
                    printWidth: 100,
                    quoteProps: 'as-needed',
                    semi: true,
                    singleQuote: true,
                    tabWidth: 4,
                    trailingComma: 'es5',
                    useTabs: false,
                },
            ],
        },
    },
];
