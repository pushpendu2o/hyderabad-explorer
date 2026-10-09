// supabase-js loaded via CDN in index.html as a global `supabase` factory.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const PLACES = [
  { id: 'golconda', name: 'Golconda Fort', lat: 17.3833, lng: 78.4011 },
  { id: 'charminar', name: 'Charminar', lat: 17.3616, lng: 78.4747 },
  { id: 'medak', name: 'Medak Fort', lat: 18.0460, lng: 78.2630 },
  { id: 'rachakonda', name: 'Rachakonda Fort', lat: 17.3270, lng: 78.9480 },
  { id: 'hussainsagar', name: 'Hussain Sagar', lat: 17.4239, lng: 78.4738 },
];

const POST_TYPE_LABELS = {
  question: 'Question',
  trip_report: 'Trip report',
  like: 'What I liked',
  unexpected: 'Unexpected',
  unsafe: 'Heads up / unsafe',
};

function placeById(id) {
  return PLACES.find((p) => p.id === id);
}
