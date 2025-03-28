import { FlatCompat } from '@eslint/eslintrc'
import globals from 'globals'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import jsxa11y from 'eslint-plugin-jsx-a11y'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const compat = new FlatCompat()

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pluginReact.configs.flat['jsx-runtime'],
  ...compat.extends('plugin:react-hooks/recommended'),
  jsxa11y.flatConfigs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },
  eslintPluginPrettierRecommended,
]
