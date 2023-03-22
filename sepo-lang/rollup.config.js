import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

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
        browser: true,
        preferBuiltins: true,
      }),
      commonjs(),
    ],
  },
];
