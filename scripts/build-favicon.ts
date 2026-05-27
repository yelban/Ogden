/**
 * Generate favicon PNGs and ICO from public/favicon.svg.
 *
 * Outputs:
 *   public/favicon-16.png
 *   public/favicon-32.png
 *   public/favicon-48.png   (ICO source)
 *   public/apple-touch-icon.png (180×180)
 *   public/favicon.ico       (16+32+48 multi-size, via ImageMagick)
 *
 * Run:  bun run scripts/build-favicon.ts
 *
 * Requires: ImageMagick (`brew install imagemagick`) for the .ico bundle.
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const PUB = join(import.meta.dir, '..', 'public');
const SVG = readFileSync(join(PUB, 'favicon.svg'));

const outputs: Array<{ size: number; name: string }> = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 48, name: 'favicon-48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'pwa-192.png' },
  { size: 512, name: 'pwa-512.png' },
];

for (const { size, name } of outputs) {
  await sharp(SVG, { density: Math.max(384, size * 8) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toFile(join(PUB, name));
  console.log(`wrote public/${name}`);
}

const ico = join(PUB, 'favicon.ico');
execFileSync('magick', [
  join(PUB, 'favicon-16.png'),
  join(PUB, 'favicon-32.png'),
  join(PUB, 'favicon-48.png'),
  ico,
]);
console.log('wrote public/favicon.ico');
