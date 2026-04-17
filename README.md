# Jermuk Travel

Multilingual React + Vite city guide for Jermuk with:

- public pages
- admin CMS
- live weather
- AI assistant
- Firebase view analytics
- PWA/service worker support

## Local development

Requirements:

- Node.js 22.16.0
- npm

Commands:

```bash
npm install
npm run dev
npm run lint
npm run build
```

## Environment variables

Copy values from `.env.example` and set the real values in your deployment environment.

Required for production:

- `VITE_SITE_URL`
- `VITE_AI_ENDPOINT`
- `VITE_FIREBASE_RTDB_URL`
- `VITE_FIREBASE_RTDB_NODE`
- `VITE_ADMIN_USERNAME`
- `VITE_ADMIN_PASSWORD`

Optional:

- `VITE_ANDROID_APP_URL`
- `VITE_IOS_APP_URL`
- `VITE_FIREBASE_RTDB_WRITE_ENABLED`

## Cloudflare Pages

Recommended Pages settings:

- Framework preset: `Vite`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node version: `22.16.0`

Important notes:

- This project uses `BrowserRouter`.
- Keep the app as a single-page application.
- Do not add a top-level `404.html` file unless you also want to change the SPA fallback behavior.
- `dist` should contain `index.html`, `assets`, `sw.js`, `manifest.webmanifest`, `robots.txt`, and `sitemap.xml`.

## GitHub -> Cloudflare deploy checklist

1. Push the repository to GitHub.
2. Import the repository into Cloudflare Pages.
3. Set the production environment variables in Cloudflare Pages.
4. Confirm:
   - build command is `npm run build`
   - output directory is `dist`
   - Node version is `22.16.0`
5. Add the custom domain.
6. After the first deploy, test these direct URLs:
   - `/`
   - `/places`
   - `/routes`
   - `/ai`
   - `/help`
   - `/faq`
   - `/about`
   - `/contact`
   - `/terms`
   - `/privacy`
   - `/admin/login`
   - `/admin`

## Deployment checks already passing

Current local verification:

- `npm run lint`
- `npm run build`

## Notes

- AI falls back to local answers if the remote AI endpoint is unavailable.
- Weather loads from Open-Meteo at runtime.
- View analytics write to Firebase Realtime Database.
- If your Firebase rules allow public reads but block writes, set `VITE_FIREBASE_RTDB_WRITE_ENABLED=false` to keep the footer counter in read-only mode without repeated `401 Unauthorized` write attempts.
- The service worker is enabled only in production builds.
