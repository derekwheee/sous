import pluginQuery from '@tanstack/eslint-plugin-query';
import expoConfig from 'eslint-config-expo/flat';

export default [
    ...pluginQuery.configs['flat/recommended'],
    expoConfig,
    {
        ignores: ['dist/*', 'builds/*', 'node_modules/*'],
    },
];
