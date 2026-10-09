// Anonymous-only auth: every visitor gets a real Supabase auth session
// (so RLS/auth.uid() works) without ever typing an email or password.
// First visit asks for just a display name, then it's remembered by
// Supabase's own session persistence (localStorage under the hood).

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
  await ensureProfile();
}

async function ensureProfile() {
  const { data: existing, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .maybeSingle();
  if (error) throw error;

  if (existing) {
    currentProfile = existing;
    return;
  }

  const name = await promptDisplayName();
  const { data: created, error: insertError } = await sb
    .from('profiles')
    .insert({ id: currentUser.id, display_name: name })
    .select()
    .single();
  if (insertError) throw insertError;
  currentProfile = created;
}

function promptDisplayName() {
  return new Promise((resolve) => {
    const overlay = document.getElementById('name-prompt-overlay');
    const input = document.getElementById('name-prompt-input');
    const btn = document.getElementById('name-prompt-submit');
    overlay.style.display = 'flex';

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
