import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { files: ["public/demos/**/*.js", "public/demos/**/*.mjs"], rules: { "@typescript-eslint/no-unused-vars": "off", "react-hooks/rules-of-hooks": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Upstream Pyodide runtime is copied intact and verified by hashes and browser execution.
    "public/demos/pyscreen/pyodide/**",
  ]),
]);

export default eslintConfig;
