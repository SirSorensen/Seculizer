import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from 'rollup-plugin-dts'

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
      sourcemap: true,
      exports: "default",
    },
    plugins: [
      typescript(),
      resolve({
        browser: false,
        preferBuiltins: true,
      }),
      commonjs(),
    ],
  }/*,
  {
    // path to your declaration files root
    input: "./dist/dts/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },*/
];
