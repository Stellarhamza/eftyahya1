import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

/** Purple hex + crosshair mark — tab favicon, PWA icons, and navbar logo share this source. */
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#a855f7"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>
<path d="M256 48 L448 160 V352 L256 464 L64 352 V160 Z" fill="url(#g)" opacity="0.95"/>
<circle cx="256" cy="256" r="72" fill="none" stroke="#ede9fe" stroke-width="10"/>
<circle cx="256" cy="256" r="8" fill="#ede9fe"/>
<line x1="256" y1="184" x2="256" y2="120" stroke="#ede9fe" stroke-width="8"/>
<line x1="256" y1="328" x2="256" y2="392" stroke="#ede9fe" stroke-width="8"/>
<line x1="184" y1="256" x2="120" y2="256" stroke="#ede9fe" stroke-width="8"/>
<line x1="328" y1="256" x2="392" y2="256" stroke="#ede9fe" stroke-width="8"/>
</svg>`;

const brandDir = path.join(process.cwd(), 'public', 'images', 'brand');
const publicDir = path.join(process.cwd(), 'public');
fs.mkdirSync(brandDir, { recursive: true });
const buf = Buffer.from(svg);

await sharp(buf).webp({ quality: 90 }).toFile(path.join(brandDir, 'brand-logo.webp'));
await sharp(buf).resize(512, 512).webp({ quality: 90 }).toFile(path.join(brandDir, 'brand-logo-512.webp'));
await sharp(buf).resize(64, 64).png().toFile(path.join(brandDir, 'brand-icon-64.png'));
await sharp(buf).resize(32, 32).png().toFile(path.join(brandDir, 'favicon-32.png'));
await sharp(buf).resize(16, 16).png().toFile(path.join(brandDir, 'favicon-16.png'));
await sharp(buf).resize(180, 180).png().toFile(path.join(brandDir, 'apple-touch-icon.png'));
await sharp(buf).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));

const legacyRootPng = [path.join(publicDir, 'favicon-32.png'), path.join(publicDir, 'favicon-16.png')];
for (const file of legacyRootPng) {
  if (fs.existsSync(file)) fs.unlinkSync(file);
}

console.log('EFT brand assets written (navbar + favicon + PWA).');
