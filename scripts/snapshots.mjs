#!/usr/bin/env node
/**
 * Capture screenshots of every dataroom page using Playwright.
 *
 * Usage:
 *   1. Start the dev server:  npm run dev
 *   2. In another terminal:   npm run snap
 *
 * Writes 1440x900 desktop PNGs into public/screenshots/. Reads
 * DATAROOM_PASSWORD and ADMIN_PASSWORD from .env.local so the
 * authenticated pages can be captured too.
 *
 * Requires Playwright installed:
 *   npm install -D playwright
 *   npx playwright install chromium
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as loadEnv } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'public', 'screenshots');

// Load .env.local for the passwords
loadEnv({ path: path.join(ROOT, '.env.local') });
const VISITOR_PW = process.env.DATAROOM_PASSWORD;
const ADMIN_PW = process.env.ADMIN_PASSWORD;
const BASE = process.env.SNAP_BASE_URL || 'http://localhost:3030';

if (!VISITOR_PW || !ADMIN_PW) {
  console.error(
    'Missing DATAROOM_PASSWORD or ADMIN_PASSWORD in .env.local — needed to capture protected pages.'
  );
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });

const shots = [
  { name: 'login',       path: '/login',        login: false, full: true  },
  { name: 'landing',     path: '/docs',         login: 'visitor', full: true },
  { name: 'doc',         path: 'auto',          login: 'visitor', full: true }, // resolved at runtime to first doc
  { name: 'admin-login', path: '/admin/login',  login: false, full: true },
  { name: 'admin',       path: '/admin',        login: 'admin', full: true },
];

async function loginAs(page, role) {
  if (role === 'visitor') {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="text"]', 'Screenshot bot');
    await page.fill('input[type="password"]', VISITOR_PW);
    await Promise.all([
      page.waitForURL((u) => !u.pathname.startsWith('/login'), { timeout: 10000 }),
      page.click('button[type="submit"]'),
    ]);
  } else if (role === 'admin') {
    await page.goto(`${BASE}/admin/login`);
    await page.fill('input[type="password"]', ADMIN_PW);
    await Promise.all([
      page.waitForURL((u) => !u.pathname.endsWith('/admin/login'), { timeout: 10000 }),
      page.click('button[type="submit"]'),
    ]);
  }
}

async function firstDocPath(page) {
  // Visit /docs and click the first category card item
  await page.goto(`${BASE}/docs`);
  const href = await page.$eval(
    'a[href^="/docs/"]:not([href="/docs"])',
    (el) => el.getAttribute('href')
  );
  return href || '/docs';
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  for (const shot of shots) {
    console.log(`→ ${shot.name}`);
    if (shot.login) await loginAs(page, shot.login);

    let target = shot.path;
    if (target === 'auto') target = await firstDocPath(page);

    await page.goto(`${BASE}${target}`);
    await page.waitForLoadState('networkidle');
    // small wait for animations to settle
    await page.waitForTimeout(900);

    const out = path.join(OUT, `${shot.name}.png`);
    await page.screenshot({ path: out, fullPage: !!shot.full });
    console.log(`   ✓ ${path.relative(ROOT, out)}`);
  }

  await browser.close();
  console.log('\nDone. Open public/screenshots/ to review.');
})();
