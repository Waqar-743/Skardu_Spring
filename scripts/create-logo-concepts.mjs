import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('../frontend/node_modules/sharp');
const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'frontend/public/brand-concepts');
const review = path.join(root, 'brand-review/story-redesign-2026-10-11');
await fs.mkdir(output, { recursive: true });
await fs.mkdir(review, { recursive: true });
const ink = '#22483e';
const marks = [
  { name: 'Mountain in a Drop', desc: 'The mountain and water, held in one simple seal.', mark: '<path d="M0-46C-14-27-36-8-36 13a36 36 0 0 0 72 0C36-8 14-27 0-46Z" fill="none" stroke-width="2.5"/><path d="m-27 18 20-27 13 16 10-10 16 21" fill="none" stroke-width="2.5"/><path d="M-24 26H24" stroke-width="1.5"/>', type: 0 },
  { name: 'The River S', desc: 'A flowing S, drawn like a river through the valley.', mark: '<path d="M30-35C-2-53-40-30-26-8-15 10 25-6 28 18 32 47-11 53-32 33" fill="none" stroke-width="9" stroke-linecap="round"/><path d="M26-26C0-38-24-27-19-13" fill="none" stroke-width="1.5"/>', type: 1 },
  { name: 'The Heritage Window', desc: 'A quiet architectural mark inspired by timber galleries.', mark: '<path d="M-31 40V-16a31 31 0 0 1 62 0v56Z" fill="none" stroke-width="2.5"/><path d="M-21 40V-13a21 21 0 0 1 42 0v53M0-33V40M-28 0H28M-28 19H28" fill="none" stroke-width="1.5"/><path d="m-20 17 20-20 20 20" fill="none" stroke-width="2"/>', type: 0 },
  { name: 'Twin Summits', desc: 'A bold silhouette that holds up at bottle-cap scale.', mark: '<path d="m-47 32 30-61 18 31 16-43 31 73Z" stroke="none"/><path d="m-21-21 8 15-12-1Zm37-12 11 21-15-8Z" fill="#f4f1e8" stroke="none"/>', type: 2 },
  { name: 'Apricot Bloom', desc: 'A softer identity rooted in the orchards of Baltistan.', mark: '<g fill="none" stroke-width="2.5"><ellipse cy="-25" rx="13" ry="22"/><ellipse cy="-25" rx="13" ry="22" transform="rotate(72)"/><ellipse cy="-25" rx="13" ry="22" transform="rotate(144)"/><ellipse cy="-25" rx="13" ry="22" transform="rotate(216)"/><ellipse cy="-25" rx="13" ry="22" transform="rotate(288)"/><circle r="8"/></g>', type: 0 },
  { name: 'The Spring Rings', desc: 'Water rising, rippling and reaching outward.', mark: '<g fill="none" stroke-width="2"><ellipse cy="20" rx="43" ry="18"/><ellipse cy="20" rx="31" ry="12"/><ellipse cy="20" rx="17" ry="6"/><path d="M0-43c-8 13-16 23-16 32a16 16 0 0 0 32 0C16-20 8-30 0-43Z"/></g>', type: 1 },
  { name: 'Glacial Facet', desc: 'A crystalline symbol with a restrained geometric wordmark.', mark: '<path d="m0-48 37 22v48L0 47-37 22v-48Z" fill="none" stroke-width="2.5"/><path d="m0-48-13 42-24 28 37-6 37 6-25-28Z M-13-6 0 16 12-6 M0 16v31" fill="none" stroke-width="1.8"/>', type: 2 },
  { name: 'The SS Monogram', desc: 'An editorial signature for labels, embossing and stationery.', mark: '<text x="-21" y="33" font-family="Georgia,serif" font-size="91" font-style="italic" stroke="none">S</text><text x="4" y="26" font-family="Georgia,serif" font-size="71" font-style="italic" stroke="none">S</text><path d="M-41 43H45" stroke-width="1"/>', type: 0 },
  { name: 'Valley at Dawn', desc: 'A horizon, two peaks and the first light of the day.', mark: '<circle r="44" fill="none" stroke-width="2"/><path d="m-38 18 22-27 18 22 16-30 22 35M-34 27H34M-24 34H24" fill="none" stroke-width="2"/><circle cx="-7" cy="-19" r="10" fill="none" stroke-width="2"/>', type: 1 },
  { name: 'The Journal Wordmark', desc: 'A typography-led direction with a small mountain signature.', mark: '<path d="m-30 17 17-27 13 14 12-24 20 37" fill="none" stroke-width="1.8"/><path d="M-30 25H32" stroke-width="1"/>', type: 3 },
];
function artwork(c) {
  const sans = c.type === 1 || c.type === 2;
  const font = sans ? 'Arial,sans-serif' : 'Georgia,serif';
  const name = c.type === 2 ? 'SKARDU SPRING' : 'Skardu Spring';
  const tracking = c.type === 2 ? '3' : sans ? '1.5' : '-.5';
  const size = c.type === 2 ? 25 : c.type === 3 ? 42 : 35;
  const markY = c.type === 3 ? 74 : 77;
  return '<g fill="' + ink + '" stroke="' + ink + '" stroke-linejoin="round"><g transform="translate(280 ' + markY + ')">' + c.mark + '</g><text x="280" y="174" text-anchor="middle" font-family="' + font + '" font-size="' + size + '" letter-spacing="' + tracking + '" stroke="none">' + name + '</text><text x="280" y="202" text-anchor="middle" font-family="Arial,sans-serif" font-size="8" letter-spacing="3.6" stroke="none">A PLACE. A PEOPLE. A SPRING.</text></g>';
}
for (let i = 0; i < marks.length; i++) {
  const c = marks[i];
  c.id = i + 1;
  c.file = '/brand-concepts/logo-' + String(i + 1).padStart(2, '0') + '.svg';
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 240"><title>Skardu Spring — ' + c.name + '</title>' + artwork(c) + '</svg>';
  await fs.writeFile(path.join(output, 'logo-' + String(i + 1).padStart(2, '0') + '.svg'), svg);
}
let sheet = '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1740" viewBox="0 0 1280 1740"><rect width="1280" height="1740" fill="#eeeadd"/><text x="54" y="58" font-family="Georgia,serif" font-size="34" fill="' + ink + '">Skardu Spring / Ten directions</text><text x="54" y="86" font-family="Arial,sans-serif" font-size="12" letter-spacing="1.5" fill="' + ink + '">LOGO EXPLORATION · SELECT YOUR FAVOURITE NUMBER</text>';
marks.forEach((c, i) => {
  const x = 40 + i % 2 * 620, y = 120 + Math.floor(i / 2) * 318;
  sheet += '<g transform="translate(' + x + ' ' + y + ')"><rect width="600" height="298" fill="#f8f6ef"/><text x="24" y="29" font-family="Arial,sans-serif" font-size="12" fill="' + ink + '">' + String(i + 1).padStart(2, '0') + ' / ' + c.name.toUpperCase() + '</text><g transform="translate(20 43)">' + artwork(c) + '</g></g>';
});
sheet += '</svg>';
await fs.writeFile(path.join(review, 'logo-contact-sheet.svg'), sheet);
await sharp(Buffer.from(sheet)).png().toFile(path.join(review, 'logo-contact-sheet.png'));
await fs.writeFile(path.join(root, 'frontend/src/app/brand-lab/concepts.json'), JSON.stringify(marks.map(({mark,type,...c})=>c), null, 2));
console.log('10 SVG logos and numbered contact sheet saved.');

