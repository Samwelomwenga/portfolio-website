// eslint.config.mjs
import antfu from "@antfu/eslint-config"

export default antfu({
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    quotes: "double",
  },
}, {
  rules: {
    "@typescript-eslint/no-floating-promises": "off",
    "ts/no-floating-promises": "off",
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
