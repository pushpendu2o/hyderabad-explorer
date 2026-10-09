// Geolocation + distance helpers (same haversine approach as Hyderabad
// Explorer v0) and locally-persisted filter state. Filters are per-device
// preference, not shared data, so localStorage is the right place for them.

let myLat = null;
let myLng = null;

function requestUserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        myLat = pos.coords.latitude;
        myLng = pos.coords.longitude;
        resolve({ lat: myLat, lng: myLng });
      },
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distanceToPlace(place) {
  if (myLat === null || myLng === null) return null;
  return distanceKm(myLat, myLng, place.lat, place.lng);
}

const DEFAULT_FILTERS = {
  placeIds: [],
  postTypes: [],
  maxDistanceKm: 50,
};

function getFilters() {
  try {
    const raw = localStorage.getItem('hl_filters');
    if (!raw) return { ...DEFAULT_FILTERS };
    return { ...DEFAULT_FILTERS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_FILTERS };
  }
}

function saveFilters(filters) {
  localStorage.setItem('hl_filters', JSON.stringify(filters));
}

function postMatchesFilters(post, filters) {
  if (filters.placeIds.length && !filters.placeIds.includes(post.place_id)) {
    return false;
  }
  if (filters.postTypes.length && !filters.postTypes.includes(post.post_type)) {
    return false;
  }
  if (myLat !== null && myLng !== null) {
    const place = placeById(post.place_id);
    const dist = distanceToPlace(place);
    if (dist !== null && dist > filters.maxDistanceKm) return false;
  }
  return true;
}

// Saved places (bookmarks) and itinerary (day-by-day trip plan) are
// per-device preferences, same as filters -- localStorage, not Supabase.

function getSavedPlaces() {
  try {
    return JSON.parse(localStorage.getItem('hl_saved') || '[]');
  } catch {
    return [];
  }
}

function isPlaceSaved(placeId) {
  return getSavedPlaces().includes(placeId);
}

function toggleSavedPlace(placeId) {
  const saved = getSavedPlaces();
  const next = saved.includes(placeId)
    ? saved.filter((id) => id !== placeId)
    : [...saved, placeId];
  localStorage.setItem('hl_saved', JSON.stringify(next));
  return next.includes(placeId);
}

const DEFAULT_ITINERARY = { nextDayNum: 1, days: [], unscheduled: [] };

function getItinerary() {
  try {
    const raw = localStorage.getItem('hl_itinerary');
    if (!raw) return { ...DEFAULT_ITINERARY, days: [], unscheduled: [] };
    return JSON.parse(raw);
  } catch {
    return { ...DEFAULT_ITINERARY, days: [], unscheduled: [] };
  }
}

function saveItinerary(it) {
  localStorage.setItem('hl_itinerary', JSON.stringify(it));
}

function addToItinerary(item) {
  const it = getItinerary();
  it.unscheduled.push({ ...item, addedAt: Date.now() });
  saveItinerary(it);
  return it;
}

function addItineraryDay() {
  const it = getItinerary();
  const dayNum = it.nextDayNum;
  it.days.push({ id: dayNum, items: [] });
  it.nextDayNum = dayNum + 1;
  saveItinerary(it);
  return it;
}

function moveUnscheduledToDay(itemIndex, dayId) {
  const it = getItinerary();
  const [item] = it.unscheduled.splice(itemIndex, 1);
  const day = it.days.find((d) => d.id === dayId);
  if (day && item) day.items.push(item);
  saveItinerary(it);
  return it;
}

function removeItineraryItem(bucket, dayId, itemIndex) {
  const it = getItinerary();
  if (bucket === 'unscheduled') {
    it.unscheduled.splice(itemIndex, 1);
  } else {
    const day = it.days.find((d) => d.id === dayId);
    if (day) day.items.splice(itemIndex, 1);
  }
  saveItinerary(it);
  return it;
}
