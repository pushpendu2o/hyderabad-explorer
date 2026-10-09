// WhatsApp-style chat: tapping "Message" opens a real chat window right
// away and you can send your first message without the other person
// accepting anything first. The accept gate only kicks in for continuing
// the conversation past that opener -- the recipient has to accept before
// either side can send a second message. Enforced server-side by the
// messages_insert_gated RLS policy (see supabase/schema.sql notes).

let openThreadRequestId = null;

function initials(name) {
  return (name || '?').trim().charAt(0).toUpperCase();
}

async function findOrCreateRequest(recipientId) {
  const { data: existing } = await sb
    .from('message_requests')
    .select('*')
    .or(
      `and(sender_id.eq.${currentUser.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUser.id})`
    )
    .maybeSingle();
  if (existing) return existing;

  const { data: created, error } = await sb
    .from('message_requests')
    .insert({ sender_id: currentUser.id, recipient_id: recipientId })
    .select()
    .single();
  if (error) throw error;
  return created;
}

async function startMessageRequest(recipientId, recipientName) {
  if (recipientId === currentUser.id) return;
  try {
    await ensureProfileForInteraction();
    const request = await findOrCreateRequest(recipientId);
    switchTab('chat');
    await openThread(request.id, recipientName);
  } catch (err) {
    alert('Could not open chat: ' + err.message);
  }
}

async function loadConversations() {
  const { data: requests } = await sb
    .from('message_requests')
    .select(
      '*, sender:profiles!message_requests_sender_id_fkey(display_name), recipient:profiles!message_requests_recipient_id_fkey(display_name)'
    )
    .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`);
  if (!requests || !requests.length) return [];

  const ids = requests.map((r) => r.id);
  const { data: messages } = await sb
    .from('messages')
    .select('*')
    .in('request_id', ids)
    .order('created_at', { ascending: true });

  return requests
    .map((r) => {
      const other = r.sender_id === currentUser.id ? r.recipient : r.sender;
      const otherId = r.sender_id === currentUser.id ? r.recipient_id : r.sender_id;
      const thread = (messages || []).filter((m) => m.request_id === r.id);
      const last = thread[thread.length - 1];
      return {
        requestId: r.id,
        status: r.status,
        iAmSender: r.sender_id === currentUser.id,
        otherId,
        otherName: other?.display_name || 'Someone',
        lastMessage: last?.body || '',
        lastAt: last?.created_at || r.created_at,
        needsMyAction: r.status === 'pending' && r.recipient_id === currentUser.id,
      };
    })
    .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));
}

async function renderChatTab() {
  const conversations = await loadConversations();
  const container = document.getElementById('chat-list');

  if (!conversations.length) {
    container.innerHTML = '<p class="empty-state">No chats yet. Message someone from a post in the Feed.</p>';
    return;
  }

  container.innerHTML = conversations
    .map(
      (c) => `
    <div class="conv-row" data-request-id="${c.requestId}" data-other-name="${escapeHtml(c.otherName)}">
      <div class="conv-avatar">${initials(c.otherName)}</div>
      <div class="conv-body">
        <div class="conv-top">
          <span class="conv-name">${escapeHtml(c.otherName)}</span>
          <span class="conv-time">${timeAgo(c.lastAt)}</span>
        </div>
        <div class="conv-preview">
          ${c.needsMyAction ? '<span class="conv-badge">Message request</span>' : ''}
          <span>${escapeHtml(c.lastMessage).slice(0, 48)}</span>
        </div>
      </div>
    </div>`
    )
    .join('');

  container.querySelectorAll('.conv-row').forEach((row) =>
    row.addEventListener('click', () => openThread(row.dataset.requestId, row.dataset.otherName))
  );
}

async function openThread(requestId, otherName) {
  openThreadRequestId = requestId;
  const overlay = document.getElementById('thread-overlay');
  overlay.style.display = 'flex';
  document.getElementById('thread-title').textContent = otherName;
  const messagesBox = document.getElementById('thread-messages');
  messagesBox.innerHTML = '<p class="loading">Loading…</p>';

  const { data: request } = await sb
    .from('message_requests')
    .select('*')
    .eq('id', requestId)
    .single();
  const { data: messages } = await sb
    .from('messages')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });

  messagesBox.innerHTML =
    (messages || [])
      .map(
        (m) => `
    <div class="thread-msg ${m.sender_id === currentUser.id ? 'mine' : 'theirs'}">${escapeHtml(m.body)}</div>`
      )
      .join('') || '<p class="empty-state">Say hi 👋</p>';
  messagesBox.scrollTop = messagesBox.scrollHeight;

  renderThreadActionBar(request, (messages || []).length);
}

function renderThreadActionBar(request, messageCount) {
  const bar = document.getElementById('thread-action-bar');
  const form = document.getElementById('thread-form');
  const input = document.getElementById('thread-input');
  const iAmRecipient = request.recipient_id === currentUser.id;
  const iAmSender = request.sender_id === currentUser.id;

  if (request.status === 'declined') {
    bar.innerHTML = '<span class="thread-banner">Request declined</span>';
    bar.style.display = 'block';
    form.style.display = 'none';
    return;
  }

  if (request.status === 'accepted') {
    bar.style.display = 'none';
    form.style.display = 'flex';
    input.disabled = false;
    return;
  }

  // pending
  if (iAmRecipient) {
    bar.innerHTML = `
      <span class="thread-banner">Accept to keep chatting with ${escapeHtml(document.getElementById('thread-title').textContent)}</span>
      <div class="thread-action-buttons">
        <button id="thread-accept-btn">Accept</button>
        <button id="thread-decline-btn" class="secondary">Decline</button>
      </div>`;
    bar.style.display = 'block';
    form.style.display = 'none';
    document.getElementById('thread-accept-btn').addEventListener('click', () => respondToRequest(request.id, true));
    document.getElementById('thread-decline-btn').addEventListener('click', () => respondToRequest(request.id, false));
  } else if (iAmSender && messageCount === 0) {
    bar.style.display = 'none';
    form.style.display = 'flex';
    input.disabled = false;
  } else {
    bar.innerHTML = '<span class="thread-banner">Waiting for them to accept before you can send more</span>';
    bar.style.display = 'block';
    form.style.display = 'none';
  }
}

async function respondToRequest(requestId, accept) {
  const { error } = await sb
    .from('message_requests')
    .update({ status: accept ? 'accepted' : 'declined' })
    .eq('id', requestId);
  if (!error && openThreadRequestId === requestId) {
    const otherName = document.getElementById('thread-title').textContent;
    await openThread(requestId, otherName);
  }
  await renderChatTab();
}

function closeThread() {
  openThreadRequestId = null;
  document.getElementById('thread-overlay').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('thread-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('thread-input');
    const body = input.value.trim();
    if (!body || !openThreadRequestId) return;
    await ensureProfileForInteraction();
    const { error } = await sb
      .from('messages')
      .insert({ request_id: openThreadRequestId, sender_id: currentUser.id, body });
    if (error) {
      alert('Could not send: ' + error.message);
      return;
    }
    input.value = '';
    const otherName = document.getElementById('thread-title').textContent;
    await openThread(openThreadRequestId, otherName);
    await renderChatTab();
  });
});
