import { mkdirSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const url = process.argv[2] || 'http://localhost:5173/';
const outDir = new URL('../tmp-smoke/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--window-size=1024,768'],
});
const page = await browser.newPage();
page.setDefaultTimeout(8000);
await page.setViewport({ width: 1024, height: 768 });
const errors = [];
page.on('pageerror', (err) => errors.push(String(err)));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});

await page.goto(url, { waitUntil: 'networkidle0' });
await page.screenshot({ path: new URL('01-title.png', outDir).pathname });

const play = await page.$('[aria-label="Tap to play"]');
if (!play) throw new Error('Play button not found');
const playBox = await play.boundingBox();
if (!playBox || playBox.width < 40) throw new Error(`Play button not visible: ${JSON.stringify(playBox)}`);
await play.click();
await page.waitForSelector('.station');
await page.screenshot({ path: new URL('02-map.png', outDir).pathname });

const garden = await page.$('[aria-label="Garden Siding"]');
if (!garden) throw new Error('Garden Siding not found');
await garden.click();
await page.waitForSelector('.choice');
await page.waitForSelector('.journey-train');
await page.screenshot({ path: new URL('03-trip.png', outDir).pathname });

const live = await page.$$eval('.choice:not(.is-locked-choice)', (els) => els.map((e) => e.textContent));
if (!live.length) throw new Error('No enabled answer buttons');
await page.screenshot({ path: new URL('04-choices.png', outDir).pathname });
const eq = await page.$eval('.equation', (el) => el.textContent);
const sum = eq.includes('+') ? eq.split('=').shift().split('+').map((s) => Number(s.trim())).reduce((a, b) => a + b, 0) : null;
if (sum != null) {
  await page.click(`.choice[data-value="${sum}"]`);
} else {
  await page.click('.choice:not(.is-locked-choice)');
}
await page.waitForFunction(() => document.querySelector('.journey')?.dataset.progress === '1');
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: new URL('05-after-answer.png', outDir).pathname });

if (errors.length) {
  console.error('page errors:', errors);
  throw new Error('console errors');
}
console.log('SMOKE_OK', { playBox, live });
await browser.close();
