module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'eslint:recommended', 'plugin:react-hooks/recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    next: {
      rootDir: ['src/'],
    },
  },
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-redeclare': 'off',
  },
  ignorePatterns: ['node_modules/', '.next/', 'public/', 'supabase/functions/'],
};


