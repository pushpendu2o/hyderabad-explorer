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
  maxDistanceKm: 100,
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

// Saved nearby spots (starred from a place's detail page) -- same idea as
// saved places, just a separate bucket since they're not full places.

function getSavedNearby() {
  try {
    return JSON.parse(localStorage.getItem('hl_saved_nearby') || '[]');
  } catch {
    return [];
  }
}

function isNearbySaved(id) {
  return getSavedNearby().some((item) => item.id === id);
}

function toggleSavedNearby(item) {
  const saved = getSavedNearby();
  const exists = saved.some((s) => s.id === item.id);
  const next = exists ? saved.filter((s) => s.id !== item.id) : [...saved, item];
  localStorage.setItem('hl_saved_nearby', JSON.stringify(next));
  return !exists;
}
