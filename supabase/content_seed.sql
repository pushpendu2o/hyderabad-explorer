-- Run after content_schema.sql. Migrates the existing hardcoded content
-- from js/discover.js (STATIC_PLACE_INFO) and js/articles.js (ARTICLES)
-- into the new tables.

insert into place_info (place_id, gallery, about, facts, tips, avoid, nearby) values
(
  'golconda',
  '["https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/1280px-Golconda_Fort_005.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/00-Golconda-Fort-Hyderabad_01.jpg/1280px-00-Golconda-Fort-Hyderabad_01.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/00-Golconda-Fort-Hyderabad_03.jpg/1280px-00-Golconda-Fort-Hyderabad_03.jpg"]',
  'Golconda began as a mud-and-stone fort raised by the Kakatiya dynasty in the 13th century. The Qutb Shahis rebuilt it in granite and ruled from here for nearly a century — for a long stretch, Golconda was the world''s main source of diamonds, and the Koh-i-Noor is believed to have passed through its markets. It fell in 1687 after an 8-month Mughal siege.',
  '["Originally built 13th century by the Kakatiyas","Former source of the Koh-i-Noor diamond","Survived an 8-month Mughal siege before falling in 1687","Acoustic design carries sound ~1km uphill"]',
  '["The hand-clap trick at Fateh Darwaza echoes all the way to the Bala Hissar pavilion, nearly a kilometer away.","Early morning or after 4:30pm — no shade on the climb, midday sun is the biggest obstacle.","Sound-and-light show runs most evenings, narrated by Amitabh Bachchan."]',
  '["Midday heat with zero shade on an exposed, strenuous climb.","Steep, slippery stairs in the monsoon season.","Unregulated guide pricing — agree a price (₹300–500) before starting."]',
  '[{"id":"golconda_qutbshahitombs","title":"Qutb Shahi Tombs","distance":"~1 km","desc":"Tombs of the seven Qutb Shahi rulers — routinely combined into one visit."},{"id":"golconda_shahidastarkhwan","title":"Shahi Dastarkhwan","distance":"~6 km","desc":"Hyderabadi kebabs and biryani at reasonable prices."},{"id":"golconda_nimrah","title":"Nimrah Café & Bakery","distance":"~10 km","desc":"Classic Irani chai + Osmania biscuits, Old City detour."}]'
),
(
  'charminar',
  '["https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/A_view_of_Charminar_during_sunrise.jpg/1280px-A_view_of_Charminar_during_sunrise.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Busy_Charminar.jpg/1280px-Busy_Charminar.jpg"]',
  'Built in 1591 by Muhammad Quli Qutb Shah, Charminar ("Four Minarets") sits at the intersection of the old city''s four oldest roads. Its four 56m minarets have made it Hyderabad''s defining symbol for over 400 years; a small mosque still occupies the top floor.',
  '["Built 1591","4 minarets, each 56m tall","149 spiral steps to the upper floor","Closed 1–2pm Fridays for Jumma prayers"]',
  '["Evenings after dusk are the best \"wow\" moment — floodlit, alongside Laad Bazaar''s shopfronts.","Bargaining is the norm on bangles/pearls/souvenirs — start around half the quoted price.","Weekdays are noticeably calmer than weekends."]',
  '["Weekend and Friday-prayer crowding.","Pickpockets in the crowded bazaar lanes.","Inflated prices on fake \"pearl\"/\"silver\" souvenirs."]',
  '[{"id":"charminar_laadbazaar","title":"Laad Bazaar (Choodi Bazaar)","distance":"~50 m","desc":"Centuries-old lane famous for lac/glass bangles — best browsed early evening."},{"id":"charminar_meccamasjid","title":"Mecca Masjid","distance":"~100 m","desc":"One of India''s oldest mosques, a short walk away."},{"id":"charminar_chowmahalla","title":"Chowmahalla Palace","distance":"~600 m","desc":"Former seat of the Nizams, frequently paired with Charminar."}]'
),
(
  'medak',
  '["https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Medak_Fort_by_Varsha_Bhargavi_Kondapalli_02.jpg/1280px-Medak_Fort_by_Varsha_Bhargavi_Kondapalli_02.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Medak_Fort_by_Varsha_Bhargavi_Kondapalli_01.jpg/1280px-Medak_Fort_by_Varsha_Bhargavi_Kondapalli_01.jpg"]',
  'Medak Fort started as a 12th-century Kakatiya hill fort, later held by the Qutb Shahis. Unlike Golconda, it never became a dynasty''s capital in its own right — it stayed a regional garrison, which is part of why it reads today as quiet ruins rather than a polished monument.',
  '["Originally built ~12th century by the Kakatiyas","~90-100km from Hyderabad","Free entry, no fixed hours","~500 steps for the full circuit"]',
  '["Usually paired same-day with Medak Cathedral, ~15-20 min away — Asia''s largest diocese.","No signage or facilities on-site — food/rest stops are at a separate hotel nearby.","October–March is the better window for cooler weather."]',
  '["Poor maintenance — real neglect, not rustic charm.","Rough approach road — avoid after dark.","No food/water on-site — carry your own."]',
  '[{"id":"medak_cathedral","title":"Medak Cathedral","distance":"~3 km","desc":"Asia''s largest diocese, Gothic-style, seats ~5,000."},{"id":"medak_haritha","title":"Haritha Hotel/Resort","distance":"~2 km","desc":"Government-run lodging with a restaurant near the fort."}]'
),
(
  'rachakonda',
  '["https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Main_entrance_in_south.JPG/1280px-Main_entrance_in_south.JPG","https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Rachakonda_fort.jpg/1280px-Rachakonda_fort.jpg"]',
  'Rachakonda was the capital of the Recherla Velama chiefs, a 14th-century regional dynasty that briefly rivaled the sultans of the Deccan. There''s no restored palace interior here — what survives is stone fortification scattered across a rocky hillside, which is why it reads as a trek more than a monument visit.',
  '["Capital of the Recherla Velama dynasty, 14th century","~60km from Hyderabad","No public transport access","~2-2.5hr round trip trek"]',
  '["No public transport — go by private vehicle or hired taxi.","Go in a group, not solo — the area is genuinely deserted.","No food, water, or shops anywhere on the trek — carry everything."]',
  '["No phone network near the waterfalls detour.","Genuinely isolated — don''t go alone.","Unmaintained ruins — watch footing."]',
  '[{"id":"rachakonda_waterfalls","title":"Pallagattu Waterfalls","distance":"~1.5 km","desc":"Reachable via a trail opposite the fort''s signpost."},{"id":"rachakonda_dhabas","title":"Highway dhabas toward Choutuppal","distance":"~5 km","desc":"The practical breakfast/snack option — nothing at the fort itself."}]'
),
(
  'hussainsagar',
  '["https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg/1280px-Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Budhha_Statue_at_Hussain_Sagar_Lake_Hyderabad.jpg/1280px-Budhha_Statue_at_Hussain_Sagar_Lake_Hyderabad.jpg"]',
  'Built in 1562 by Hussain Shah Wali, Hussain Sagar has served as the water boundary between Hyderabad and Secunderabad ever since. Its best-known feature, the 16m monolithic Buddha statue at the lake''s center, wasn''t part of the original lake — it was added in 1992, and sank during its first installation attempt.',
  '["Built in 1562","Separates Hyderabad & Secunderabad","16m monolithic Buddha statue, added 1992","Tank Bund promenade lines the eastern edge"]',
  '["Sunset (~5-7pm) gives the best lake-and-skyline light, with boat rides to the statue.","Tank Bund at sunrise is a local favorite for walking/jogging.","Avoid Necklace Road after ~10pm."]',
  '["Water pollution/smell up close.","Weekend crowding at Tank Bund and the laser show.","Necklace Road after ~10pm — gets isolated."]',
  '[{"id":"hussainsagar_lumbini","title":"Lumbini Park","distance":"~0.5 km","desc":"Boating, laser/musical fountain shows — gateway for the Buddha statue boat ride."},{"id":"hussainsagar_ntrgardens","title":"NTR Gardens","distance":"~1 km","desc":"Landscaped family garden with evening lighting, entry ₹20."},{"id":"hussainsagar_eatstreet","title":"Necklace Road Eat Street","distance":"~1.5 km","desc":"Evening street-food cluster — chaat, kebabs, Hyderabadi snacks."}]'
)
on conflict (place_id) do nothing;

insert into articles (id, sort_order, title, creator, youtube_id, youtube_url, teaser, sections, interesting_part, watch_out_part) values
(
  'charminar-ramadan-food-walk',
  1,
  'A Ramadan Food Walk Through Charminar: Iftar to Sehri',
  'Kunal Vijayakar (Khaane Mein Kya Hai)',
  'dEF3BcK4mw8',
  'https://www.youtube.com/watch?v=dEF3BcK4mw8',
  'From dates at Iftar to Khatti Khichadi at Sehri — a full night of eating around Charminar during Ramadan: Haleem, Pathar Ka Gosht, Turkish Marag, and more.',
  '[{"heading":"Breaking the fast: dates and Haleem","body":"The walk starts at Charminar right as the Ramadan crowds gather for Iftar. It opens the traditional way — dates first, to break the fast — before moving straight into Haleem, the slow-cooked wheat-and-meat dish Hyderabad is famous for during Ramadan."},{"heading":"Pathar Ka Gosht — the longest stop","body":"Pathar Ka Gosht, mutton grilled directly on a hot stone slab, gets the most screen time of any dish in the episode — it''s clearly the centerpiece of the walk."},{"heading":"Falooda, Turkish Marag, and seekh kebab","body":"From there it''s Mashallah Falooda, then a stop for Turkish Marag (a Yemeni-style soup that''s become part of Hyderabad''s Ramadan food scene) alongside seekh kebab and Turkish-style chai — the single longest combined segment in the video."},{"heading":"Phirni, then on to Sehri at Hotel Shadab","body":"Phirni (a rice pudding) closes out the Iftar half. The walk then shifts to Sehri — the pre-dawn meal before the next day''s fast — at Hotel Shadab, a named, well-known Old City institution, with Khatti Khichadi, Keema, and Bhaaji Gurda."}]',
  'Pathar Ka Gosht gets by far the most screen time of any single dish — mutton grilled straight on a hot stone slab, and the clear centerpiece of the whole walk.',
  'It''s a serious six-plus-stop binge — dates, Haleem, Pathar Ka Gosht, Falooda, Turkish Marag, seekh kebab, Phirni, and then a full second round of Sehri dishes. Pace yourself.'
),
(
  'ramoji-film-city-tour',
  2,
  'Inside the World''s Biggest Film City',
  'KK Create (Kavya Karnatac)',
  'rFrkgnRqdZs',
  'https://www.youtube.com/watch?v=rFrkgnRqdZs',
  '500+ sets, 60+ gardens, and a crew of 6,000 — a tour through why Ramoji Film City is the world''s biggest film studio, and why 200+ movies get shot there every year.',
  '[{"heading":"The scale of it","body":"The video opens with the scale of Indian cinema itself — the world''s 5th largest film industry, employing nearly 2 million people and releasing more than 2,500 films a year across 20+ languages. Ramoji Film City is framed as the physical engine behind a lot of that: over 1.5 million visitors a year, more than 200 films shot there annually, a facility about 26 times the size of the world''s biggest cricket stadium, a crew of 6,000+, and room to shoot up to 20 international or 40 domestic film productions at the same time."},{"heading":"500+ sets and special streets","body":"The tour covers the sheer number of standing sets — over 500 of them — plus specially built streets designed to double for different cities and countries without ever leaving the property."},{"heading":"The people behind it: set designers and construction","body":"A chunk of the video goes to the talent most visitors never think about — the set designers, and the construction and props facility big enough to build whatever a production needs from scratch, on site."},{"heading":"More than 60 gardens, and empty floors built for anything","body":"Ramoji Film City has more than 60 gardens built into it, alongside huge empty soundstage floors kept intentionally bare so they can become whatever the next production needs. There''s also on-site housing for an entire visiting film crew — so a full production can live there, not just shoot there."}]',
  'The video builds toward one final "biggest project" tease as its last specialty, right before closing out with stats on the Indian film industry as a whole.',
  'It''s shot in genuinely extreme heat — the creator notes filming at 50°C, so if you''re visiting, plan around the sun and carry water.'
),
(
  'golconda-fort-roadtrippin',
  3,
  'Golconda Fort: Natural Air Conditioning and the Kohinoor''s Origin',
  'Rocky Singh & Mayur Sharma (#RoadTrippinwithRnM, History TV18)',
  'b9Zr1TqfkmA',
  'https://www.youtube.com/watch?v=b9Zr1TqfkmA',
  'Rocky and Mayur visit Golconda Fort — from its ingenious passive cooling system to its connection with the origin of the Kohinoor diamond.',
  '[{"heading":"An engineering trick built for the heat","body":"Rocky and Mayur''s stop at Golconda Fort centers on a standout piece of 16th-century design: a passive cooling-and-heating system built into the king''s viewing pavilion at the top of the fort, which the show nicknames \"natural air conditioning\" — centuries-old engineering solving a very modern problem."},{"heading":"Where the Kohinoor came from","body":"The episode also traces the fort''s connection to one of the world''s most famous diamonds — the Kohinoor, discovered during the reign of Sultan Abdullah Qutub Shah, from an era when Golconda''s markets briefly made it the center of the world''s diamond trade."},{"heading":"The clap that travels a kilometre","body":"Golconda is also known for its acoustic design — a clap at the Fateh Darwaza entrance can be heard all the way up at the Bala Hissar pavilion, nearly a kilometre away, a centuries-old echo trick built right into the fort''s gates."}]',
  'The "natural air conditioning" engineering feature is the episode''s standout highlight — a genuinely clever piece of centuries-old design.',
  'The climb up to Bala Hissar is steep with little shade along the way, so go prepared for sun and a real workout if you''re making it to the top.'
)
on conflict (id) do nothing;
