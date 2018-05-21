import flow from 'rollup-plugin-flow';
import pkg from './package.json';

export default {
  input: 'src/duck.js',
  external: ['immer'],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' },
  ],
  plugins: [flow({ pretty: true })],
};
