import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // Global ignores must be in their own standalone object in Flat Config
  { ignores: ['dist', 'node_modules', '.eslintrc.cjs'] },
  
  // Directly inject standard JS recommended rules as a standalone object
  js.configs.recommended,
  
  // Custom configuration object for our React source code
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node, // Added to prevent undefined process/__dirname errors during build
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    // Explicitly define plugins instead of using invalid 'extends' arrays
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Spread the recommended rules directly from the plugin exports
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Allow unused variables only if they start with a capital letter or underscore
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
];