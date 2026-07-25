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

## Schema

`users` contains only `clerkUserId` and a `by_clerkUserId` index for efficient
lookup by the Clerk identifier.
