# Townhall

Our mission is to bridge the gap between citizens and the legislative process by making federal bills accessible and local voices measurable. Through transparent AI and aggregated district-level data, we equip individuals to trust the data, share their perspective, and take unified civic action.

## Prerequisites

- Node.js 20 or later
- [pnpm](https://pnpm.io/) 10.33.4
- A [Clerk](https://clerk.com/) development instance
- A [Convex](https://www.convex.dev/) account

Install dependencies:

```bash
pnpm install
```

If pnpm is not already available, Node.js Corepack can activate the version
pinned by this repository:

```bash
corepack enable
```

## Run locally

1. Create the web app's local environment file:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

2. In your Clerk Dashboard, create or select a development instance and add its
   keys to `apps/web/.env.local`. See [Environment variables](#environment-variables)
   for the required values. If you use the Clerk CLI, you can pull the values
   without adding them to shell history:

   ```bash
   cd apps/web
   clerk env pull --file .env.local
   cd ../..
   ```

3. Set up a Convex development deployment:

   ```bash
   pnpm --filter @townhall/backend setup
   ```

   Follow the Convex CLI prompts to sign in and create or select a development
   deployment. In that deployment's Convex Dashboard, set the
   `CLERK_JWT_ISSUER_DOMAIN` environment variable to your Clerk Frontend API URL.

4. Start the workspace:

   ```bash
   pnpm dev
   ```

   The web app is served at [http://localhost:3000](http://localhost:3000).
   Run `pnpm --filter @townhall/backend dev` in a separate terminal
   whenever you need the Convex development process by itself.

## Environment variables

Never commit `.env.local` files or real credentials. The checked-in examples
document the required names and are safe to copy.

### `apps/web/.env.local`

Copy `apps/web/.env.example` and populate these values from your Clerk
development instance:

| Variable                            | Required | Description                                                                                  |
| ----------------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `CLERK_PUBLISHABLE_KEY`             | Yes      | Clerk publishable key for the web application.                                               |
| `CLERK_SECRET_KEY`                  | Yes      | Server-only Clerk secret key. Never expose or commit it.                                     |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes      | Public Clerk publishable key consumed by the browser. Use the same publishable key as above. |

### `packages/backend/.env.local` and Convex

The Convex CLI creates `packages/backend/.env.local` while setting up a
deployment. Do not edit or commit its generated deployment settings. The
backend's application environment is configured in the Convex Dashboard for
each deployment. Copy `packages/backend/.env.example` as a reference and set:

| Variable                  | Required | Description                                                                                                          |
| ------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `CLERK_JWT_ISSUER_DOMAIN` | Yes      | Your Clerk Frontend API URL, for example `https://your-instance.clerk.accounts.dev`. This is not a Clerk secret key. |

Set this variable in both the Convex development and production deployments so
Convex can validate Clerk-issued JWTs.

## Contributing

1. Create a branch from the current default branch.
2. Install dependencies and configure the local services as described above.
3. Keep changes focused and include tests or validation appropriate to the
   package you changed.
4. Before opening a pull request, run the relevant checks:

   ```bash
   pnpm typecheck
   pnpm lint
   NODE_ENV=production pnpm build
   ```

   To check one package while iterating, use its workspace filter, for example:

   ```bash
   pnpm --filter web typecheck
   pnpm --filter @townhall/backend typecheck
   ```

5. Open a pull request that explains the change, how it was validated, and any
   environment or deployment follow-up required.

## Repository layout

| Path                         | Purpose                                        |
| ---------------------------- | ---------------------------------------------- |
| `apps/web`                   | Next.js web application and Clerk integration. |
| `packages/backend`           | Convex schema and backend functions.           |
| `packages/ui`                | Shared shadcn/ui-based components and styles.  |
| `packages/eslint-config`     | Shared ESLint configuration.                   |
| `packages/typescript-config` | Shared TypeScript configuration.               |
