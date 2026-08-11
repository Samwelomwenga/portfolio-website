import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

/**
 * Vitest config for the assistant evaluation gate (I6) and other unit tests.
 *
 * - `@/*` is resolved to `src/*` to match the tsconfig path alias (Vitest does
 *   not read `tsconfig` paths on its own).
 * - `server-only` is aliased to an empty stub so the server-guarded assistant
 *   modules (`portfolio-context`, `system-instruction`, `run`, `limits`) can be
 *   imported in a plain Node test process without throwing. In the real build
 *   Next resolves `server-only` via its `react-server` export condition; here we
 *   never ship this bundle, so an empty module is the equivalent no-op.
 * - Only test files under `src/` are collected, keeping this runner disjoint from the
 *   Playwright e2e suite under `tests/`.
 */
export default defineConfig({
  resolve: {
    alias: [
      {
        find: "server-only",
        replacement: fileURLToPath(new URL("./src/lib/assistant/eval/server-only-stub.ts", import.meta.url)),
      },
      {
        find: /^@\/(.*)$/,
        replacement: `${fileURLToPath(new URL("./src", import.meta.url))}/$1`,
      },
    ],
  },
  test: {
    include: ["src/**/*.test.ts"],
    environment: "node",
  },
})
