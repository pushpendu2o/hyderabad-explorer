// Saved places (bookmarks) and saved nearby spots both live here in
// Profile. Items get added from Discover: the ☆ bookmark on a place's
// detail page, or the ☆ on a nearby spot within it.

function renderSavedPlaces() {
  const saved = getSavedPlaces();
  const container = document.getElementById('profile-saved-list');
  if (!saved.length) {
    container.innerHTML = '<p class="empty-state">No saved places yet — tap ☆ on a place in Discover.</p>';
    return;
  }
  container.innerHTML = saved
    .map((placeId) => {
      const place = placeById(placeId);
      return `
      <div class="saved-row" data-place-id="${placeId}">
        <span>${place ? place.name : placeId}</span>
        <button class="unsave-btn" data-place-id="${placeId}" title="Remove">✕</button>
      </div>`;
    })
    .join('');

  container.querySelectorAll('.saved-row').forEach((row) =>
    row.addEventListener('click', (e) => {
      if (e.target.closest('.unsave-btn')) return;
      openPlaceDetail(row.dataset.placeId);
    })
  );
  container.querySelectorAll('.unsave-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      toggleSavedPlace(btn.dataset.placeId);
      renderSavedPlaces();
    })
  );
}

function renderSavedNearby() {
  const saved = getSavedNearby();
  const container = document.getElementById('profile-saved-nearby-list');
  if (!saved.length) {
    container.innerHTML = '<p class="empty-state">No saved nearby spots yet — tap ☆ next to one in a place\'s detail page.</p>';
    return;
  }
  container.innerHTML = saved
    .map(
      (item) => `
      <div class="saved-row" data-place-id="${item.placeId}">
        <span>${escapeHtml(item.title)}</span>
        <button class="unsave-nearby-btn" data-id="${item.id}" title="Remove">✕</button>
      </div>`
    )
    .join('');

  container.querySelectorAll('.saved-row').forEach((row) =>
    row.addEventListener('click', (e) => {
      if (e.target.closest('.unsave-nearby-btn')) return;
      openPlaceDetail(row.dataset.placeId);
    })
  );
  container.querySelectorAll('.unsave-nearby-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      toggleSavedNearby({ id: btn.dataset.id });
      renderSavedNearby();
    })
  );
}

function renderProfileExtras() {
  renderSavedPlaces();
  renderSavedNearby();
}
