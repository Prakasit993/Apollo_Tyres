# AGENTS.md

## Cursor Cloud specific instructions

Apollo Tyres is a single Next.js 16 (App Router, React 19, Turbopack) e-commerce app
backed by Supabase (PostgreSQL + PostgREST + GoTrue auth + Storage). There is no separate
backend service — Next.js server actions/route handlers talk to Supabase directly.
Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`).

### Dependencies
- The startup update script runs `npm install` (repo uses npm; `.npmrc` sets `legacy-peer-deps=true`, required to resolve peer deps).
- Node 20+/22 works (`next dev` uses Turbopack).

### Running the app (dev)
- `npm run dev` serves the storefront + admin on http://localhost:3000 (put it in a tmux/background terminal — it is a long-running foreground process, not part of the update script).
- The app reads `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` (gitignored). Without a reachable Supabase, pages that fetch data error at request time.

### Local Supabase backend (NOT in the update script — Docker + service startup)
Future VMs start without Docker/Supabase. Bring the backend up manually when you need to run the app:
1. Docker is required. Install Docker CE, then for this Firecracker VM use the fuse-overlayfs storage driver. Docker 29 additionally needs `"features": {"containerd-snapshotter": false}` in `/etc/docker/daemon.json` for fuse-overlayfs to work, and iptables-legacy (`update-alternatives --set iptables /usr/sbin/iptables-legacy`). Start with `sudo dockerd` (background) and `sudo chmod 666 /var/run/docker.sock`.
2. Install the Supabase CLI (`supabase_linux_amd64.tar.gz` from the supabase/cli releases) to `/usr/local/bin/supabase`.
3. `supabase start` (from repo root; `supabase/config.toml` is committed). First run pulls several GB of images. It prints `API_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY`, `DB_URL`.
4. Put those values into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`=API_URL, `NEXT_PUBLIC_SUPABASE_ANON_KEY`=ANON_KEY, `SUPABASE_SERVICE_ROLE_KEY`=SERVICE_ROLE_KEY). The default local keys are stable across restarts.

### Schema gotchas (important)
- The repo's SQL under `supabase/` and `supabase/migrations/` is order-dependent and inconsistent: base tables are created as `products`/`orders`/... then renamed to `tyres_*` by `rename_tables_to_tyres.sql`, and several referenced tables are created by loose files outside `migrations/`. Do NOT rely on `supabase db reset`/auto-migrations — they will fail. `config.toml` has `[db.migrations] enabled = false` and `[db.seed] enabled = false` for this reason.
- Instead, apply the consolidated, idempotent schema after `supabase start`:
  `docker exec -i supabase_db_workspace psql -U postgres -d postgres < supabase/dev_local_schema.sql`
  (`supabase/dev_local_schema.sql` reconstructs the final `tyres_*` schema + RLS + seed data; the container name is `supabase_db_<project-dir>`, here `supabase_db_workspace`).
- The app queries `tyres_products`, `tyres_orders`, `tyres_order_items`, `tyres_cart_items`, `tyres_reviews`, `tyres_site_settings`, and `profiles`.

### Auth gotchas (login/signup)
- Login and signup forms hard-require a Cloudflare Turnstile captcha token client-side. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA` (Cloudflare "always passes" test key) in `.env.local` so the widget auto-verifies. Local GoTrue has captcha disabled, so the token is ignored server-side. Changing `NEXT_PUBLIC_*` requires restarting `next dev`.
- Local GoTrue has email confirmations off, so signups are auto-confirmed. To create a ready-to-use account without the UI, call the admin API with the service role key: `POST http://127.0.0.1:54321/auth/v1/admin/users` with `{"email":...,"password":...,"email_confirm":true}`. A `profiles` row is auto-created by the `on_auth_user_created` trigger.
- Admin dashboard (`/admin`) requires a profile with `role = 'admin'` (update the `profiles` row in the DB).

### Lint/build
- `npm run lint` works but the repository currently has pre-existing eslint errors (mostly `@typescript-eslint/no-explicit-any`); this is the repo's baseline, not a setup problem. `next build` runs eslint and will fail on those errors, so prefer `npm run dev` for development.
