// The Feed tab: posts (questions / trip reports / likes / unexpected /
// unsafe) tagged to one of the 5 places, each with a "gossip" comment
// thread. Everything here is live Supabase data, not static content.

let feedPosts = [];
let expandedPostId = null;

async function loadFeed() {
  const { data, error } = await sb
    .from('posts')
    .select('*, profiles!posts_author_id_fkey(display_name)')
    .order('created_at', { ascending: false });
  if (error) {
    console.error(error);
    feedPosts = [];
    return;
  }
  feedPosts = data;
}

async function loadCommentsForPost(postId) {
  const { data, error } = await sb
    .from('comments')
    .select('*, profiles!comments_author_id_fkey(display_name)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error(error);
    return [];
  }
  return data;
}

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function postCardHtml(post) {
  const place = placeById(post.place_id);
  const authorName = post.profiles?.display_name || 'Someone';
  const isMine = post.author_id === currentUser?.id;
  return `
    <div class="feed-card" data-post-id="${post.id}">
      <div class="feed-card-top">
        <span class="feed-place-tag">${place ? place.name : post.place_id}</span>
        <span class="feed-type-tag feed-type-${post.post_type}">${POST_TYPE_LABELS[post.post_type]}</span>
      </div>
      <h3 class="feed-card-title">${escapeHtml(post.title)}</h3>
      <p class="feed-card-body">${escapeHtml(post.body)}</p>
      <div class="feed-card-meta">
        <span>${escapeHtml(authorName)} · ${timeAgo(post.created_at)}</span>
        <div class="feed-card-actions">
          <button class="feed-comment-btn" data-post-id="${post.id}">Comments</button>
          ${!isMine ? `<button class="feed-dm-btn" data-author-id="${post.author_id}" data-author-name="${escapeHtml(authorName)}">Message</button>` : ''}
        </div>
      </div>
      <div class="feed-comments" id="comments-${post.id}" style="display:none"></div>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

async function renderFeed() {
  const filters = getFilters();
  const container = document.getElementById('feed-list');
  const visible = feedPosts.filter((p) => postMatchesFilters(p, filters));
  if (!visible.length) {
    container.innerHTML = '<p class="empty-state">No posts match your filters yet.</p>';
    return;
  }
  container.innerHTML = visible.map(postCardHtml).join('');

  container.querySelectorAll('.feed-comment-btn').forEach((btn) => {
    btn.addEventListener('click', () => toggleComments(btn.dataset.postId));
  });
  container.querySelectorAll('.feed-dm-btn').forEach((btn) => {
    btn.addEventListener('click', () =>
      startMessageRequest(btn.dataset.authorId, btn.dataset.authorName)
    );
  });
}

async function toggleComments(postId) {
  const box = document.getElementById(`comments-${postId}`);
  if (box.style.display === 'block') {
    box.style.display = 'none';
    return;
  }
  box.innerHTML = '<p class="loading">Loading…</p>';
  box.style.display = 'block';
  const comments = await loadCommentsForPost(postId);
  box.innerHTML = `
    <div class="comment-list">
      ${comments
        .map(
          (c) => `
        <div class="comment-row">
          <strong>${escapeHtml(c.profiles?.display_name || 'Someone')}</strong>
          <span>${escapeHtml(c.body)}</span>
        </div>`
        )
        .join('') || '<p class="empty-state">No comments yet. Be the first.</p>'}
    </div>
    <form class="comment-form" data-post-id="${postId}">
      <input type="text" placeholder="Add a comment…" required maxlength="500" />
      <button type="submit">Send</button>
    </form>
  `;
  box.querySelector('.comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const body = input.value.trim();
    if (!body) return;
    const { error } = await sb
      .from('comments')
      .insert({ post_id: postId, author_id: currentUser.id, body });
    if (!error) {
      input.value = '';
      toggleComments(postId); // close
      toggleComments(postId); // reopen, refreshed
    }
  });
}

function openComposer() {
  document.getElementById('composer-overlay').style.display = 'flex';
}

function closeComposer() {
  document.getElementById('composer-overlay').style.display = 'none';
  document.getElementById('composer-form').reset();
}

async function submitComposer(e) {
  e.preventDefault();
  const form = e.target;
  const place_id = form.place_id.value;
  const post_type = form.post_type.value;
  const title = form.title.value.trim();
  const body = form.body.value.trim();
  if (!place_id || !post_type || !title || !body) return;

  const { error } = await sb.from('posts').insert({
    author_id: currentUser.id,
    place_id,
    post_type,
    title,
    body,
  });
  if (error) {
    alert('Could not post: ' + error.message);
    return;
  }
  closeComposer();
  await loadFeed();
  await renderFeed();
}
