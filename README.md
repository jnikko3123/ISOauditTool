# ISO Audit Tool

Lightweight ISO audit portal built as a static site. This repository is configured for Netlify so you can deploy without additional tooling.

## Project structure

- `index.html` – main HTML document
- `style.css` – global styling for the portal UI
- `app.js` – client-side logic and Supabase integration
- `scripts/build.sh` – build script used by Netlify to inject environment variables and copy assets into `dist/`
- `netlify.toml` – Netlify configuration that runs the build script and serves the `dist` directory

## Prerequisites

- Supabase project (URL and anon key)
- Netlify account

## Environment variables

The build expects the following variables to be defined in Netlify (Site settings → Build & deploy → Environment):

- `SUPABASE_URL` – URL of your Supabase project
- `SUPABASE_ANON_KEY` – anonymous key for the project

If either variable is missing, the client will surface an error when the page loads.

## Local preview

1. Export your Supabase credentials in the current shell:
   ```bash
   export SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
   export SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
   ```
2. Run the build script and serve the output:
   ```bash
   bash scripts/build.sh
   npx serve dist
   ```
   Open the local address printed by `serve` to view the app.

## Deploying to Netlify

1. Add this repository to Netlify as a new site.
2. Set the build command to `bash scripts/build.sh` and publish directory to `dist` (already defined in `netlify.toml`).
3. Add the `SUPABASE_URL` and `SUPABASE_ANON_KEY` environment variables in the site settings.
4. Trigger a deploy. Netlify will build into `dist` and serve the static output.
