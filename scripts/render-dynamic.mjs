// Renders the two data-driven profile cards. Runs in CI with zero dependencies.
//   GITHUB_TOKEN=... PROFILE_LOGIN=luomo66ccff node scripts/render-dynamic.mjs
// Writes assets/trailblaze.svg (stats) and assets/cycles.svg (framed contribution snake).
import fs from 'node:fs';
import path from 'node:path';
import { C, esc, frame, panelDefs, svgDoc, star5, r2, DYNAMIC_FACES } from '../design/lib.mjs';

const root = path.join(import.meta.dirname, '..');
const login = process.env.PROFILE_LOGIN || 'luomo66ccff';
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error('GITHUB_TOKEN is required');

const fonts = DYNAMIC_FACES.map(([k, w]) => [k, w, fs.readFileSync(path.join(root, 'assets', 'fonts', `${k}-${w}.woff2`)).toString('base64')]);

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { authorization: `bearer ${token}`, 'content-type': 'application/json', 'user-agent': 'luomo-profile-cards' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL failed: ${res.status} ${JSON.stringify(json.errors || json)}`);
  return json.data;
}

async function collect() {
  const { user } = await gql(
    `query($login:String!){user(login:$login){
      createdAt followers{totalCount} pullRequests{totalCount} issues{totalCount}
      publicRepos:repositories(privacy:PUBLIC,ownerAffiliations:OWNER){totalCount}
      repositories(privacy:PUBLIC,ownerAffiliations:OWNER,isFork:false,first:100,orderBy:{field:STARGAZERS,direction:DESC}){
        nodes{stargazerCount languages(first:10,orderBy:{field:SIZE,direction:DESC}){edges{size node{name}}}}}
      contributionsCollection{contributionYears}}}`,
    { login }
  );
  let commits = 0;
  for (const y of user.contributionsCollection.contributionYears) {
    const d = await gql(
      `query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){totalCommitContributions restrictedContributionsCount}}}`,
      { login, from: `${y}-01-01T00:00:00Z`, to: `${y}-12-31T23:59:59Z` }
    );
    const cc = d.user.contributionsCollection;
    commits += cc.totalCommitContributions + cc.restrictedContributionsCount;
  }
  const langs = new Map();
  let stars = 0;
  for (const r of user.repositories.nodes) {
    stars += r.stargazerCount;
    for (const e of r.languages.edges) langs.set(e.node.name, (langs.get(e.node.name) || 0) + e.size);
  }
  return {
    createdAt: user.createdAt,
    followers: user.followers.totalCount,
    prs: user.pullRequests.totalCount,
    issues: user.issues.totalCount,
    repos: user.publicRepos.totalCount,
    stars,
    commits,
    langs: [...langs.entries()].sort((a, b) => b[1] - a[1]),
  };
}

const W = 1200;
const LANG_TINTS = [C.gold, C.lapis, C.pink, '#7cc9b8', '#d0545e', '#cfc6b4'];

export function trailblaze(s, now = new Date()) {
  const H = 400;
  const exp = s.commits + 4 * s.prs + 2 * s.issues + 3 * s.stars + 10 * s.followers + s.repos;
  const tl = Math.max(1, Math.min(70, Math.floor(Math.sqrt(exp) * 1.6)));
  const eq = Math.min(6, Math.floor(tl / 10));
  const created = new Date(s.createdAt);
  const days = Math.floor((now - created) / 86400000);

  const cx = 196, cy = 212, R = 100;
  const ticks = [];
  for (let i = 0; i < 70; i++) {
    const a = ((-90 + (i * 360) / 70) * Math.PI) / 180;
    const on = i < tl;
    const r1 = i % 10 === 0 ? R - 12 : R - 7;
    ticks.push(
      `<line x1="${r2(cx + Math.cos(a) * r1)}" y1="${r2(cy + Math.sin(a) * r1)}" x2="${r2(cx + Math.cos(a) * R)}" y2="${r2(cy + Math.sin(a) * R)}" stroke="${
        on ? C.goldHi : C.mute
      }" stroke-opacity="${on ? 0.95 : 0.35}" stroke-width="${i % 10 === 0 ? 2 : 1.3}"/>`
    );
  }
  const eqDots = [...Array(6)]
    .map((_, i) => `<path d="${star5(cx - 64 + i * 19, cy + 142, 5.5)}" fill="${i < eq ? C.goldHi : 'none'}" stroke="${C.gold}" stroke-opacity="${i < eq ? 1 : 0.5}"/>`)
    .join('');

  const cells = [
    [s.stars, '获得星标', 'STARS'],
    [s.commits, '提交', 'COMMITS'],
    [s.prs, '合并请求', 'PULL REQUESTS'],
    [s.issues, '议题', 'ISSUES'],
    [s.repos, '公开仓库', 'PUBLIC REPOS'],
    [s.followers, '同伴', 'FOLLOWERS'],
  ]
    .map(([v, cn, en], i) => {
      const x = 384 + (i % 3) * 150, y = 160 + Math.floor(i / 3) * 112;
      return `<g transform="translate(${x} ${y})"><text class="f-CG" font-weight="600" font-size="46" fill="${C.ivory}">${v.toLocaleString('en-US')}</text>
<text y="30" class="f-NS" font-weight="500" font-size="14.5" letter-spacing="2" fill="${C.ivoryDim}">${cn}</text>
<text y="50" class="f-JB" font-size="9.5" letter-spacing="2.2" fill="${C.goldDim}">${en}</text></g>`;
    })
    .join('');

  const total = s.langs.reduce((a, [, v]) => a + v, 0) || 1;
  const top = s.langs.slice(0, 6);
  const lx = 862, lw = 282;
  let acc = 0;
  const bar = top
    .map(([, v], i) => {
      const w = (v / total) * lw;
      const seg = `<rect x="${r2(lx + acc)}" y="150" width="${r2(Math.max(w - 2, 1))}" height="10" fill="${LANG_TINTS[i]}"/>`;
      acc += w;
      return seg;
    })
    .join('');
  const legend = top
    .map(([name, v], i) => {
      const y = 200 + i * 30;
      return `<circle cx="${lx + 5}" cy="${y - 5}" r="4.5" fill="${LANG_TINTS[i]}"/><text x="${lx + 20}" y="${y}" class="f-CG" font-weight="600" font-size="19" fill="${C.ivory}">${esc(
        name
      )}</text><text x="${lx + lw}" y="${y}" text-anchor="end" class="f-JB" font-size="12.5" fill="${C.ivoryDim}">${((v / total) * 100).toFixed(1)}%</text>`;
    })
    .join('');

  const ymd = `${created.getUTCFullYear()} 年 ${created.getUTCMonth() + 1} 月 ${created.getUTCDate()} 日`;
  const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<text x="56" y="62" class="f-JB" font-size="11" letter-spacing="5" fill="${C.goldDim}">TRAILBLAZE RECORD</text>
<text x="${W - 56}" y="62" text-anchor="end"><tspan class="f-NS" font-size="13" letter-spacing="1.5" fill="${C.ivoryDim}">自 ${ymd} 至今 · 旅程第 </tspan><tspan class="f-CG" font-weight="700" font-size="17" fill="${C.goldHi}">${days.toLocaleString(
    'en-US'
  )}</tspan><tspan class="f-NS" font-size="13" fill="${C.ivoryDim}"> 天</tspan></text>
<line x1="56" y1="82" x2="${W - 56}" y2="82" stroke="${C.gold}" stroke-opacity=".2"/>

<circle cx="${cx}" cy="${cy}" r="${R + 16}" fill="none" stroke="${C.gold}" stroke-opacity=".22"/>
<circle cx="${cx}" cy="${cy}" r="${R - 22}" fill="${C.ink}" fill-opacity=".5" stroke="${C.gold}" stroke-opacity=".35"/>
${ticks.join('')}
<text x="${cx}" y="${cy - 38}" text-anchor="middle" class="f-JB" font-size="11" letter-spacing="4" fill="${C.gold}">TL</text>
<text x="${cx}" y="${cy + 26}" text-anchor="middle" class="f-CG" font-weight="600" font-size="72" fill="${C.ivory}">${tl}</text>
<text x="${cx}" y="${cy + 56}" text-anchor="middle" class="f-NS" font-weight="500" font-size="13" letter-spacing="3" fill="${C.ivoryDim}">开拓等级</text>
${eqDots}
<text x="${cx + 62}" y="${cy + 146.5}" class="f-NS" font-size="12" letter-spacing="1.5" fill="${C.mute}">均衡等级 ${eq}</text>

<line x1="350" y1="120" x2="350" y2="350" stroke="${C.gold}" stroke-opacity=".15"/>
${cells}
<line x1="826" y1="120" x2="826" y2="350" stroke="${C.gold}" stroke-opacity=".15"/>

<text x="${lx}" y="128"><tspan class="f-NS" font-weight="500" font-size="15" letter-spacing="3" fill="${C.ivory}">语言构成</tspan><tspan dx="10" class="f-JB" font-size="10" letter-spacing="2.2" fill="${C.goldDim}">LANGUAGES</tspan></text>
<rect x="${lx}" y="150" width="${lw}" height="10" fill="${C.mute}" opacity=".25"/>${bar}
${legend}
<text x="${W - 56}" y="${H - 34}" text-anchor="end" class="f-JB" font-size="9.5" letter-spacing="1.8" fill="${C.mute}">UPDATED ${now.toISOString().slice(0, 10)} UTC</text>
${frame(W, H, { opacity: 0.45 })}`;
  return svgDoc({
    w: W,
    h: H,
    title: `Trailblaze Level ${tl}`,
    desc: `${s.stars} stars, ${s.commits} commits, ${s.prs} pull requests, ${s.issues} issues, ${s.repos} public repositories, ${s.followers} followers. Top languages: ${top
      .map(([n]) => n)
      .join(', ')}.`,
    defs: panelDefs('bg', { fx: 0.16, fy: 0.5, glow: '#1d2450' }),
    css: '',
    body,
    fonts,
  });
}

/** Frames the snake animation (generated by Platane/snk) inside a panel. */
export function cycles(snakeSvg) {
  const H = 300;
  const vb = snakeSvg.match(/viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"/);
  const [vx, vy, vw, vh] = vb ? vb.slice(1).map(Number) : [0, 0, 880, 192];
  const inner = snakeSvg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
  const tw = 1060, th = Math.min(200, (tw * vh) / vw);
  const x = (W - tw) / 2, y = 36;
  const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<svg x="${x}" y="${y}" width="${tw}" height="${r2(th)}" viewBox="${vx} ${vy} ${vw} ${vh}" preserveAspectRatio="xMidYMid meet">${inner}</svg>
<text x="${W / 2}" y="${H - 40}" text-anchor="middle" class="f-NS" font-size="14" letter-spacing="4" fill="${C.ivoryDim}">每一次贡献，都被温柔地回收，再出发。</text>
${frame(W, H, { opacity: 0.4 })}`;
  return svgDoc({
    w: W,
    h: H,
    title: 'Contribution loop',
    desc: 'A snake travels the contribution calendar and collects every square.',
    defs: panelDefs('bg', { fx: 0.5, fy: 0.5, glow: '#1a1f42' }),
    body,
    fonts: fonts.filter(([k, w]) => k === 'NS' && w === 400),
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const stats = await collect();
  console.log(JSON.stringify({ ...stats, langs: stats.langs.slice(0, 8) }));
  fs.writeFileSync(path.join(root, 'assets', 'trailblaze.svg'), trailblaze(stats));
  const snakeFile = path.join(root, 'assets', 'generated', 'snake.svg');
  if (fs.existsSync(snakeFile)) fs.writeFileSync(path.join(root, 'assets', 'cycles.svg'), cycles(fs.readFileSync(snakeFile, 'utf8')));
  else console.warn('snake.svg not found; cycles.svg left unchanged');
}
