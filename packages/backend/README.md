# Convex backend

This package owns Townhall's Convex schema and backend functions.

## Setup

Run the initial setup from the repository root:

```bash
pnpm --filter @townhall/backend setup
```

The Convex CLI creates `packages/backend/.env.local` with the deployment URL.
Configure `CLERK_JWT_ISSUER_DOMAIN` in the Convex dashboard for the connected
development and production deployments. Its value is the Clerk Frontend API
URL (for example, `https://your-instance.clerk.accounts.dev`).

Configure `AI_GATEWAY_API_KEY` in the Convex dashboard so backend actions can
generate bill interpretations. The web app also needs the deployment's
`NEXT_PUBLIC_CONVEX_URL`.

## Schema

`users` contains only `clerkUserId` and a `by_clerkUserId` index for efficient
lookup by the Clerk identifier. `bills` stores one generated interpretation per
external bill identifier.
