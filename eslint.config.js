import antfu from '@antfu/eslint-config';

export default antfu({
  typescript: true,
  react: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
    semi: true,
  },
  ignores: [
    'src/routeTree.gen.ts',
  ],
  rules: {
    'no-console': 'off',
  },
});
