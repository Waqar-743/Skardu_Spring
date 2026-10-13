import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require('../frontend/node_modules/sharp');
const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'frontend/public/brand-concepts');
const review = path.join(root, 'brand-review/animation-restoration-2026-10-11');
const drop = '<path d="M0-56C-9-40-19-29-19-20a19 19 0 0 0 38 0C19-29 9-40 0-56Z"/>';
const satellites = '<path d="M-34-30c-3 5-6 9-6 13a6 6 0 0 0 12 0c0-4-3-8-6-13ZM34-38c-3 5-6 9-6 13a6 6 0 0 0 12 0c0-4-3-8-6-13Z"/>';
const rings = '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M-18 5C-52 11-50 33 0 35S52 11 18 5"/><path d="M-9 14C-33 18-29 27 0 27S33 18 9 14"/></g>';
const refinements = [
  { id: '06A1', name: 'The Larger Drop', desc: 'The original 06A ripple, with a central droplet over a third wider and taller.', mark: drop + rings },
  { id: '06A2', name: 'The Three Drops', desc: 'The larger central droplet with two smaller drops, keeping the open spring ripples.', mark: drop + satellites + rings },
];
const art = (c) => `<g color="#22483e" fill="currentColor"><g transform="translate(280 85)">${c.mark}</g><text x="280" y="180" text-anchor="middle" font-family="Georgia,serif" font-size="35" letter-spacing="-.5">Skardu Spring</text><text x="280" y="208" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" letter-spacing="3.6">A PLACE. A PEOPLE. A SPRING.</text></g>`;
await fs.mkdir(review, { recursive: true });
for (const c of refinements) {
  c.file = `/brand-concepts/logo-${c.id.toLowerCase()}.svg`;
  await fs.writeFile(path.join(out, `logo-${c.id.toLowerCase()}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240"><title>Skardu Spring / ${c.id}</title>${art(c)}</svg>`);
}
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="510"><rect width="1280" height="510" fill="#eeeadd"/><text x="40" y="55" font-family="Georgia,serif" font-size="35" fill="#22483e">Skardu Spring / Refining 06A</text><text x="42" y="86" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.5" fill="#22483e">A LARGER DROP · MORE DROPLETS</text>${refinements.map((c, i) => `<g transform="translate(${40 + i * 610} 120)"><rect width="590" height="340" fill="#f8f6ef"/><text x="24" y="32" font-family="Arial,sans-serif" font-size="12" fill="#22483e">${c.id} / ${c.name.toUpperCase()}</text><g transform="translate(15 61)">${art(c)}</g></g>`).join('')}</svg>`;
await fs.writeFile(path.join(review, 'logo-06a-refinements.svg'), sheet);
await sharp(Buffer.from(sheet)).png().toFile(path.join(review, 'logo-06a-refinements.png'));
await fs.copyFile(path.join(review, 'logo-06a-refinements.png'), path.join(out, 'logo-06a-refinements.png'));
await fs.writeFile(path.join(root, 'frontend/src/app/brand-lab/refinements.json'), JSON.stringify(refinements.map(({mark, ...c}) => c), null, 2));
console.log('Two enlarged 06A refinements saved.');
