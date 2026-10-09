async function switchTab(tab) {
  document.querySelectorAll('.tab-pane').forEach((el) => (el.style.display = 'none'));
  document.querySelectorAll('.tab-btn').forEach((el) => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).style.display = 'block';
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'chat') renderChatTab();
  if (tab === 'discover') refreshDiscover();
  if (tab === 'profile') await renderProfileTab();
}

async function renderProfileTab() {
  await ensureProfileForInteraction();
  document.getElementById('profile-name').textContent = currentProfile.display_name;
  document.getElementById('profile-location').textContent =
    myLat !== null ? 'Location shared' : 'Location not shared';
  renderProfileExtras();
}

function openFilterSheet() {
  const filters = getFilters();
  // Empty placeIds/postTypes means "no filter applied yet" -- show that
  // visually as every chip selected, since that's the equivalent state.
  document.querySelectorAll('.filter-place-chip').forEach((chip) => {
    chip.classList.toggle(
      'selected',
      filters.placeIds.length === 0 || filters.placeIds.includes(chip.dataset.place)
    );
  });
  document.querySelectorAll('.filter-type-chip').forEach((chip) => {
    chip.classList.toggle(
      'selected',
      filters.postTypes.length === 0 || filters.postTypes.includes(chip.dataset.type)
    );
  });
  document.getElementById('filter-distance').value = filters.maxDistanceKm;
  document.getElementById('filter-distance-label').textContent = `${filters.maxDistanceKm} km`;
  document.getElementById('filter-sheet').style.display = 'flex';
}

async function applyFilters() {
  const allPlaceChips = [...document.querySelectorAll('.filter-place-chip')];
  const selectedPlaceChips = allPlaceChips.filter((el) => el.classList.contains('selected'));
  const placeIds = selectedPlaceChips.length === allPlaceChips.length
    ? []
    : selectedPlaceChips.map((el) => el.dataset.place);

  const allTypeChips = [...document.querySelectorAll('.filter-type-chip')];
  const selectedTypeChips = allTypeChips.filter((el) => el.classList.contains('selected'));
  const postTypes = selectedTypeChips.length === allTypeChips.length
    ? []
    : selectedTypeChips.map((el) => el.dataset.type);

  const maxDistanceKm = Number(document.getElementById('filter-distance').value);
  saveFilters({ placeIds, postTypes, maxDistanceKm });
  document.getElementById('filter-sheet').style.display = 'none';
  await renderFeed();
}

async function bootstrap() {
  await ensureSession();

  const loc = await requestUserLocation();
  if (loc) await updateMyLocation(loc.lat, loc.lng);

  await loadFeed();
  await renderFeed();
  renderDiscover();

  document.getElementById('app-loading').style.display = 'none';
  document.getElementById('app-shell').style.display = 'flex';

  document.querySelectorAll('.tab-btn').forEach((btn) =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  );
  document.getElementById('open-composer-btn').addEventListener('click', openComposer);
  document.getElementById('composer-close-btn').addEventListener('click', closeComposer);
  document.getElementById('composer-form').addEventListener('submit', submitComposer);
  document.getElementById('open-filter-btn').addEventListener('click', openFilterSheet);
  document.getElementById('filter-sheet').addEventListener('click', (e) => {
    if (e.target.id === 'filter-sheet') applyFilters();
  });
  document.getElementById('filter-distance').addEventListener('input', (e) => {
    document.getElementById('filter-distance-label').textContent = `${e.target.value} km`;
  });
  document.querySelectorAll('.filter-place-chip, .filter-type-chip').forEach((chip) =>
    chip.addEventListener('click', () => chip.classList.toggle('selected'))
  );
  document.getElementById('thread-close-btn').addEventListener('click', closeThread);
  document.getElementById('place-detail-close-btn').addEventListener('click', closePlaceDetail);
}

bootstrap().catch((err) => {
  console.error(err);
  document.getElementById('app-loading').textContent =
    'Something went wrong loading the app. Check js/config.js has your Supabase URL/key set.';
});
