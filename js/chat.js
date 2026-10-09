// DMs with an accept gate: a first message is a "request"; the
// recipient must accept before either side can send real messages.

async function startMessageRequest(recipientId, recipientName) {
  if (recipientId === currentUser.id) return;

  const { data: existing } = await sb
    .from('message_requests')
    .select('*')
    .or(
      `and(sender_id.eq.${currentUser.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUser.id})`
    )
    .maybeSingle();

  if (existing) {
    if (existing.status === 'accepted') {
      switchTab('chat');
      openThread(existing.id, recipientName);
    } else if (existing.sender_id === currentUser.id) {
      alert(`You already sent ${recipientName} a message request — waiting for them to accept.`);
    } else {
      alert(`${recipientName} already sent you a request — check the Chat tab to accept it.`);
      switchTab('chat');
    }
    return;
  }

  const { error } = await sb
    .from('message_requests')
    .insert({ sender_id: currentUser.id, recipient_id: recipientId });
  if (error) {
    alert('Could not send request: ' + error.message);
    return;
  }
  alert(`Message request sent to ${recipientName}. You can chat once they accept.`);
  switchTab('chat');
  await renderChatTab();
}

async function loadIncomingRequests() {
  const { data } = await sb
    .from('message_requests')
    .select('*, profiles!message_requests_sender_id_fkey(display_name)')
    .eq('recipient_id', currentUser.id)
    .eq('status', 'pending');
  return data || [];
}

async function loadThreads() {
  const { data } = await sb
    .from('message_requests')
    .select(
      '*, sender:profiles!message_requests_sender_id_fkey(display_name), recipient:profiles!message_requests_recipient_id_fkey(display_name)'
    )
    .eq('status', 'accepted')
    .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`);
  return data || [];
}

async function respondToRequest(requestId, accept) {
  const { error } = await sb
    .from('message_requests')
    .update({ status: accept ? 'accepted' : 'declined' })
    .eq('id', requestId);
  if (!error) await renderChatTab();
}

async function renderChatTab() {
  const incoming = await loadIncomingRequests();
  const threads = await loadThreads();
  const container = document.getElementById('chat-list');

  const incomingHtml = incoming
    .map(
      (r) => `
    <div class="request-row">
      <span>${escapeHtml(r.profiles?.display_name || 'Someone')} wants to message you</span>
      <div class="request-actions">
        <button class="accept-btn" data-id="${r.id}">Accept</button>
        <button class="decline-btn" data-id="${r.id}">Decline</button>
      </div>
    </div>`
    )
    .join('');

  const threadsHtml = threads
    .map((t) => {
      const other = t.sender_id === currentUser.id ? t.recipient : t.sender;
      const otherId = t.sender_id === currentUser.id ? t.recipient_id : t.sender_id;
      return `
      <div class="thread-row" data-request-id="${t.id}" data-other-name="${escapeHtml(other?.display_name || 'Someone')}">
        <span>${escapeHtml(other?.display_name || 'Someone')}</span>
      </div>`;
    })
    .join('');

  container.innerHTML = `
    ${incoming.length ? `<h4 class="chat-section-title">Message requests</h4>${incomingHtml}` : ''}
    <h4 class="chat-section-title">Chats</h4>
    ${threadsHtml || '<p class="empty-state">No chats yet.</p>'}
  `;

  container.querySelectorAll('.accept-btn').forEach((btn) =>
    btn.addEventListener('click', () => respondToRequest(btn.dataset.id, true))
  );
  container.querySelectorAll('.decline-btn').forEach((btn) =>
    btn.addEventListener('click', () => respondToRequest(btn.dataset.id, false))
  );
  container.querySelectorAll('.thread-row').forEach((row) =>
    row.addEventListener('click', () =>
      openThread(row.dataset.requestId, row.dataset.otherName)
    )
  );
}

async function openThread(requestId, otherName) {
  const overlay = document.getElementById('thread-overlay');
  overlay.style.display = 'flex';
  document.getElementById('thread-title').textContent = otherName;
  const messagesBox = document.getElementById('thread-messages');
  messagesBox.innerHTML = '<p class="loading">Loading…</p>';

  const { data: messages } = await sb
    .from('messages')
    .select('*')
    .eq('request_id', requestId)
    .order('created_at', { ascending: true });

  messagesBox.innerHTML = (messages || [])
    .map(
      (m) => `
    <div class="thread-msg ${m.sender_id === currentUser.id ? 'mine' : 'theirs'}">${escapeHtml(m.body)}</div>`
    )
    .join('') || '<p class="empty-state">Say hi.</p>';

  const form = document.getElementById('thread-form');
  form.onsubmit = async (e) => {
    e.preventDefault();
    const input = document.getElementById('thread-input');
    const body = input.value.trim();
    if (!body) return;
    const { error } = await sb
      .from('messages')
      .insert({ request_id: requestId, sender_id: currentUser.id, body });
    if (!error) {
      input.value = '';
      openThread(requestId, otherName);
    }
  };
}

function closeThread() {
  document.getElementById('thread-overlay').style.display = 'none';
}
