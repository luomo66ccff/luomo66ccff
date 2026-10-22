// Downloads the OFL fonts (from github.com/google/fonts) and the avatar used by the build.
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(import.meta.dirname, '.cache', 'fonts');
fs.mkdirSync(dir, { recursive: true });
const base = 'https://raw.githubusercontent.com/google/fonts/main/ofl/';
const files = {
  'NotoSerifSC.ttf': 'notoserifsc/NotoSerifSC%5Bwght%5D.ttf',
  'CormorantGaramond.ttf': 'cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf',
  'CormorantGaramond-Italic.ttf': 'cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf',
  'JetBrainsMono.ttf': 'jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf',
  'DotGothic16.ttf': 'dotgothic16/DotGothic16-Regular.ttf',
};
async function get(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log(path.basename(file), fs.statSync(file).size);
}
for (const [name, src] of Object.entries(files)) await get(base + src, path.join(dir, name));
await get('https://avatars.githubusercontent.com/u/105687384?s=320&v=4', path.join(import.meta.dirname, '.cache', 'avatar.png'));
