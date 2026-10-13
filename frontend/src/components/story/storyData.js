/** Regional history is sourced in RESEARCH.md. Tints are artistic lighting. */
export const CHAPTERS = [
  {
    id: 'mountains', label: 'Mountains', word: 'Skardu',
    eyebrow: 'A place above the ordinary', title: 'Some places stay with you.',
    body: 'Beyond the city, the Karakoram opens into a world of stone, snow and quiet. This is the landscape that inspires Skardu Spring.',
    image: '/images/story/karakoram.webp',
    alt: 'An artistic view of a glacial river below the rugged Karakoram mountains at dawn',
    photoLabel: '01 / The Karakoram', note: 'A mountain story, told in five chapters.',
    color: '#e7ece8', ink: '#17332f', tint: 'rgba(172, 206, 208, 0.17)', tilt: -4,
    prop: 'stone', propPosition: { x: 79, y: 28, rotation: -18 },
  },
  {
    id: 'river', label: 'River', word: 'Flow',
    eyebrow: 'The Indus valley', title: 'A river writes the landscape.',
    body: 'Snow and glacier melt help feed the Indus basin. Around Skardu, water connects the high mountains with fields, orchards and the everyday life of the valley.',
    image: '/images/story/indus.webp',
    alt: 'An artistic landscape of the turquoise Indus winding through the dry Skardu valley',
    photoLabel: '02 / The Indus valley', note: 'From the high mountains, life flows outward.',
    color: '#d9e8e6', ink: '#163c39', tint: 'rgba(114, 182, 185, 0.2)', tilt: 3,
    prop: 'stone', propPosition: { x: 23, y: 30, rotation: 24 },
  },
  {
    id: 'heritage', label: 'Heritage', word: 'Roots',
    eyebrow: 'Baltistan · Living heritage', title: 'Stone remembers. People carry it on.',
    body: 'Balti is the native language of Skardu. In nearby Shigar, a seventeenth-century fort-palace and its carved timber tell a story of local craftsmanship, renewed through conservation.',
    image: '/images/story/heritage.webp',
    alt: 'An artistic interpretation of a traditional Balti stone and carved timber fort courtyard',
    photoLabel: '03 / Stone & timber', note: 'A heritage still lived, spoken and made.',
    color: '#e7dbc7', ink: '#48392b', tint: 'rgba(196, 164, 112, 0.16)', tilt: -2,
    prop: 'stone', propPosition: { x: 75, y: 33, rotation: -30 },
  },
  {
    id: 'orchards', label: 'Orchards', word: 'Bloom',
    eyebrow: 'Chunda valley · The turning seasons', title: 'Spring arrives one blossom at a time.',
    body: 'Above Skardu, Chunda’s terraced fields, apricot orchards and stone houses give the seasons a human scale. Pale blossoms make way for fruit, and the valley changes colour again.',
    image: '/images/story/orchard.webp',
    alt: 'An artistic view of apricot blossoms and terraced Balti orchards beneath mountain peaks',
    photoLabel: '04 / The apricot orchards', note: 'The small, generous things of mountain life.',
    color: '#e7e6cf', ink: '#35452f', tint: 'rgba(154, 183, 132, 0.17)', tilt: 3,
    prop: 'apricot', propPosition: { x: 74, y: 27, rotation: 17 },
  },
  {
    id: 'table', label: 'Your table', word: 'Together',
    eyebrow: 'Skardu Spring · An invitation', title: 'Bring a little of Skardu to the table.',
    body: 'A place is remembered in the moments we share. Make room for a slower meal, a longer conversation and the next chapter of your own story.',
    image: '/images/story/table.webp',
    alt: 'An artistic still life of a shared table with ceramic cups, apricots and a mountain view',
    photoLabel: '05 / A place at the table', note: 'The journey continues with you.',
    color: '#183c36', ink: '#f5f0e4', tint: 'rgba(111, 169, 146, 0.2)', tilt: 0,
    prop: 'apricot', propPosition: { x: 24, y: 27, rotation: -22 },
  },
];

export const JOURNEY = [
  { when: 'The river', title: 'A landscape connected by water', text: 'Mountain snow and glacier melt contribute to the Indus basin, linking the heights with the cultivated valley.', image: '/images/story/indus.webp' },
  { when: '17th century', title: 'Shigar’s palace on the rock', text: 'Fong Khar, the fort-palace at Shigar, was built on a great boulder. Stone and carved timber remain part of its identity.', image: '/images/story/heritage.webp' },
  { when: '1999–2004', title: 'Heritage returns to daily life', text: 'The restoration of Shigar Fort accompanied improvements to nearby settlements and renewed traditional building skills.', image: '/images/story/heritage.webp' },
  { when: 'Every spring', title: 'The orchards begin again', text: 'In Chunda valley, apricot blossom announces another growing season among terraced fields and stone houses.', image: '/images/story/orchard.webp' },
  { when: 'Today', title: 'A story to share', text: 'Skardu Spring takes its inspiration from this place. The next chapter belongs at your table.', image: '/images/story/table.webp' },
];

export const SOURCES = [
  { title: 'Skardu: language, landscape & history', publisher: 'Tourism Department, Gilgit-Baltistan', href: 'https://e-tourism.visitgilgitbaltistan.gov.pk/districts/skardu' },
  { title: 'Chunda valley & its apricot orchards', publisher: 'Tourism Department, Gilgit-Baltistan', href: 'https://e-tourism.visitgilgitbaltistan.gov.pk/tourist-destinations/chunda-valley' },
  { title: 'The rehabilitation of Shigar Palace', publisher: 'Aga Khan Trust for Culture', href: 'https://static.the.akdn/53832/1641873948-2005_hcsp_hunza.pdf' },
  { title: 'Cultural heritage & identity in Pakistan', publisher: 'Aga Khan Development Network', href: 'https://the.akdn/en/resources-media/whats-new/our-stories/akdn-interview-salman-beg-cultural-heritage-and-identity-pakistan' },
  { title: 'Glaciers & water availability in Pakistan', publisher: 'ICIMOD', href: 'https://www.icimod.org/importance-of-glaciers-for-water-availability-in-pakistan/' },
];
