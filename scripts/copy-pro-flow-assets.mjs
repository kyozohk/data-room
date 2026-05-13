#!/usr/bin/env node
/**
 * Copy media + image assets from kyozo-pro-flow's public folder into this
 * dataroom's public/ so the landing page can render the real videos, photos,
 * and decorative PNGs.
 *
 * Usage:
 *   npm run copy-assets
 *
 * Override the source with:
 *   KYOZO_PRO_FLOW_PUBLIC=/path/to/kyozo-pro-flow/public npm run copy-assets
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const SRC =
  process.env.KYOZO_PRO_FLOW_PUBLIC ||
  path.resolve(ROOT, '..', 'kyozo-pro-flow', 'public');

const DEST = path.join(ROOT, 'public');

const ASSETS = [
  // Parallax images
  'Parallax1.jpg', 'Parallax2.jpg', 'Parallax3.jpg', 'Parallax4.jpg', 'Parallax5.jpg',
  // VideoWall sources
  'city.mp4', 'concert.mp4', 'crafting.mp4', 'dancer.mp4', 'lights.mp4',
  'paint.mp4', 'performance.mp4', 'pottery.mp4', 'prod.mp4', 'producing.mp4',
  // Decorative PNGs
  'left-top.png', 'right-top.png', 'middle-circle.png', 'middle-triangle.png',
  'bottom-left.png', 'bottom-right.png',
  'card-3.png', 'iphone.png',
  // Branding from pro-flow
  'logo.png',
];

if (!fs.existsSync(SRC)) {
  console.error(`\nSource folder not found: ${SRC}`);
  console.error('Set KYOZO_PRO_FLOW_PUBLIC to the path of kyozo-pro-flow/public.\n');
  process.exit(1);
}

fs.mkdirSync(DEST, { recursive: true });

let copied = 0;
let skipped = 0;
let missing = [];

for (const name of ASSETS) {
  const from = path.join(SRC, name);
  const to = path.join(DEST, name);
  if (!fs.existsSync(from)) {
    missing.push(name);
    continue;
  }
  const srcStat = fs.statSync(from);
  if (fs.existsSync(to)) {
    const destStat = fs.statSync(to);
    if (destStat.size === srcStat.size && destStat.mtimeMs >= srcStat.mtimeMs) {
      skipped++;
      continue;
    }
  }
  fs.copyFileSync(from, to);
  const kb = (srcStat.size / 1024).toFixed(1);
  console.log(`  ✓ ${name} (${kb} KB)`);
  copied++;
}

console.log(`\nCopied ${copied}, up-to-date ${skipped}`);
if (missing.length) {
  console.log(`Missing in source (${missing.length}): ${missing.join(', ')}`);
}
