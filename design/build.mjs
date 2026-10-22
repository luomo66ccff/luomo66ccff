// Builds the static SVG assets of the profile README.
//   npm run fonts   # once: downloads OFL fonts into .cache/fonts
//   npm run build   # writes ../assets/*.svg and ../assets/fonts/*.woff2
//   node build.mjs hero dialogue   # rebuild selected scenes only
import fs from 'node:fs';
import path from 'node:path';
import subsetFont from 'subset-font';
import { FONT_FILES, usedFaces, svgDoc, DYNAMIC_CJK, DYNAMIC_FACES, ASCII } from './lib.mjs';
import * as scenes from './scenes.mjs';

const here = import.meta.dirname;
const fontDir = path.join(here, '.cache', 'fonts');
const outDir = path.join(here, '..', 'assets');
const fontBuf = Object.fromEntries(
  Object.entries(FONT_FILES).map(([k, f]) => [k, fs.readFileSync(path.join(fontDir, f))])
);

// Variable fonts are pinned to one static instance per weight, which keeps each SVG small.
const STATIC = { DG: true };
function subset(key, weight, chars) {
  const opts = { targetFormat: 'woff2' };
  if (!STATIC[key]) opts.variationAxes = { wght: weight };
  return subsetFont(fontBuf[key], chars, opts);
}

async function render(spec) {
  const fonts = [];
  for (const [k, wt, chars] of usedFaces(spec.body)) fonts.push([k, wt, (await subset(k, wt, chars)).toString('base64')]);
  return svgDoc({ ...spec, fonts });
}

const only = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
for (const [name, make] of Object.entries(scenes)) {
  if (typeof make !== 'function' || (only.length && !only.includes(name))) continue;
  for (const spec of [].concat(await make())) {
    const svg = await render(spec);
    const file = path.join(outDir, spec.file);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, svg);
    console.log(`${spec.file.padEnd(36)} ${(svg.length / 1024).toFixed(1)} KB`);
  }
}

if (!only.length || only.includes('fonts')) {
  // Subsets for the CI-rendered cards. CG-600 keeps full ASCII because language names vary.
  const DYNAMIC_CHARS = {
    'NS-400': DYNAMIC_CJK + '0123456789 ·',
    'NS-500': DYNAMIC_CJK + '0123456789 ·',
    'CG-700': '0123456789,',
    'JB-400': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .%-:',
  };
  const dyn = path.join(outDir, 'fonts');
  fs.rmSync(dyn, { recursive: true, force: true });
  fs.mkdirSync(dyn, { recursive: true });
  for (const [k, wt] of DYNAMIC_FACES) {
    const buf = await subset(k, wt, DYNAMIC_CHARS[`${k}-${wt}`] || ASCII);
    fs.writeFileSync(path.join(dyn, `${k}-${wt}.woff2`), buf);
    console.log(`fonts/${k}-${wt}.woff2`.padEnd(36), (buf.length / 1024).toFixed(1), 'KB');
  }
}
