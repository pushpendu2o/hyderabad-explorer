function switchTab(tab) {
  document.querySelectorAll('.tab-pane').forEach((el) => (el.style.display = 'none'));
  document.querySelectorAll('.tab-btn').forEach((el) => el.classList.remove('active'));
  document.getElementById(`tab-${tab}`).style.display = 'block';
  document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'chat') renderChatTab();
}

function renderProfileTab() {
  document.getElementById('profile-name').textContent = currentProfile.display_name;
  document.getElementById('profile-location').textContent =
    myLat !== null ? 'Location shared' : 'Location not shared';
}

function openFilterSheet() {
  const filters = getFilters();
  document.querySelectorAll('.filter-place-chip').forEach((chip) => {
    chip.classList.toggle('selected', filters.placeIds.includes(chip.dataset.place));
  });
  document.querySelectorAll('.filter-type-chip').forEach((chip) => {
    chip.classList.toggle('selected', filters.postTypes.includes(chip.dataset.type));
  });
  document.getElementById('filter-distance').value = filters.maxDistanceKm;
  document.getElementById('filter-distance-label').textContent = `${filters.maxDistanceKm} km`;
  document.getElementById('filter-sheet').style.display = 'flex';
}

function closeFilterSheet() {
  document.getElementById('filter-sheet').style.display = 'none';
}

async function applyFilters() {
  const placeIds = [...document.querySelectorAll('.filter-place-chip.selected')].map(
    (el) => el.dataset.place
  );
  const postTypes = [...document.querySelectorAll('.filter-type-chip.selected')].map(
    (el) => el.dataset.type
  );
  const maxDistanceKm = Number(document.getElementById('filter-distance').value);
  saveFilters({ placeIds, postTypes, maxDistanceKm });
  closeFilterSheet();
  await renderFeed();
}

async function bootstrap() {
  await ensureSession();

  const loc = await requestUserLocation();
  if (loc) await updateMyLocation(loc.lat, loc.lng);

  await loadFeed();
  await renderFeed();
  renderDiscover();
  renderProfileTab();

  document.getElementById('app-loading').style.display = 'none';
  document.getElementById('app-shell').style.display = 'flex';

  document.querySelectorAll('.tab-btn').forEach((btn) =>
    btn.addEventListener('click', () => switchTab(btn.dataset.tab))
  );
  document.getElementById('open-composer-btn').addEventListener('click', openComposer);
  document.getElementById('composer-close-btn').addEventListener('click', closeComposer);
  document.getElementById('composer-form').addEventListener('submit', submitComposer);
  document.getElementById('open-filter-btn').addEventListener('click', openFilterSheet);
  document.getElementById('filter-close-btn').addEventListener('click', closeFilterSheet);
  document.getElementById('filter-apply-btn').addEventListener('click', applyFilters);
  document.getElementById('filter-distance').addEventListener('input', (e) => {
    document.getElementById('filter-distance-label').textContent = `${e.target.value} km`;
  });
  document.querySelectorAll('.filter-place-chip, .filter-type-chip').forEach((chip) =>
    chip.addEventListener('click', () => chip.classList.toggle('selected'))
  );
  document.getElementById('thread-close-btn').addEventListener('click', closeThread);
}

bootstrap().catch((err) => {
  console.error(err);
  document.getElementById('app-loading').textContent =
    'Something went wrong loading the app. Check js/config.js has your Supabase URL/key set.';
});
