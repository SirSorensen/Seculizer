import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [
    {
    input: "src/example.ts",
    output: {
      file: "dist/example.js",
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
  }
];
