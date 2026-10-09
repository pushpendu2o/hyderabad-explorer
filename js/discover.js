// Discover blends the curated static info from Hyderabad Explorer v0
// (gallery, about, facts, tips, things to avoid, nearby spots) with a
// trending panel computed live from real posts. Tapping a place opens a
// full detail view with the same depth as the original app, a bookmark
// toggle (saved places live in Profile), "+" buttons on nearby spots to
// add them to your itinerary (also in Profile), and a jump straight into
// the live feed filtered to that place.

const STATIC_PLACE_INFO = {
  golconda: {
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Golconda_Fort_005.jpg/1280px-Golconda_Fort_005.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/00-Golconda-Fort-Hyderabad_01.jpg/1280px-00-Golconda-Fort-Hyderabad_01.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/00-Golconda-Fort-Hyderabad_03.jpg/1280px-00-Golconda-Fort-Hyderabad_03.jpg',
    ],
    about: 'Golconda began as a mud-and-stone fort raised by the Kakatiya dynasty in the 13th century. The Qutb Shahis rebuilt it in granite and ruled from here for nearly a century — for a long stretch, Golconda was the world\'s main source of diamonds, and the Koh-i-Noor is believed to have passed through its markets. It fell in 1687 after an 8-month Mughal siege.',
    facts: ['Originally built 13th century by the Kakatiyas', 'Former source of the Koh-i-Noor diamond', 'Survived an 8-month Mughal siege before falling in 1687', 'Acoustic design carries sound ~1km uphill'],
    tips: ['The hand-clap trick at Fateh Darwaza echoes all the way to the Bala Hissar pavilion, nearly a kilometer away.', 'Early morning or after 4:30pm — no shade on the climb, midday sun is the biggest obstacle.', 'Sound-and-light show runs most evenings, narrated by Amitabh Bachchan.'],
    avoid: ['Midday heat with zero shade on an exposed, strenuous climb.', 'Steep, slippery stairs in the monsoon season.', 'Unregulated guide pricing — agree a price (₹300–500) before starting.'],
    nearby: [
      { id: 'golconda_qutbshahitombs', title: 'Qutb Shahi Tombs', distance: '~1 km', desc: 'Tombs of the seven Qutb Shahi rulers — routinely combined into one visit.' },
      { id: 'golconda_shahidastarkhwan', title: 'Shahi Dastarkhwan', distance: '~6 km', desc: 'Hyderabadi kebabs and biryani at reasonable prices.' },
      { id: 'golconda_nimrah', title: 'Nimrah Café & Bakery', distance: '~10 km', desc: 'Classic Irani chai + Osmania biscuits, Old City detour.' },
    ],
  },
  charminar: {
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/A_view_of_Charminar_during_sunrise.jpg/1280px-A_view_of_Charminar_during_sunrise.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Busy_Charminar.jpg/1280px-Busy_Charminar.jpg',
    ],
    about: 'Built in 1591 by Muhammad Quli Qutb Shah, Charminar ("Four Minarets") sits at the intersection of the old city\'s four oldest roads. Its four 56m minarets have made it Hyderabad\'s defining symbol for over 400 years; a small mosque still occupies the top floor.',
    facts: ['Built 1591', '4 minarets, each 56m tall', '149 spiral steps to the upper floor', 'Closed 1–2pm Fridays for Jumma prayers'],
    tips: ['Evenings after dusk are the best "wow" moment — floodlit, alongside Laad Bazaar\'s shopfronts.', 'Bargaining is the norm on bangles/pearls/souvenirs — start around half the quoted price.', 'Weekdays are noticeably calmer than weekends.'],
    avoid: ['Weekend and Friday-prayer crowding.', 'Pickpockets in the crowded bazaar lanes.', 'Inflated prices on fake "pearl"/"silver" souvenirs.'],
    nearby: [
      { id: 'charminar_laadbazaar', title: 'Laad Bazaar (Choodi Bazaar)', distance: '~50 m', desc: 'Centuries-old lane famous for lac/glass bangles — best browsed early evening.' },
      { id: 'charminar_meccamasjid', title: 'Mecca Masjid', distance: '~100 m', desc: 'One of India\'s oldest mosques, a short walk away.' },
      { id: 'charminar_chowmahalla', title: 'Chowmahalla Palace', distance: '~600 m', desc: 'Former seat of the Nizams, frequently paired with Charminar.' },
    ],
  },
  medak: {
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Medak_Fort_by_Varsha_Bhargavi_Kondapalli_02.jpg/1280px-Medak_Fort_by_Varsha_Bhargavi_Kondapalli_02.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Medak_Fort_by_Varsha_Bhargavi_Kondapalli_01.jpg/1280px-Medak_Fort_by_Varsha_Bhargavi_Kondapalli_01.jpg',
    ],
    about: 'Medak Fort started as a 12th-century Kakatiya hill fort, later held by the Qutb Shahis. Unlike Golconda, it never became a dynasty\'s capital in its own right — it stayed a regional garrison, which is part of why it reads today as quiet ruins rather than a polished monument.',
    facts: ['Originally built ~12th century by the Kakatiyas', '~90-100km from Hyderabad', 'Free entry, no fixed hours', '~500 steps for the full circuit'],
    tips: ['Usually paired same-day with Medak Cathedral, ~15-20 min away — Asia\'s largest diocese.', 'No signage or facilities on-site — food/rest stops are at a separate hotel nearby.', 'October–March is the better window for cooler weather.'],
    avoid: ['Poor maintenance — real neglect, not rustic charm.', 'Rough approach road — avoid after dark.', 'No food/water on-site — carry your own.'],
    nearby: [
      { id: 'medak_cathedral', title: 'Medak Cathedral', distance: '~3 km', desc: 'Asia\'s largest diocese, Gothic-style, seats ~5,000.' },
      { id: 'medak_haritha', title: 'Haritha Hotel/Resort', distance: '~2 km', desc: 'Government-run lodging with a restaurant near the fort.' },
    ],
  },
  rachakonda: {
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Main_entrance_in_south.JPG/1280px-Main_entrance_in_south.JPG',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Rachakonda_fort.jpg/1280px-Rachakonda_fort.jpg',
    ],
    about: 'Rachakonda was the capital of the Recherla Velama chiefs, a 14th-century regional dynasty that briefly rivaled the sultans of the Deccan. There\'s no restored palace interior here — what survives is stone fortification scattered across a rocky hillside, which is why it reads as a trek more than a monument visit.',
    facts: ['Capital of the Recherla Velama dynasty, 14th century', '~60km from Hyderabad', 'No public transport access', '~2-2.5hr round trip trek'],
    tips: ['No public transport — go by private vehicle or hired taxi.', 'Go in a group, not solo — the area is genuinely deserted.', 'No food, water, or shops anywhere on the trek — carry everything.'],
    avoid: ['No phone network near the waterfalls detour.', 'Genuinely isolated — don\'t go alone.', 'Unmaintained ruins — watch footing.'],
    nearby: [
      { id: 'rachakonda_waterfalls', title: 'Pallagattu Waterfalls', distance: '~1.5 km', desc: 'Reachable via a trail opposite the fort\'s signpost.' },
      { id: 'rachakonda_dhabas', title: 'Highway dhabas toward Choutuppal', distance: '~5 km', desc: 'The practical breakfast/snack option — nothing at the fort itself.' },
    ],
  },
  hussainsagar: {
    gallery: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg/1280px-Aerial_view_of_Hussain_Sagar_from_Bansalipet.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Budhha_Statue_at_Hussain_Sagar_Lake_Hyderabad.jpg/1280px-Budhha_Statue_at_Hussain_Sagar_Lake_Hyderabad.jpg',
    ],
    about: 'Built in 1562 by Hussain Shah Wali, Hussain Sagar has served as the water boundary between Hyderabad and Secunderabad ever since. Its best-known feature, the 16m monolithic Buddha statue at the lake\'s center, wasn\'t part of the original lake — it was added in 1992, and sank during its first installation attempt.',
    facts: ['Built in 1562', 'Separates Hyderabad & Secunderabad', '16m monolithic Buddha statue, added 1992', 'Tank Bund promenade lines the eastern edge'],
    tips: ['Sunset (~5-7pm) gives the best lake-and-skyline light, with boat rides to the statue.', 'Tank Bund at sunrise is a local favorite for walking/jogging.', 'Avoid Necklace Road after ~10pm.'],
    avoid: ['Water pollution/smell up close.', 'Weekend crowding at Tank Bund and the laser show.', 'Necklace Road after ~10pm — gets isolated.'],
    nearby: [
      { id: 'hussainsagar_lumbini', title: 'Lumbini Park', distance: '~0.5 km', desc: 'Boating, laser/musical fountain shows — gateway for the Buddha statue boat ride.' },
      { id: 'hussainsagar_ntrgardens', title: 'NTR Gardens', distance: '~1 km', desc: 'Landscaped family garden with evening lighting, entry ₹20.' },
      { id: 'hussainsagar_eatstreet', title: 'Necklace Road Eat Street', distance: '~1.5 km', desc: 'Evening street-food cluster — chaat, kebabs, Hyderabadi snacks.' },
    ],
  },
};

function computeTrending(posts) {
  const counts = {};
  for (const p of posts) {
    counts[p.place_id] = (counts[p.place_id] || 0) + 1;
  }
  return PLACES
    .map((place) => ({ place, count: counts[place.id] || 0 }))
    .sort((a, b) => b.count - a.count);
}

async function refreshDiscover() {
  await loadFeed();
  renderDiscover();
}

function renderDiscover() {
  const trending = computeTrending(feedPosts);
  const container = document.getElementById('discover-list');

  container.innerHTML = trending
    .map(({ place, count }) => {
      const info = STATIC_PLACE_INFO[place.id];
      return `
      <div class="discover-card" data-place-id="${place.id}">
        <img class="discover-card-thumb" src="${info.gallery[0]}" alt="${place.name}" loading="lazy" />
        <div class="discover-card-body">
          <div class="discover-card-top">
            <h3>${place.name}</h3>
            ${count > 0 ? `<span class="trending-badge">${count} post${count === 1 ? '' : 's'}</span>` : '<span class="trending-badge quiet">Quiet for now</span>'}
          </div>
          <p class="discover-about">${info.about.slice(0, 80)}…</p>
        </div>
      </div>`;
    })
    .join('');

  container.querySelectorAll('.discover-card').forEach((card) =>
    card.addEventListener('click', () => openPlaceDetail(card.dataset.placeId))
  );
}

function openPlaceDetail(placeId) {
  const place = placeById(placeId);
  const info = STATIC_PLACE_INFO[placeId];
  const count = feedPosts.filter((p) => p.place_id === placeId).length;

  document.getElementById('place-detail-name').textContent = place.name;
  document.getElementById('place-detail-gallery').innerHTML = info.gallery
    .map((url) => `<img src="${url}" alt="${place.name}" loading="lazy" />`)
    .join('');
  document.getElementById('place-detail-about').textContent = info.about;
  document.getElementById('place-detail-facts').innerHTML = info.facts.map((f) => `<li>${f}</li>`).join('');
  document.getElementById('place-detail-tips').innerHTML = info.tips.map((t) => `<li>${t}</li>`).join('');
  document.getElementById('place-detail-avoid').innerHTML = info.avoid.map((a) => `<li>${a}</li>`).join('');
  document.getElementById('place-detail-nearby').innerHTML = info.nearby
    .map(
      (n) => `
      <div class="nearby-row">
        <div class="nearby-row-text">
          <strong>${n.title}</strong> <span class="nearby-distance">${n.distance}</span>
          <p>${n.desc}</p>
        </div>
        <button class="nearby-add-btn" data-id="${n.id}" data-title="${escapeHtml(n.title)}" data-place-id="${placeId}" title="Add to itinerary">+</button>
      </div>`
    )
    .join('');
  document.getElementById('place-detail-post-count').textContent =
    count > 0 ? `${count} live post${count === 1 ? '' : 's'} from locals` : 'No posts yet — be the first';

  const bookmarkBtn = document.getElementById('place-detail-bookmark-btn');
  bookmarkBtn.textContent = isPlaceSaved(placeId) ? '★' : '☆';
  bookmarkBtn.onclick = () => {
    const saved = toggleSavedPlace(placeId);
    bookmarkBtn.textContent = saved ? '★' : '☆';
  };

  document.getElementById('place-detail-add-trip-btn').onclick = () => {
    addToItinerary({ kind: 'place', placeId, title: place.name });
    alert(`Added ${place.name} to your itinerary — organize it into a day from Profile.`);
  };

  document.getElementById('place-detail-overlay').querySelectorAll('.nearby-add-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToItinerary({ kind: 'nearby', placeId: btn.dataset.placeId, title: btn.dataset.title });
      btn.textContent = '✓';
      btn.disabled = true;
    });
  });

  document.getElementById('place-detail-seeposts-btn').onclick = () => {
    saveFilters({ ...getFilters(), placeIds: [placeId] });
    closePlaceDetail();
    switchTab('feed');
    renderFeed();
  };

  document.getElementById('place-detail-overlay').style.display = 'flex';
}

function closePlaceDetail() {
  document.getElementById('place-detail-overlay').style.display = 'none';
}
