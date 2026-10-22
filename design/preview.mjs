// Screenshots assets with installed Edge so the design can be reviewed as rendered images.
//   node preview.mjs [hero.svg ...]          -> preview/<name>.png
//   node preview.mjs --readme light|dark     -> preview/readme-<theme>.png (GitHub-rendered markdown)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const here = import.meta.dirname;
const assets = path.join(here, '..', 'assets');
const out = path.join(here, 'preview');
fs.mkdirSync(out, { recursive: true });

const args = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ deviceScaleFactor: Number(process.env.DPR || 1) });
const wait = Number(process.env.WAIT || 2500);

if (args[0] === '--readme') {
  for (const theme of args.slice(1).length ? args.slice(1) : ['dark', 'light']) {
    const width = Number(process.env.WIDTH || 1280);
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: theme });
    await page.goto(pathToFileURL(path.join(here, 'preview', 'readme.html')).href + `?theme=${theme}`);
    await page.waitForTimeout(wait);
    const file = path.join(out, `readme-${theme}${width < 800 ? '-mobile' : ''}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
  }
} else {
  const files = args.length ? args : fs.readdirSync(assets).filter((f) => f.endsWith('.svg'));
  for (const f of files) {
    const svg = fs.readFileSync(path.join(assets, f), 'utf8');
    const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/) || [0, 1200, 400];
    await page.setViewportSize({ width: +w + 40, height: +h + 40 });
    const tmp = path.join(out, '_view.html');
    fs.writeFileSync(
      tmp,
      `<body style="margin:0;padding:20px;background:${process.env.BG || '#0d1117'}"><img src="../../assets/${f}" width="${w}" height="${h}"></body>`
    );
    await page.goto(pathToFileURL(tmp).href);
    await page.waitForTimeout(wait);
    const file = path.join(out, f.replace(/[\\/]/g, '_').replace(/\.svg$/, '.png'));
    await page.screenshot({ path: file });
    console.log(file);
  }
}
await browser.close();
