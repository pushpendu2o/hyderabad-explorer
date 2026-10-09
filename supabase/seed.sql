-- Dummy content so the app doesn't look empty before real users arrive.
-- Run this AFTER schema.sql, in the Supabase SQL editor.
--
-- Seed accounts are real rows in auth.users (so posts/comments/messages
-- can carry real foreign keys), but they're never given a password and
-- can't actually sign in -- they only exist to make the feed look alive.
-- is_seed=true on every row they touch so real content can be told apart
-- later if you ever want to prune or visually badge them.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, confirmation_token, recovery_token,
  email_change_token_new, email_change, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, is_anonymous
) values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111101', 'authenticated', 'authenticated', 'seed-asha@local.invalid', '', now(), '', '', '', '', '{"provider":"seed"}', '{}', now(), now(), true),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111102', 'authenticated', 'authenticated', 'seed-vikram@local.invalid', '', now(), '', '', '', '', '{"provider":"seed"}', '{}', now(), now(), true),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111103', 'authenticated', 'authenticated', 'seed-fathima@local.invalid', '', now(), '', '', '', '', '{"provider":"seed"}', '{}', now(), now(), true),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111104', 'authenticated', 'authenticated', 'seed-rahul@local.invalid', '', now(), '', '', '', '', '{"provider":"seed"}', '{}', now(), now(), true),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111105', 'authenticated', 'authenticated', 'seed-priya@local.invalid', '', now(), '', '', '', '', '{"provider":"seed"}', '{}', now(), now(), true),
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111106', 'authenticated', 'authenticated', 'seed-sandeep@local.invalid', '', now(), '', '', '', '', '{"provider":"seed"}', '{}', now(), now(), true)
on conflict (id) do nothing;

insert into profiles (id, display_name, lat, lng, is_seed) values
  ('11111111-1111-1111-1111-111111111101', 'Asha K.', 17.3850, 78.4867, true),
  ('11111111-1111-1111-1111-111111111102', 'Vikram_HYD', 17.3616, 78.4747, true),
  ('11111111-1111-1111-1111-111111111103', 'Fathima R.', 17.4239, 78.4738, true),
  ('11111111-1111-1111-1111-111111111104', 'Rahul T.', 17.3833, 78.4011, true),
  ('11111111-1111-1111-1111-111111111105', 'Priya M.', 17.4399, 78.4983, true),
  ('11111111-1111-1111-1111-111111111106', 'Sandeep G.', 18.0460, 78.2630, true)
on conflict (id) do nothing;

-- Posts -----------------------------------------------------------------

insert into posts (id, author_id, place_id, post_type, title, body, is_seed, created_at) values
  ('22222222-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111101', 'golconda', 'question',
   'Best time to catch the sound and light show?',
   'Planning to go this weekend with my parents, they can''t walk too much in heat. Is the evening show worth it or is it mostly hype? Also is there a lift or only stairs to the top?',
   true, now() - interval '6 days'),

  ('22222222-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111104', 'golconda', 'trip_report',
   'Went yesterday, here''s the honest rundown',
   'Reached by 8am, glad I did because by 10:30 it was packed with school groups. The acoustics at the clap-and-echo spot genuinely work, heard it at Bala Hisar gate. Climb is steep in parts, carry water, almost no shade till the top. Sound and light show in the evening is decent, not amazing, but fine for a first visit.',
   true, now() - interval '5 days'),

  ('22222222-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111102', 'charminar', 'unexpected',
   'Did not expect the bangle market to be this overwhelming',
   'Went for Charminar, ended up spending 2 hours in Laad Bazaar instead. Nobody warned me how intense the bargaining culture is here, vendors quote double thinking you don''t know better. Also the mosque floor closes to visitors during prayer times, missed the top view because of that timing.',
   true, now() - interval '4 days'),

  ('22222222-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111103', 'hussainsagar', 'unsafe',
   'Be careful on the Tank Bund footpath at night',
   'Was walking back from Necklace Road around 9:30pm and the stretch near the statues has very poor lighting, a couple of guys on a bike slowed down near me which made me uncomfortable. Not trying to scare anyone off the lake, just stick to the busier, lit side and don''t go alone late.',
   true, now() - interval '3 days'),

  ('22222222-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111105', 'hussainsagar', 'like',
   'Sunset boat ride to Buddha statue is underrated',
   'Took the TSTDC boat around 5:45pm, timed it right so we were near the statue exactly at sunset. Cheap, no crowd on a weekday, and the skyline view on the way back is genuinely nice. Didn''t expect to enjoy it this much honestly.',
   true, now() - interval '2 days'),

  ('22222222-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111106', 'medak', 'question',
   'Is Medak Fort worth the drive if I''ve already seen Golconda?',
   'It''s like 90km from where I stay so it''s a half day commitment. Heard it''s more ruins than a maintained monument. Worth combining with the Cathedral or should I skip and do something closer instead?',
   true, now() - interval '1 days'),

  ('22222222-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111104', 'rachakonda', 'trip_report',
   'Rachakonda is a trek, not a monument visit, go prepared',
   'If anyone''s expecting a Golconda-style restored fort, this isn''t that. It''s scattered stone walls on a rocky hill, very few people around, no stalls or water on site. Went with a local guide from the nearby village who knew the gate layout, would''ve missed half of it otherwise. Good for a proper trek, bad for a casual stroll.',
   true, now() - interval '12 hours')
on conflict (id) do nothing;

-- Comments ("gossip") ------------------------------------------------

insert into comments (post_id, author_id, body, is_seed, created_at) values
  ('22222222-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111104', 'No lift, only stairs, but it''s a gradual climb not a cliff. Evening show is worth it once, mainly for the lighting on the fort walls.', true, now() - interval '5 days 20 hours'),
  ('22222222-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111106', 'Agree with above, go up before 9am if parents get tired easily, way less crowded and cooler.', true, now() - interval '5 days 18 hours'),

  ('22222222-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111101', 'The clap echo thing is so real, I thought it was a myth until I tried it myself lol', true, now() - interval '4 days 10 hours'),
  ('22222222-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111103', 'how crowded was it by the time you left? thinking of going around noon', true, now() - interval '4 days 8 hours'),
  ('22222222-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111104', '@Fathima R. honestly avoid noon in summer, zero shade near the top, we were dying by 11:30', true, now() - interval '4 days 7 hours'),

  ('22222222-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111105', 'this happened to me too, started at double and I got it down to less than half just by walking away twice', true, now() - interval '3 days 20 hours'),
  ('22222222-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111106', 'the mosque timing thing is annoying, they really should put the prayer windows somewhere visible for tourists', true, now() - interval '3 days 15 hours'),

  ('22222222-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111102', 'thanks for posting this, was planning an evening walk there this week, will stick to the lit side like you said', true, now() - interval '2 days 22 hours'),
  ('22222222-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111101', 'same experience near the same stretch a few months back, glad someone else said it, didn''t want to sound paranoid', true, now() - interval '2 days 20 hours'),

  ('22222222-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111102', 'which jetty did you board from? necklace road or the other side?', true, now() - interval '1 days 22 hours'),
  ('22222222-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111105', '@Vikram_HYD Necklace Road side, tickets were barely anything, maybe 100 bucks', true, now() - interval '1 days 20 hours'),

  ('22222222-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111104', 'worth it ONLY if you pair it with the Cathedral same day, otherwise it''s a lot of driving for just ruins', true, now() - interval '20 hours'),
  ('22222222-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111103', 'I went alone just for the fort and regretted not combining it tbh, agree with above', true, now() - interval '18 hours'),

  ('22222222-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111106', 'how did you find the guide? was he from TSTDC or just local?', true, now() - interval '10 hours'),
  ('22222222-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111104', '@Sandeep G. just a local from the village at the base, no official booking, just ask around when you reach', true, now() - interval '9 hours')
on conflict do nothing;

-- A demo message thread (request already accepted) ---------------------

insert into message_requests (id, sender_id, recipient_id, status, created_at) values
  ('33333333-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111106', '11111111-1111-1111-1111-111111111104', 'accepted', now() - interval '9 hours')
on conflict do nothing;

insert into messages (request_id, sender_id, body, created_at) values
  ('33333333-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111106', 'hey, saw your Rachakonda post, do you have the guide''s number by any chance?', now() - interval '9 hours'),
  ('33333333-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111104', 'no number, he just hangs around the base of the hill near the village tea stall most mornings, ask for "Shankar anna"', now() - interval '8 hours 50 minutes'),
  ('33333333-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111106', 'got it, thanks a lot, planning to go next weekend', now() - interval '8 hours 40 minutes')
on conflict do nothing;

-- A still-pending request, to demo the accept gate -----------------------

insert into message_requests (id, sender_id, recipient_id, status, created_at) values
  ('33333333-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111103', '11111111-1111-1111-1111-111111111105', 'pending', now() - interval '1 hours')
on conflict do nothing;
