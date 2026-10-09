// Discover blends the curated static info from Hyderabad Explorer v0
// (about/facts — short and factual, doesn't change) with a trending
// panel computed live from real posts/comments. The trending part is
// what makes this different from a plain Reddit clone: it visibly
// updates itself as the community feed grows, starting sparse on day one.

const STATIC_PLACE_INFO = {
  golconda: {
    about: 'A 16th-century Qutb Shahi fortress famous for its acoustic design — a clap at the entrance gate can be heard at the highest pavilion, nearly a kilometre away.',
    facts: ['Built in the 16th century', 'Known for acoustic engineering', 'Evening sound & light show'],
  },
  charminar: {
    about: 'Built in 1591, Charminar marks the heart of the old city and sits beside Laad Bazaar, Hyderabad\'s best-known bangle market.',
    facts: ['Built 1591', '4 minarets, each 56m tall', 'Closed 1–2pm Fridays for prayers'],
  },
  medak: {
    about: 'A 12th-century Kakatiya hill fort, now quiet ruins rather than a restored monument — usually paired with nearby Medak Cathedral.',
    facts: ['~12th century, Kakatiya origin', '~90-100km from Hyderabad', 'Free entry, no fixed hours'],
  },
  rachakonda: {
    about: 'Once the capital of the Recherla Velama chiefs; what survives is scattered fortification on a rocky hillside, more trek than monument visit.',
    facts: ['14th-century regional capital', 'No restored interior', 'Best treated as a trek'],
  },
  hussainsagar: {
    about: 'A 16th-century man-made lake at the city\'s center, home to the iconic Buddha statue and a popular evening promenade.',
    facts: ['Built 1562', 'Monolithic Buddha statue mid-lake', 'Boat rides from Necklace Road & Lumbini Park'],
  },
};

function computeTrending(posts) {
  const counts = {};
  for (const p of posts) {
    counts[p.place_id] = (counts[p.place_id] || 0) + 1;
  }
  return PLACES
    .map((place) => ({ place, count: counts[place.id] || 0 }))
    .sort((a, b) => b.count - a.count);
}

function renderDiscover() {
  const trending = computeTrending(feedPosts);
  const container = document.getElementById('discover-list');

  container.innerHTML = trending
    .map(({ place, count }) => {
      const info = STATIC_PLACE_INFO[place.id];
      return `
      <div class="discover-card">
        <div class="discover-card-top">
          <h3>${place.name}</h3>
          ${count > 0 ? `<span class="trending-badge">${count} post${count === 1 ? '' : 's'} this week</span>` : '<span class="trending-badge quiet">Quiet for now</span>'}
        </div>
        <p class="discover-about">${info.about}</p>
        <ul class="discover-facts">
          ${info.facts.map((f) => `<li>${f}</li>`).join('')}
        </ul>
      </div>`;
    })
    .join('');
}
