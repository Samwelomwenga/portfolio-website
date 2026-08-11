/**
 * Empty stand-in for the `server-only` marker package, used only by the Vitest
 * config's module alias. The real package throws when imported outside a React
 * Server Component graph; under Vitest the assistant's server modules run in a
 * plain Node process that never reaches the client, so the marker is a no-op.
 */
export {}
