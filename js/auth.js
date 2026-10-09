// Anonymous-only auth: every visitor gets a real Supabase auth session
// (so RLS/auth.uid() works) without ever typing an email or password.
// Signing in happens silently on load -- browsing, Discover, and saving
// places need no identity at all. The display-name prompt only fires the
// first time someone actually does something that needs an author: post,
// comment, message, or open their Profile tab.

let currentUser = null;
let currentProfile = null;

async function ensureSession() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
  } else {
    const { data, error } = await sb.auth.signInAnonymously();
    if (error) throw error;
    currentUser = data.user;
  }
  await loadProfileIfExists();
}

async function loadProfileIfExists() {
  const { data } = await sb
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .maybeSingle();
  currentProfile = data || null;
}

// Call this at the start of any action that needs an author (posting,
// commenting, messaging, viewing Profile). No-ops if already set up.
async function ensureProfileForInteraction() {
  if (currentProfile) return currentProfile;

  const name = await promptDisplayName();
  const { data: created, error } = await sb
    .from('profiles')
    .insert({ id: currentUser.id, display_name: name })
    .select()
    .single();
  if (error) throw error;
  currentProfile = created;

  if (myLat !== null && myLng !== null) {
    await updateMyLocation(myLat, myLng);
  }
  return currentProfile;
}

function promptDisplayName() {
  return new Promise((resolve) => {
    const overlay = document.getElementById('name-prompt-overlay');
    const input = document.getElementById('name-prompt-input');
    const btn = document.getElementById('name-prompt-submit');
    overlay.style.display = 'flex';
    input.value = '';
    input.focus();

    function submit() {
      const value = input.value.trim();
      if (!value) return;
      overlay.style.display = 'none';
      btn.removeEventListener('click', submit);
      resolve(value);
    }
    btn.addEventListener('click', submit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submit();
    });
  });
}

async function updateMyLocation(lat, lng) {
  if (!currentProfile) return;
  const { error } = await sb
    .from('profiles')
    .update({ lat, lng })
    .eq('id', currentUser.id);
  if (!error) {
    currentProfile.lat = lat;
    currentProfile.lng = lng;
  }
}
