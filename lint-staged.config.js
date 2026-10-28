export default {
  '*.{ts,tsx,js,jsx}': 'eslint --fix',
  '*.{ts,tsx}': () => 'npm run typecheck',
};
