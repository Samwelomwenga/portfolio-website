// eslint.config.mjs
import antfu from "@antfu/eslint-config"
import reactYouMightNotNeedAnEffect from "eslint-plugin-react-you-might-not-need-an-effect"

export default antfu({
  ignores: [
    ".agents/**",
    ".claude/**",
    ".codex/**",
    ".opencode/**",
    ".scratch/**",
    ".mcp.json",
    ".next/**",
    "build/**",
    "dist/**",
    "next-env.d.ts",
    "opencode.json",
    "out/**",
  ],
  nextjs: true,
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
    "pnpm/yaml-enforce-settings": ["off"],
    "react-refresh/only-export-components": ["off"],
    "unicorn/filename-case": ["error", {
      case: "kebabCase",
      ignore: [
        /^README.*\.md$/,
      ],
    }],
  },
}, {
  files: ["src/lib/env.ts"],
  rules: {
    "node/no-process-env": ["error", {
      allowedVariables: [
        "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
        "NEXT_PUBLIC_FORMSPREE_FORM_ID",
        "GOOGLE_GENERATIVE_AI_API_KEY",
        "ASSISTANT_MODEL",
      ],
    }],
  },
})
