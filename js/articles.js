// Long-form "stories" tab for the Feed -- Substack-style write-ups built
// from real travel YouTube videos (itinerary, food, best/hardest part),
// with the actual video embedded cleanly via YouTube's iframe API (no
// custom player needed, nothing scraped). Static content, like
// STATIC_PLACE_INFO in discover.js -- these aren't Supabase rows.
//
// Interleave rule in the Feed: ARTICLES[0] goes right after the 1st post,
// then each following article goes after every 2 posts thereafter.
const ARTICLE_INSERT_SCHEDULE = [1, 2, 2];

const ARTICLES = [
  {
    id: 'annapurna-base-camp-journey',
    title: "Nepal's Most Beautiful Trek: A Journey to Annapurna Base Camp",
    creator: 'Ajay Raj',
    youtubeId: 'w0Xrn5a5b1g',
    youtubeUrl: 'https://www.youtube.com/watch?v=w0Xrn5a5b1g',
    teaser: 'Starting from Pokhara at just 700m, with 7,000-8,000m peaks visible from the city itself — the trip up to the one point in Nepal surrounded by mountains in all 360 degrees.',
    sections: [
      {
        heading: 'From the video',
        body: 'The trip starts in Pokhara — a city sitting at just 700m elevation, yet close enough to see 7,000m and 8,000m peaks right from town. Pokhara is the gateway to most of Nepal\'s major treks, and this one was prompted by an invitation from a friend named Pallav. The goal: reach Annapurna Base Camp, one of the only points in Nepal surrounded by mountains in a full 360 degrees.',
      },
      {
        heading: 'About the route (general, not from this video)',
        body: 'The Annapurna Base Camp trek is widely documented as a roughly 7-9 day round trip out of Pokhara, typically starting at Nayapul and working up through villages like Ghandruk, Chhomrong, and Dovan before the final push through Deurali and Machhapuchhre Base Camp to ABC itself. This video does not confirm its own day count or exact stops — this is general route context, not a claim about what\'s shown.',
      },
    ],
    bestPart: 'Not stated in available sources — the video\'s own framing suggests it\'s the payoff of being surrounded by 360 degrees of high peaks at the base camp itself.',
    hardPart: 'Not stated in available sources. No transcript was accessible for this video (Hindi-language audio, no English captions), so specifics beyond the description couldn\'t be verified.',
  },
  {
    id: 'meghalaya-backpacking-tanya',
    title: 'Backpacking Through Meghalaya: Root Bridges, Waterfalls, and the Wettest Place on Earth',
    creator: 'Tanya Khanijow',
    youtubeId: 'yvn79Rv0F48',
    youtubeUrl: 'https://www.youtube.com/watch?v=yvn79Rv0F48',
    teaser: 'A backpacking route through Shillong and Sohra — living root bridges, a cave, and the waterfalls Meghalaya is famous for.',
    sections: [
      {
        heading: 'Starting point: Guwahati to Shillong',
        body: 'The trip starts in Guwahati, the usual gateway into Northeast India, before heading on to Shillong — the base most Meghalaya trips work out of.',
      },
      {
        heading: 'Sohra (Cherrapunji)',
        body: 'From Shillong, the route moves to Sohra, better known as Cherrapunji — one of the wettest places on earth, and the heart of Meghalaya\'s root-bridge country. The trip includes the Mawkdok Dympep Valley viewpoint along the way, and a stay at a homestay in the area rather than a hotel.',
      },
      {
        heading: 'The Double Decker Living Root Bridge',
        body: 'The centerpiece of the trip: the Double Decker Living Root Bridge, one of Meghalaya\'s famous bridges grown from the roots of rubber fig trees over generations. It\'s the sequence most of her Meghalaya content is built around.',
      },
      {
        heading: 'Nohkalikai Falls, Mawsmai Cave, and the Seven Sisters',
        body: 'The trip also covers Nohkalikai Falls — one of India\'s tallest waterfalls — a visit into Mawsmai Cave, and the Seven Sisters Waterfall, rounding out Sohra\'s best-known natural landmarks.',
      },
    ],
    bestPart: 'Not explicitly called out in the video itself — but by far the most screen time and build-up goes to reaching the Double Decker Living Root Bridge.',
    hardPart: 'Not stated directly either, though anyone retracing this route should expect it: the root-bridge trails get slippery and humid, especially given Sohra\'s reputation as one of the wettest places on earth.',
  },
  {
    id: 'ankit-bhatia-quit-job',
    title: 'I Quit My Job to Follow My Passion — Full Time',
    creator: 'Ankit Bhatia (@AnkitBhatiaFilms)',
    youtubeId: '8tNahnD3nwg',
    youtubeUrl: 'https://www.youtube.com/watch?v=8tNahnD3nwg',
    teaser: 'A software engineer in Pune who picked up a camera as a hobby, and the years-long road from there to quitting corporate life for travel filmmaking full time.',
    sections: [
      {
        heading: 'The job',
        body: 'Ankit Bhatia worked as a software engineer in Pune after college. Photography started as a hobby on the side — nothing more than something to do between the rhythm of a regular engineering job.',
      },
      {
        heading: 'The trip that changed the direction',
        body: 'A trip to Ladakh became the turning point. Somewhere in that trip, photography stopped being enough — he found himself pulled toward video, toward actually telling a story with a place rather than just capturing a frame of it. That\'s the moment multiple retellings of his story point back to as where cinematic travel filmmaking actually started for him.',
      },
      {
        heading: 'Building it on the side, for years',
        body: 'This wasn\'t a clean jump. He kept the engineering job and built the YouTube channel on the side, slowly, growing it from a small following into something real over several years. By his own account, he wanted to quit as early as 2019 — but his parents weren\'t on board, and he didn\'t have their blessing to walk away from a stable job. So he kept doing both for more than a year longer than he wanted to.',
      },
      {
        heading: 'The leap',
        body: 'The actual exit lines up with being selected for YouTube\'s "Next Up" creator program in early 2021 — external validation that seems to have been the final push to finally leave the job and go full-time into filmmaking.',
      },
    ],
    bestPart: 'Finally getting to do the thing full time — and the belief, stated plainly in his own words, that "life is too short to be confined by the expectations of others."',
    hardPart: 'Not having his parents\' support for the decision, and the long stretch of working the day job and building the channel at the same time rather than being able to choose one cleanly.',
  },
];

function youtubeThumb(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

function interleaveArticlesIntoPosts(posts) {
  const result = [];
  let postIdx = 0;
  let articleIdx = 0;
  for (const postsBeforeThisArticle of ARTICLE_INSERT_SCHEDULE) {
    for (let c = 0; c < postsBeforeThisArticle && postIdx < posts.length; c++) {
      result.push({ kind: 'post', data: posts[postIdx++] });
    }
    if (articleIdx < ARTICLES.length) {
      result.push({ kind: 'article', data: ARTICLES[articleIdx++] });
    }
  }
  while (postIdx < posts.length) {
    result.push({ kind: 'post', data: posts[postIdx++] });
  }
  return result;
}

function articleCardHtml(article) {
  return `
    <div class="article-card" data-article-id="${article.id}">
      <img class="article-card-hero" src="${youtubeThumb(article.youtubeId)}" alt="${escapeHtml(article.title)}" loading="lazy" />
      <div class="article-card-body">
        <span class="article-card-tag">Story</span>
        <h3 class="article-card-title">${escapeHtml(article.title)}</h3>
        <p class="article-card-teaser">${escapeHtml(article.teaser)}</p>
        <span class="article-card-byline">From a video by ${escapeHtml(article.creator)}</span>
      </div>
    </div>
  `;
}

function openArticle(articleId) {
  const article = ARTICLES.find((a) => a.id === articleId);
  if (!article) return;
  const page = document.getElementById('article-page');

  document.getElementById('article-page-title').textContent = article.title;
  document.getElementById('article-page-video').innerHTML = `
    <iframe
      src="https://www.youtube.com/embed/${article.youtubeId}"
      title="${escapeHtml(article.title)}"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  `;
  document.getElementById('article-page-byline').textContent = `Based on a video by ${article.creator}`;

  document.getElementById('article-page-sections').innerHTML = article.sections
    .map((s) => `<h4>${escapeHtml(s.heading)}</h4><p>${escapeHtml(s.body)}</p>`)
    .join('');

  document.getElementById('article-page-best').textContent = article.bestPart;
  document.getElementById('article-page-hard').textContent = article.hardPart;

  document.getElementById('article-page-source-link').href = article.youtubeUrl;

  page.style.display = 'flex';
}

function closeArticle() {
  document.getElementById('article-page').style.display = 'none';
  // Stop playback by clearing the iframe rather than just hiding it.
  document.getElementById('article-page-video').innerHTML = '';
}
