import js from '@eslint/js'
import prettier from '@vue/eslint-config-prettier'
import tseslint from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['api/**/*.js'],
    languageOptions: {
      globals: {
        Buffer: 'readonly',
        URLSearchParams: 'readonly',
        fetch: 'readonly',
        process: 'readonly',
      },
    },
  },
  ...pluginVue.configs['flat/recommended'],
  ...tseslint(),
  prettier,
]
