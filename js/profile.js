// Saved places (bookmarks) and the day-by-day itinerary both live here in
// Profile. Items get added from Discover (bookmark star on a place, "+"
// on nearby spots, "+ Add to itinerary" on the place itself) and get
// organized into days here.

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

function renderItinerary() {
  const it = getItinerary();
  const container = document.getElementById('profile-itinerary');

  const dayOptions = it.days.map((d) => `<option value="${d.id}">Day ${d.id}</option>`).join('');

  const unscheduledHtml = it.unscheduled.length
    ? it.unscheduled
        .map(
          (item, idx) => `
      <div class="itinerary-item">
        <span>${escapeHtml(item.title)}</span>
        ${it.days.length ? `
          <select class="move-to-day-select" data-idx="${idx}">
            <option value="">Add to day…</option>
            ${dayOptions}
          </select>` : '<span class="itinerary-hint">Create a day to schedule this</span>'}
        <button class="itinerary-remove-btn" data-bucket="unscheduled" data-idx="${idx}" title="Remove">✕</button>
      </div>`
        )
        .join('')
    : '';

  const daysHtml = it.days
    .map(
      (day) => `
    <div class="itinerary-day">
      <h5>Day ${day.id}</h5>
      ${
        day.items.length
          ? day.items
              .map(
                (item, idx) => `
          <div class="itinerary-item">
            <span>${escapeHtml(item.title)}</span>
            <button class="itinerary-remove-btn" data-bucket="day" data-day-id="${day.id}" data-idx="${idx}" title="Remove">✕</button>
          </div>`
              )
              .join('')
          : '<p class="empty-state">Nothing scheduled yet.</p>'
      }
    </div>`
    )
    .join('');

  container.innerHTML = `
    ${unscheduledHtml ? `<p class="filter-label">Saved for later</p>${unscheduledHtml}` : ''}
    ${daysHtml || '<p class="empty-state">No days yet. Tap "+ Day" to start planning.</p>'}
  `;

  container.querySelectorAll('.move-to-day-select').forEach((select) =>
    select.addEventListener('change', (e) => {
      if (!e.target.value) return;
      moveUnscheduledToDay(Number(e.target.dataset.idx), Number(e.target.value));
      renderItinerary();
    })
  );
  container.querySelectorAll('.itinerary-remove-btn').forEach((btn) =>
    btn.addEventListener('click', () => {
      removeItineraryItem(
        btn.dataset.bucket,
        btn.dataset.dayId ? Number(btn.dataset.dayId) : null,
        Number(btn.dataset.idx)
      );
      renderItinerary();
    })
  );
}

function renderProfileExtras() {
  renderSavedPlaces();
  renderItinerary();
}
