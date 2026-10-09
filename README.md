# Hyderabad Locals

A hyperlocal social app for Golconda Fort, Charminar, Medak Fort, Rachakonda Fort and
Hussain Sagar: real posts (questions, trip reports, "what I liked," "didn't expect this,"
safety heads-ups), a comment thread under each post, and 1:1 chat gated by an
accept-first-message flow. Discover blends a short static write-up per place with a
trending panel computed live from real post activity.

No backend server to run — the static frontend talks straight to Supabase
(Postgres + Auth + Realtime) over HTTPS.

## One-time setup

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql` (the seed
   script adds a handful of fake local accounts with realistic posts/comments/chats so
   the app doesn't look empty before real users show up).
3. In Project Settings → API, copy the **Project URL** and **anon public key** into
   `js/config.js`.
   - The anon key is *meant* to be public/client-side — every table it can touch is
     locked down by the Row Level Security policies in `schema.sql`. This is a different
     situation from a server-side secret like a YouTube API key; don't confuse the two.
     Never put the **service_role** key anywhere in this repo.
4. Open `index.html` via a local server (e.g. `python -m http.server 8000`) or push to
   GitHub Pages.

## Auth model

Every visitor gets a real Supabase session via anonymous sign-in
(`supabase.auth.signInAnonymously()`) — no email or password, just a one-time display
name prompt. This exists purely so Row Level Security has a stable `auth.uid()` to key
policies off of.

## Data model

- `places` — the 5 fixed places (id, name, lat/lng)
- `profiles` — display name + last-known location
- `posts` / `comments` — world-readable, writable only as yourself
- `message_requests` — a DM request between two profiles; `status` starts `pending`
  and only the **recipient** can flip it to `accepted`
- `messages` — only insertable once the parent request is `accepted`; only visible to
  the two parties on that request

Full DDL and RLS policies are in `supabase/schema.sql`.

## Related project

The older, separate project — curated static travel content for the same 5 places,
no accounts, no posting — lives at
[github.com/pushpendu2o/hyderabad-explorer_v0](https://github.com/pushpendu2o/hyderabad-explorer_v0),
hosted at `pushpendu2o.github.io/hyderabad-explorer_v0`.
