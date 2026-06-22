# Nibedita Yoga Training Centre — Project URLs & Config Reference

## GitHub
- Repo: https://github.com/archishman-b/Yoga_school

## Supabase
- Project ref: xuzeixuugldfpxodlkej
- API URL: https://xuzeixuugldfpxodlkej.supabase.co
- Dashboard: https://supabase.com/dashboard/project/xuzeixuugldfpxodlkej
- Auth callback (for Google OAuth): https://xuzeixuugldfpxodlkej.supabase.co/auth/v1/callback

## Vercel
- Production URL: https://nibeditayoga.com
- Alias: https://www.nibedita.yoga
- Vercel deployment URL: https://yoga-school-ayegqfn2i-archishman-s-personal-space.vercel.app
- Auth callback (for Supabase redirect): https://nibeditayoga.com/auth/callback

## Google Cloud Console
- OAuth Authorised redirect URI: https://xuzeixuugldfpxodlkej.supabase.co/auth/v1/callback

---

## Checklist — Auth Setup

### Vercel → Settings → Environment Variables
- [ ] NEXT_PUBLIC_SUPABASE_URL = https://xuzeixuugldfpxodlkej.supabase.co
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY = (from Supabase → Settings → API)
- [ ] NEXT_PUBLIC_SITE_URL = https://nibeditayoga.com

### Vercel → Settings → Deployment Protection
- [ ] Set to "Preview Deployments Only" (so production is publicly accessible)

### Supabase → Authentication → URL Configuration
- [ ] Site URL = https://nibeditayoga.com
- [ ] Redirect URLs = https://nibeditayoga.com/auth/callback

### Supabase → Authentication → Providers → Google
- [ ] Enabled
- [ ] Client ID = (from Google Cloud Console)
- [ ] Client Secret = (from Google Cloud Console)

### Supabase → Authentication → SMTP (Resend)
- [ ] Sender name = Nibedita Yoga Training Centre
- [ ] Sender email = (your Resend verified sender)
- [ ] Host = smtp.resend.com
- [ ] Port = 465
- [ ] Username = resend
- [ ] Password = (Resend API key)

### Google Cloud Console → OAuth 2.0 Client
- [ ] Authorised redirect URI = https://xuzeixuugldfpxodlkej.supabase.co/auth/v1/callback
