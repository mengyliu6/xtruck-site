import js from '@eslint/js'
import prettier from '@vue/eslint-config-prettier'
import tseslint from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  {
    files: ['api/**/*.js'],
    languageOptions: {
      globals: {
        Buffer: 'readonly',
        console: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...tseslint(),
  prettier,
]
