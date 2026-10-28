export default {
  "*.{ts,tsx,js,jsx}": ["prettier --write", "eslint --fix"],
  "*.{json,css,md,html,yml,yaml}": "prettier --write",
  "*.{ts,tsx}": () => "npm run typecheck",
}
