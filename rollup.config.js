import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from "rollup-plugin-babel";
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json'

export default {
  input: './src/proxy.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'esm' }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel(),
    terser()
  ]
}