#!/usr/bin/env node
// Import docs from external source folders into content/{technical,company}.
// Usage: node scripts/import-docs.mjs [--dry]

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const DRY = process.argv.includes('--dry');

// Source -> destination category mappings (override per file via filename match if needed)
const SOURCES = [
  {
    label: 'KyozoVerse technical docs',
    src: process.env.KYOZOVERSE_DOCS || path.resolve(ROOT, '../KyozoVerse/docs'),
    category: 'technical',
  },
  {
    label: 'Desktop kyozo-docs (mixed)',
    src: process.env.DESKTOP_DOCS || path.resolve(process.env.HOME || '', 'Desktop/kyozo-docs'),
    // Fallback category — overridden below for known filenames
    category: 'company',
    perFile: (filename) => {
      const lc = filename.toLowerCase();
      // technical-ish stuff already in KyozoVerse
      if (/^api_|^image_|^inbox_|backend\.json|blueprint\.md/.test(lc)) return 'technical';
      // legal / runbook
      if (lc.includes('runbook') || lc.includes('legal') || lc.includes('terms')) return 'legal';
      // everything else (competitive, security, tech-overview) -> company
      return 'company';
    },
  },
];

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function safeName(name) {
  return name.replace(/[^\w.\-—\s]/g, '').replace(/\s+/g, ' ').trim();
}

function copyOne(srcFile, destFile) {
  ensureDir(path.dirname(destFile));
  if (DRY) { console.log(`  [dry] ${srcFile} -> ${destFile}`); return; }
  fs.copyFileSync(srcFile, destFile);
  console.log(`  ✓ ${path.relative(ROOT, destFile)}`);
}

function copyDir(srcDir, destDir) {
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir)) {
    const s = path.join(srcDir, entry);
    const d = path.join(destDir, entry);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else if (!DRY) fs.copyFileSync(s, d);
  }
}

const seenDestFiles = new Set();

for (const source of SOURCES) {
  console.log(`\n→ ${source.label}`);
  if (!fs.existsSync(source.src)) {
    console.log(`  (skip — not found: ${source.src})`);
    continue;
  }
  for (const entry of fs.readdirSync(source.src)) {
    const full = path.join(source.src, entry);
    const stat = fs.statSync(full);
    const lc = entry.toLowerCase();

    if (stat.isDirectory()) {
      // Asset folder for HTML pages — copy as-is into content/_assets/<dirname>
      if (lc.includes('_files') || lc.endsWith('_assets')) {
        const destDir = path.join(ROOT, 'content', '_assets', entry);
        if (!DRY) {
          ensureDir(destDir);
          copyDir(full, destDir);
        }
        console.log(`  ✓ assets dir ${entry}`);
      }
      continue;
    }

    if (!/\.(md|html|json)$/i.test(entry)) continue;
    const cat = source.perFile ? source.perFile(entry) : source.category;
    const filename = safeName(entry);
    const dest = path.join(ROOT, 'content', cat, filename);
    if (seenDestFiles.has(dest)) {
      console.log(`  ↻ skip dup ${filename}`);
      continue;
    }
    seenDestFiles.add(dest);
    copyOne(full, dest);
  }
}

console.log(DRY ? '\n[dry run — no files written]' : '\nDone.');
