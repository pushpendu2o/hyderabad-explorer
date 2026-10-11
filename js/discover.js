// Discover blends place info (gallery, about, facts, tips, things to
// avoid, nearby spots) with a trending panel computed live from real
// posts. The place info and the Feed's articles both live in Supabase
// now (place_info / articles tables) -- loaded once here, not hardcoded,
// so new content is a database write, not a code change + redeploy.
// Tapping a place opens a full detail view with a bookmark toggle,
// "save" stars on nearby spots, and a jump straight into the feed
// filtered to that place.

let PLACE_INFO = {};

async function loadPlaceInfo() {
  const { data, error } = await sb.from('place_info').select('*');
  if (error) {
    console.error(error);
    return;
  }
  PLACE_INFO = {};
  for (const row of data) {
    PLACE_INFO[row.place_id] = {
      gallery: row.gallery,
      about: row.about,
      facts: row.facts,
      tips: row.tips,
      avoid: row.avoid,
      nearby: row.nearby,
    };
  }
}

function computeTrending(posts) {
  const counts = {};
  const latest = {};
  for (const p of posts) {
    counts[p.place_id] = (counts[p.place_id] || 0) + 1;
    if (!latest[p.place_id] || new Date(p.created_at) > new Date(latest[p.place_id])) {
      latest[p.place_id] = p.created_at;
    }
  }
  return PLACES
    .map((place) => ({ place, count: counts[place.id] || 0, latestAt: latest[place.id] || null }))
    .sort((a, b) => b.count - a.count);
}

function daysAgoLabel(iso) {
  if (!iso) return 'No posts yet';
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days <= 0) return 'Latest post today';
  return `Latest post ${days}d ago`;
}

async function refreshDiscover() {
  await loadFeed();
  renderDiscover();
}

function renderDiscover() {
  const trending = computeTrending(feedPosts).filter(
    ({ place }) => !searchQuery || place.name.toLowerCase().includes(searchQuery)
  );
  const container = document.getElementById('discover-list');

  container.innerHTML = trending
    .map(({ place, count, latestAt }) => {
      const info = PLACE_INFO[place.id];
      return `
      <div class="discover-card" data-place-id="${place.id}">
        <img class="discover-card-thumb" src="${info.gallery[0]}" alt="${place.name}" loading="lazy" />
        <div class="discover-card-body">
          <div class="discover-card-top">
            <h3>${place.name}</h3>
            ${count > 0 ? `<span class="trending-badge">${count} post${count === 1 ? '' : 's'}</span>` : '<span class="trending-badge quiet">Quiet for now</span>'}
          </div>
          <p class="discover-about">${info.about.slice(0, 80)}…</p>
          <p class="discover-tip">💡 ${info.tips[0]}</p>
          <p class="discover-days-ago">${daysAgoLabel(latestAt)}</p>
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
  const info = PLACE_INFO[placeId];
  const count = feedPosts.filter((p) => p.place_id === placeId).length;
  const page = document.getElementById('place-detail-page');
  posthog.capture('place_viewed', { place_id: placeId, place_name: place.name });

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
        <button class="nearby-star-btn" data-id="${n.id}" data-title="${escapeHtml(n.title)}" data-place-id="${placeId}" title="Save spot">${isNearbySaved(n.id) ? '★' : '☆'}</button>
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

  page.querySelectorAll('.nearby-star-btn').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const saved = toggleSavedNearby({
        id: btn.dataset.id,
        title: btn.dataset.title,
        placeId: btn.dataset.placeId,
      });
      btn.textContent = saved ? '★' : '☆';
    };
  });

  page.querySelectorAll('.section-header').forEach((header) => {
    header.onclick = () => {
      const content = document.getElementById(header.dataset.target);
      const isOpen = content.style.display === 'block';
      content.style.display = isOpen ? 'none' : 'block';
      header.classList.toggle('open', !isOpen);
    };
    header.classList.remove('open');
    document.getElementById(header.dataset.target).style.display = 'none';
  });

  document.getElementById('place-detail-seeposts-btn').onclick = () => {
    saveFilters({ ...getFilters(), placeIds: [placeId] });
    closePlaceDetail();
    switchTab('feed');
    renderFeed();
  };

  page.style.display = 'flex';
}

function closePlaceDetail() {
  document.getElementById('place-detail-page').style.display = 'none';
}
