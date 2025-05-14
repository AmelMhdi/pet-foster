import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin-js";

export default [
  js.configs.recommended,
  {
    plugins: {
      js: stylistic,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      semi: "error",
      indent: ["error", 2],
    },
  },
  {
    ignores: ["client/dist"],
  },
];
