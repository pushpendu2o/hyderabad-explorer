// The Feed tab: posts (questions / trip reports / likes / unexpected /
// unsafe) tagged to one of the 5 places, each with a "gossip" comment
// thread. Everything here is live Supabase data, not static content.

let feedPosts = [];
let expandedPostId = null;

async function loadFeed() {
  const { data, error } = await sb
    .from('posts')
    .select('*, profiles!posts_author_id_fkey(display_name), comments(count)')
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

const ICON_COMMENT = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
const ICON_MESSAGE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

function postCardHtml(post) {
  const place = placeById(post.place_id);
  const authorName = post.profiles?.display_name || 'Someone';
  const isMine = post.author_id === currentUser?.id;
  const commentCount = post.comments?.[0]?.count || 0;
  return `
    <div class="feed-card" data-post-id="${post.id}">
      <div class="feed-card-top">
        <span class="feed-place-tag">${place ? place.name : post.place_id}</span>
        <span class="feed-type-tag feed-type-${post.post_type}">${POST_TYPE_LABELS[post.post_type]}</span>
      </div>
      <h3 class="feed-card-title">${escapeHtml(post.title)}</h3>
      <p class="feed-card-body clamped" data-post-id="${post.id}">${escapeHtml(post.body)}</p>
      <button class="show-more-btn" data-post-id="${post.id}" style="display:none">Show more</button>
      <div class="feed-card-meta">
        <span>${escapeHtml(authorName)} · ${timeAgo(post.created_at)}</span>
        <div class="feed-card-actions">
          <button class="feed-comment-btn icon-btn" data-post-id="${post.id}" title="Comments">${ICON_COMMENT}<span class="comment-count">${commentCount > 0 ? commentCount : ''}</span></button>
          ${!isMine ? `<button class="feed-dm-btn icon-btn" data-author-id="${post.author_id}" data-author-name="${escapeHtml(authorName)}" title="Message">${ICON_MESSAGE}</button>` : ''}
        </div>
      </div>
      <div class="feed-comments" id="comments-${post.id}" style="display:none"></div>
    </div>
  `;
}

function setCommentCount(postId, count) {
  const post = feedPosts.find((p) => p.id === postId);
  if (post) post.comments = [{ count }];
  const btn = document.querySelector(`.feed-comment-btn[data-post-id="${postId}"] .comment-count`);
  if (btn) btn.textContent = count > 0 ? count : '';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderFilterBanner(filters) {
  const banner = document.getElementById('feed-filter-banner');
  if (!filters.placeIds.length) {
    banner.style.display = 'none';
    return;
  }
  const names = filters.placeIds.map((id) => placeById(id)?.name || id).join(', ');
  banner.innerHTML = `<span>Filtered by: <strong>${escapeHtml(names)}</strong></span><button id="clear-place-filter-btn" title="Clear filter">✕</button>`;
  banner.style.display = 'flex';
  document.getElementById('clear-place-filter-btn').addEventListener('click', async () => {
    saveFilters({ ...getFilters(), placeIds: [] });
    await renderFeed();
  });
}

function postMatchesSearch(post) {
  if (!searchQuery) return true;
  return (
    post.title.toLowerCase().includes(searchQuery) ||
    post.body.toLowerCase().includes(searchQuery)
  );
}

async function renderFeed() {
  const filters = getFilters();
  renderFilterBanner(filters);
  const container = document.getElementById('feed-list');
  const visible = feedPosts.filter((p) => postMatchesFilters(p, filters) && postMatchesSearch(p));
  if (!visible.length) {
    container.innerHTML = '<p class="empty-state">No posts match your filters yet.</p>';
    return;
  }
  const items = searchQuery ? visible.map((p) => ({ kind: 'post', data: p })) : interleaveArticlesIntoPosts(visible);
  container.innerHTML = items
    .map((item) => (item.kind === 'article' ? articleCardHtml(item.data) : postCardHtml(item.data)))
    .join('');

  container.querySelectorAll('.article-card').forEach((card) => {
    card.addEventListener('click', () => openArticle(card.dataset.articleId));
  });

  container.querySelectorAll('.feed-comment-btn').forEach((btn) => {
    btn.addEventListener('click', () => toggleComments(btn.dataset.postId));
  });
  container.querySelectorAll('.feed-dm-btn').forEach((btn) => {
    btn.addEventListener('click', () =>
      startMessageRequest(btn.dataset.authorId, btn.dataset.authorName)
    );
  });

  container.querySelectorAll('.clamped').forEach((el) => {
    if (el.scrollHeight > el.clientHeight + 2) {
      const btn = container.querySelector(`.show-more-btn[data-post-id="${el.dataset.postId}"]`);
      if (btn) btn.style.display = 'block';
    }
  });
  container.querySelectorAll('.show-more-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const body = container.querySelector(`.clamped[data-post-id="${btn.dataset.postId}"]`);
      body.classList.remove('clamped');
      btn.style.display = 'none';
    });
  });
}

async function toggleComments(postId) {
  const box = document.getElementById(`comments-${postId}`);
  if (box.style.display === 'block') {
    box.style.display = 'none';
    return;
  }
  box.style.display = 'block';
  await renderCommentsBox(postId);
}

async function renderCommentsBox(postId) {
  const box = document.getElementById(`comments-${postId}`);
  box.innerHTML = '<p class="loading">Loading…</p>';
  const comments = await loadCommentsForPost(postId);
  setCommentCount(postId, comments.length);
  box.innerHTML = `
    <div class="comment-list">
      ${comments
        .map(
          (c) => `
        <div class="comment-row">
          <strong>${escapeHtml(c.profiles?.display_name || 'Someone')}</strong>
          <span>${escapeHtml(c.body)}</span>
          ${c.author_id === currentUser.id ? `<button class="comment-delete-btn" data-comment-id="${c.id}" data-post-id="${postId}" title="Delete">🗑</button>` : ''}
        </div>`
        )
        .join('') || '<p class="empty-state">No comments yet. Be the first.</p>'}
    </div>
    <form class="comment-form" data-post-id="${postId}">
      <input type="text" placeholder="Add a comment…" required maxlength="500" />
      <button type="submit" title="Send">➤</button>
    </form>
  `;
  box.querySelectorAll('.comment-delete-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const { error } = await sb.from('comments').delete().eq('id', btn.dataset.commentId);
      if (error) {
        alert('Could not delete: ' + error.message);
        return;
      }
      await renderCommentsBox(btn.dataset.postId);
    });
  });
  box.querySelector('.comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = e.target.querySelector('input');
    const body = input.value.trim();
    if (!body) return;
    if (!(await ensureProfileForInteraction())) return;
    const { error } = await sb
      .from('comments')
      .insert({ post_id: postId, author_id: currentUser.id, body });
    if (!error) {
      input.value = '';
      await renderCommentsBox(postId);
    }
  });
}

async function openComposer() {
  if (!(await ensureProfileForInteraction())) return;
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
  if (!(await ensureProfileForInteraction())) return;

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
  renderDiscover();
}
