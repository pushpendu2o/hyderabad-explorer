-- Moves Discover's place write-ups and the Feed's long-form articles out
-- of static JS files and into Supabase, so new content is a database
-- write instead of a code change + redeploy.
--
-- World-readable (place_info to everyone, articles only where
-- published=true), writable by nobody via the client -- content is
-- curated by hand through the Supabase SQL editor/table editor, same as
-- before, just without needing a deploy.

create table place_info (
  place_id text primary key references places(id),
  gallery jsonb not null,
  about text not null,
  facts jsonb not null,
  tips jsonb not null,
  avoid jsonb not null,
  nearby jsonb not null
);

alter table place_info enable row level security;
create policy "place_info_select_all" on place_info for select using (true);

create table articles (
  id text primary key,
  sort_order int not null,
  title text not null,
  creator text not null,
  youtube_id text not null,
  youtube_url text not null,
  teaser text not null,
  sections jsonb not null,
  interesting_part text not null,
  watch_out_part text not null,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table articles enable row level security;
create policy "articles_select_published" on articles for select using (published = true);
