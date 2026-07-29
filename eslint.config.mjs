// eslint.config.mjs
import antfu from "@antfu/eslint-config"
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect"

export default antfu({
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: "double",
  },
}, reactYouMightNotNeedAnEffect.configs.recommended, {
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
    "ts/no-floating-promises": "off",
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "react-refresh/only-export-components": ["off"],
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: [
        /^README.*\.md$/,
      ],
    }],
  },
})
