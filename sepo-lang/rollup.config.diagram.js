import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
  {
    input: "src/diagram.ts",
    output: {
      file: "dist/diagram.js",
      format: "es",
      sourcemap: true,
      exports: "none",
    },
    plugins: [
      typescript(),
      resolve({
        browser: false,
        preferBuiltins: true,
      }),
      commonjs(),
    ],
  },
];
