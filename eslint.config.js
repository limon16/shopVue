// eslint.config.mjs
import prettierPlugin from 'eslint-plugin-prettier'
import vuePlugin from 'eslint-plugin-vue'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    ignores: ['node_modules/*', 'dist/*', 'dist-ssr/*', 'coverage/*', 'public/*', '.cache/*']
  },
  {
    plugins: {
      prettier: prettierPlugin,
      vue: vuePlugin,
      import: importPlugin
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          useTabs: false,
          tabWidth: 2,
          printWidth: 100,
          bracketSpacing: true,
          trailingComma: 'none',
          endOfLine: 'auto',
          arrowParens: 'avoid',
          vueIndentScriptAndStyle: true
        }
      ],

      'vue/multi-word-component-names': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 1 }],

      'vue/html-indent': ['error', 2],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1
        }
      ],
      'vue/singleline-html-element-content-newline': [
        'warn',
        {
          ignoreWhenNoAttributes: true,
          ignoreWhenEmpty: true,
          ignores: ['pre', 'textarea']
        }
      ],
      'vue/multiline-html-element-content-newline': [
        'warn',
        {
          ignoreWhenEmpty: true,
          ignores: ['pre', 'textarea'],
          allowEmptyLines: false
        }
      ]
    }
  }
]
