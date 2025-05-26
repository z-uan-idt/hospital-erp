import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'
import vuePlugin from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: [
      // Dependencies
      'node_modules/**',
      '.nuxt/**',
      '.output/**',
      'dist/**',
      'public/**',

      // Build
      '*.min.js',
      '*.min.css',

      // IDE
      '.idea/**',
      '.vscode/**',

      // Nuxt
      '.nitro/**',

      // Logs
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',

      // Generated types
      '.nuxt-module-build/**',

      // Configuration
      '*.config.js',
      '*.config.ts',
    ],
  },
  // Global settings
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  // Vue specific settings
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      // Basic Vue 3 rules
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/component-options-name-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/define-macros-order': [
        'error',
        {
          order: ['defineProps', 'defineEmits'],
        },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always',
        },
      ],
      'vue/html-indent': ['error', 2],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1,
        },
      ],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },
]
