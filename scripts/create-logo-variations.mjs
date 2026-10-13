import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('../frontend/node_modules/sharp');
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'frontend/public/brand-concepts');
const review = path.join(root, 'brand-review/story-redesign-2026-10-11');
const { italicS } = JSON.parse(await fs.readFile(path.join(root, 'scripts/logo-glyphs.json'), 'utf8'));
const ink = '#22483e';
const paper = '#f8f6ef';
const glyph = `<path d="${italicS.path}" stroke="none"/>`;

const variations = [
  {
    id: '06A', family: 6, name: 'The Quiet Ripple', type: 'serif',
    desc: 'A solid drop above two open ripples. Simple and direct at small sizes.',
    mark: '<path d="M0-44C-6-33-14-24-14-16a14 14 0 0 0 28 0C14-24 6-33 0-44Z" stroke="none"/><g fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M-18 5C-52 11-50 33 0 35S52 11 18 5"/><path d="M-9 14C-33 18-29 27 0 27S33 18 9 14"/></g>',
  },
  {
    id: '06B', family: 6, name: 'The Source Seal', type: 'caps',
    desc: 'The spring enclosed in a circular seal, suited to caps and embossed labels.',
    mark: '<g fill="none" stroke-width="1.8"><circle r="47"/><path d="M0-32C-7-20-12-13-12-6a12 12 0 0 0 24 0C12-13 7-20 0-32Z"/><ellipse cy="22" rx="33" ry="12"/><ellipse cy="22" rx="20" ry="6"/></g>',
  },
  {
    id: '06C', family: 6, name: 'The Waterline Drop', type: 'sans',
    desc: 'A slender drop holding two flowing waterlines. A quieter, vertical identity.',
    mark: '<g fill="none" stroke-width="2.2" stroke-linecap="round"><path d="M0-47C-11-29-27-9-27 9a27 27 0 0 0 54 0C27-9 11-29 0-47Z"/><path d="M-22 12c8-8 14 7 22 0s14 8 22 0M-19 23c7-6 12 5 19 0s12 6 19 0"/></g>',
  },
  {
    id: '07A', family: 7, name: 'The Cut Prism', type: 'caps',
    desc: 'A wider cut crystal with a mountain-like centre and fine internal facets.',
    mark: '<path d="M0-47 44-11 27 39h-54l-17-50Z" fill="none" stroke-width="2.4"/><path d="M0-47-15-8 0 9 15-8ZM-44-11-15-8-27 39 0 9 27 39 15-8 44-11M0 9v30" fill="none" stroke-width="1.7"/>',
  },
  {
    id: '07B', family: 7, name: 'The Solid Glacier', type: 'serif',
    desc: 'A bold crystalline silhouette with transparent facet cuts for strong contrast.',
    mark: '<defs><mask id="facet-07b"><rect x="-60" y="-60" width="120" height="120" fill="white"/><path d="M0-46V0L40 22M0 0-40 22M0 0-40-22M0 0 40-22M0 0v46" fill="none" stroke="black" stroke-width="2"/></mask></defs><path d="M0-46 40-22v44L0 46-40 22v-44Z" stroke="none" mask="url(#facet-07b)"/>',
  },
  {
    id: '07C', family: 7, name: 'The Ice Bloom', type: 'sans',
    desc: 'Six precise crystal facets create a lighter, radial glacial mark.',
    mark: '<g fill="none" stroke-width="1.9">' + [0,60,120,180,240,300].map(a => `<path d="M0-47 12-26 0-13-12-26Z" transform="rotate(${a})"/>`).join('') + '<path d="M0-13 11.26-6.5v13L0 13-11.26 6.5v-13Z"/></g>',
  },
  {
    id: '08A', family: 8, name: 'The Woven Serif', type: 'serif',
    desc: 'Two staggered serif signatures with a clear separation at their overlap.',
    mark: `<defs><mask id="weave-08a" maskUnits="userSpaceOnUse" x="-80" y="-80" width="160" height="160"><rect x="-80" y="-80" width="160" height="160" fill="white"/><g transform="translate(-5 -30) scale(.73)" fill="white" stroke="black" stroke-width="5"><path d="${italicS.path}"/></g></mask></defs><g mask="url(#weave-08a)"><g transform="translate(-50 -47) scale(.86)">${glyph}</g></g><g transform="translate(-5 -30) scale(.73)">${glyph}</g>`,
  },
  {
    id: '08B', family: 8, name: 'The Twin Signature', type: 'italic',
    desc: 'Mirrored serif initials create a symmetrical emblem with a central waterline.',
    mark: `<g transform="translate(-61 -45) scale(.82)">${glyph}</g><g transform="translate(61 -45) scale(-.82 .82)">${glyph}</g><path d="M0 40v13M-25 53H25" fill="none" stroke-width="1.2"/>`,
  },
  {
    id: '08C', family: 8, name: 'The Flowing Ligature', type: 'caps',
    desc: 'Two custom continuous S strokes bring the monogram into a modern water motif.',
    mark: '<g fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M-5-31C-29-43-47-24-36-9-26 6-4-3-1 14 3 36-27 42-42 29"/><path d="M32-31C8-43-10-24 1-9 11 6 33-3 36 14 40 36 10 42-5 29"/></g>',
  },
];

function artwork(c) {
  const caps = c.type === 'caps';
  const serif = c.type === 'serif' || c.type === 'italic';
  const font = serif ? 'Georgia,serif' : 'Arial,sans-serif';
  const size = caps ? 25 : 35;
  const tracking = caps ? 3 : serif ? -.5 : 1;
  return `<g fill="${ink}" stroke="${ink}" stroke-linejoin="round"><g transform="translate(280 77)">${c.mark}</g><text x="280" y="174" text-anchor="middle" font-family="${font}" font-size="${size}" letter-spacing="${tracking}" font-style="${c.type === 'italic' ? 'italic' : 'normal'}" stroke="none">${caps ? 'SKARDU SPRING' : 'Skardu Spring'}</text><text x="280" y="202" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" letter-spacing="3.6" stroke="none">A PLACE. A PEOPLE. A SPRING.</text></g>`;
}

await fs.mkdir(output, { recursive: true });
await fs.mkdir(review, { recursive: true });
for (const c of variations) {
  c.file = `/brand-concepts/logo-${c.id.toLowerCase()}.svg`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240"><title>Skardu Spring — ${c.id} ${c.name}</title><desc>${c.desc}</desc>${artwork(c)}</svg>`;
  await fs.writeFile(path.join(output, `logo-${c.id.toLowerCase()}.svg`), svg);
}

let sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1360" viewBox="0 0 1440 1360"><rect width="1440" height="1360" fill="#eeeadd"/><text x="40" y="62" font-family="Georgia,serif" font-size="38" fill="${ink}">Skardu Spring / Nine new variations</text><text x="42" y="93" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.6" fill="${ink}">SPRING RINGS · GLACIAL FACET · SS MONOGRAM</text>`;
const families = ['06 / THE SPRING RINGS', '07 / GLACIAL FACET', '08 / THE SS MONOGRAM'];
variations.forEach((c, i) => {
  const row = Math.floor(i / 3);
  const x = 40 + i % 3 * 460;
  const y = 165 + row * 390;
  if (i % 3 === 0) sheet += `<text x="40" y="${y - 17}" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.8" fill="${ink}">${families[row]}</text>`;
  sheet += `<g transform="translate(${x} ${y})"><rect width="440" height="345" fill="${paper}"/><text x="23" y="31" font-family="Arial,sans-serif" font-size="13" fill="${ink}">${c.id} / ${c.name.toUpperCase()}</text><g transform="translate(20 61) scale(.7142857)">${artwork(c)}</g><line x1="24" y1="283" x2="416" y2="283" stroke="${ink}" opacity=".14"/><text x="24" y="310" font-family="Arial,sans-serif" font-size="10" letter-spacing="1.3" fill="${ink}">${c.type === 'caps' ? 'GEOMETRIC WORDMARK' : c.type === 'sans' ? 'CONTEMPORARY WORDMARK' : 'EDITORIAL WORDMARK'}</text></g>`;
});
sheet += `<text x="40" y="1325" font-family="Arial,sans-serif" font-size="12" fill="${ink}">Choose by code — 06A–06C, 07A–07C or 08A–08C. Each direction is available as an editable SVG.</text></svg>`;
await fs.writeFile(path.join(review, 'logo-variations-06-07-08.svg'), sheet);
await sharp(Buffer.from(sheet)).png().toFile(path.join(review, 'logo-variations-06-07-08.png'));
await fs.copyFile(path.join(review, 'logo-variations-06-07-08.png'), path.join(output, 'logo-variations-06-07-08.png'));
await fs.writeFile(path.join(root, 'frontend/src/app/brand-lab/variations.json'), JSON.stringify(variations.map(({ mark, type, ...c }) => c), null, 2));
console.log('Nine SVG variations, comparison sheet and gallery data saved.');
