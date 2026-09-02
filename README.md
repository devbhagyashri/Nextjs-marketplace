# Company Marketplace

A Next.js marketplace where users can browse companies for sale, list their own, and express buyer interest.

Sign-in is handled with **Google OAuth** through **Supabase**. Listings, images, and interest records are stored in Supabase Postgres and Storage.

## Features

- Google sign-in with protected seller pages
- Browse listings with search, industry, and price filters
- Company detail pages
- Create a listing with validation and optional image upload
- Express interest (not on your own listing, no duplicates)
- Manage your listings and view interested buyers
- Loading, empty, and error states

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS and shadcn/ui
- Supabase Auth, Postgres, and Storage
- Zod for listing validation

## Getting started

### Requirements

- Node.js 18.18 or later
- A [Supabase](https://supabase.com) project
- A Google Cloud OAuth client (Web)

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase values from **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
```

Do not commit `.env.local`.

### 3. Database and storage

In the Supabase **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql).

This creates:

- `companies` and `company_interests` tables
- Row Level Security policies
- A public `company-images` storage bucket

### 4. Google authentication

1. In Supabase, open **Authentication → Providers → Google** and enable it.
2. In [Google Cloud Console](https://console.cloud.google.com/auth/clients), create a **Web application** OAuth client.
3. Add:
   - Authorized JavaScript origin: `http://localhost:3000`
   - Authorized redirect URI: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
4. Paste the Client ID and Client Secret into the Supabase Google provider and save.
5. In **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**` and `http://localhost:3000/auth/callback`

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Routes

| Path | Description |
| --- | --- |
| `/` | Marketplace browse and filters |
| `/companies/[id]` | Company detail and interest |
| `/sell` | Create a listing (signed in) |
| `/my-listings` | Edit/delete your listings (signed in) |
| `/seller/interests` | Buyers interested in your companies (signed in) |
| `/auth/callback` | Google OAuth callback |

## Project structure

```text
app/                  App Router pages, layout, and auth callback
components/           UI and feature components
lib/supabase/         Browser, server, and middleware clients
lib/data.ts           Server-side data fetching
middleware.ts         Session refresh and route protection
supabase/schema.sql   Database, RLS, and storage setup
```

## Troubleshooting

| Issue | What to check |
| --- | --- |
| `Unsupported provider: provider is not enabled` | Google is not enabled on **this** Supabase project |
| `redirect_uri_mismatch` | Google redirect URI must match `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` |
| Image upload RLS error | Re-run `supabase/schema.sql` so the storage policies exist |
| Listings fail to load | Confirm `.env.local` is set and `schema.sql` has been run |
| Sign-in returns to a blank error | Add `http://localhost:3000/auth/callback` to Supabase redirect URLs |
