# Deployment Guide — Ananda Yoga Kendra

## Prerequisites
- Node.js 18+ installed
- A [Supabase](https://supabase.com) account (free)
- A [Vercel](https://vercel.com) account (free)
- A [GitHub](https://github.com) account (for Vercel deployment)

---

## Step 1 — Install dependencies locally

```bash
cd yoga-school
npm install
```

---

## Step 2 — Create Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a region close to India (e.g. ap-south-1 Mumbai if available, else Singapore)
3. Set a strong database password — **save it**
4. Wait ~2 minutes for the project to spin up

---

## Step 3 — Apply the database schema

1. In your Supabase project → **SQL Editor** → **New query**
2. Open `supabase/schema.sql` from this repo
3. Paste the entire contents and click **Run**
4. You should see "Success. No rows returned."

---

## Step 4 — Configure environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in the values from your Supabase project:
- Go to Supabase → **Settings → API**
- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- (Optional) Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 5 — Personalise content

Open these files and replace all placeholder values:

| File | What to update |
|---|---|
| `messages/en.json` | School name, address, phone, email, teacher name & bio |
| `messages/hi.json` | Same in Hindi |
| `messages/bn.json` | Same in Bengali |
| `src/components/home/HeroSection.tsx` | Stats (years, students) |
| `src/components/home/TestimonialsSection.tsx` | Real testimonials |
| `src/components/home/MapSection.tsx` | Real Google Maps embed URL |
| `src/components/WhatsAppButton.tsx` | `WHATSAPP_NUMBER` constant |
| `src/app/[locale]/layout.tsx` | SEO metadata |

**Google Maps embed URL:** Go to Google Maps → search your address → Share → Embed a map → copy the `src` URL from the `<iframe>` tag.

---

## Step 6 — Test locally

```bash
npm run dev
```

Visit `http://localhost:3000` — you should be redirected to `/en/`.

Test all three languages: `/en/`, `/hi/`, `/bn/`

---

## Step 7 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — Ananda Yoga Kendra Phase 1"
git remote add origin https://github.com/YOUR_USERNAME/yoga-school.git
git push -u origin main
```

---

## Step 8 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
2. Vercel auto-detects Next.js — no framework config needed
3. Add **Environment Variables** in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

---

## Step 9 — Custom domain

1. In Vercel → **Settings → Domains** → Add your domain
2. Follow the DNS instructions (CNAME or A record at your registrar)
3. Vercel provisions SSL automatically

---

## Step 10 — Create the first admin user

1. In Supabase → **Authentication → Users** → Invite user (enter the teacher's email)
2. Teacher clicks the email link and sets up their account
3. In Supabase → **Table Editor → profiles** → find the teacher's row → set `role` to `admin`

That's it — the teacher can now log in and see the Admin dashboard.

---

## Step 11 — Set up the daily cron ping (prevents Supabase free-tier pause)

Create `src/app/api/ping/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  await supabase.from('batches').select('id').limit(1);
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}
```

Then in Vercel → **Settings → Cron Jobs** → Add:
- Path: `/api/ping`
- Schedule: `0 4 * * *` (runs daily at 4 AM UTC)

This keeps the Supabase project from pausing after 7 days of inactivity on the free tier.

---

## Content to personalise before launch

| File | What to update |
|---|---|
| `src/components/members/UPIPayment.tsx` | `UPI_ID`, `UPI_QR_URL`, `SCHOOL_NAME` constants |
| `src/components/events/EventCard.tsx` | `WHATSAPP_NUMBER` constant |
| `public/upi-qr.png` | Add your actual UPI QR code image |
| `messages/hi.json` | Translate remaining Hindi strings |
| `messages/bn.json` | Translate remaining Bengali strings |

## Optional future upgrades

- Razorpay / Cashfree payment gateway (replace screenshot flow)
- Push notifications via OneSignal for events
- SMS OTP via Twilio instead of email magic link

---

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Build for production (checks for errors) |
| `npm run lint` | Lint the codebase |
