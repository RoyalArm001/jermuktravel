# Jermuk Travel

Next.js full-stack project for a mobile-first social travel platform.

## What this version includes

- Beautiful responsive landing design with meaningful animations
- User registration and authentication (email/password + optional Google)
- Traveler community stories (users can share places and photo URLs)
- Inquiry capture for your sales/concierge workflow
- WordPress CMS bridge via REST API
- Prisma + PostgreSQL data model for long-term growth

## Stack

- Next.js App Router
- Tailwind CSS v4
- NextAuth
- Prisma ORM
- PostgreSQL

## Setup

1. Copy `.env.example` to `.env`
2. Fill in:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (optional)
   - `WORDPRESS_API_URL` (optional)
   - `WORDPRESS_API_USER` and `WORDPRESS_API_APP_PASSWORD` (optional)
3. Generate Prisma client
4. Run migration
5. Start dev server

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

## Main Routes

- `/` mobile-first landing and community sections
- `/auth/sign-up` registration
- `/auth/sign-in` sign in
- `/account` signed-in profile page
- `/api/stories` traveler story list/create
- `/api/inquiries` inquiry create
- `/api/cms/posts` WordPress feed proxy

## Database Planning

Full data model explanation:

- `docs/data-model-plan.md`

Short version:
- App DB stores users, stories, tags, media, inquiries.
- WordPress stores editorial content and is fetched through API.

## Important Security Note

- Google password is never stored.
- Local credentials passwords are stored only as secure hashes.

## Deploy (Vercel)

```bash
npm run build
npm run start
```

Production checklist:

- Production PostgreSQL database
- `DATABASE_URL`
- Correct `NEXTAUTH_URL`
- Strong `NEXTAUTH_SECRET`
- Google OAuth callback URLs (if Google auth is enabled)
- WordPress REST URL (if CMS feed is enabled)
- Keep `.env` local only. Put production secrets in the Vercel dashboard instead of committing them.

For Vercel:

- Import the repository as a regular Next.js project
- Keep the framework as `Next.js`
- Leave the output directory empty
- Add the required environment variables in the Vercel dashboard
- Add the production domain in `Settings -> Domains` before pointing DNS at it
- Run Prisma migrations against the production database before first use
- Set `NEXTAUTH_URL` to your production domain, for example `https://jermuktravel.com`
