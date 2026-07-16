export default {
  '*.{js,mjs,cjs,ts}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yaml,yml}': 'prettier --write',
};
