// Each export returns one spec (or a list) consumed by build.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { C, esc, starField, sparkle, star5, frame, panelDefs, grainDefs, r2 } from './lib.mjs';

const W = 1200;

// ───────────────────────────────── Plate I · hero ─────────────────────────────────
export function hero() {
  const H = 560;
  const moon = { x: 900, y: 226, r: 128 };
  const stars = starField({
    seed: 7,
    w: W,
    h: H - 60,
    count: 190,
    twinkle: 0.3,
    avoid: (x, y) => Math.hypot(x - moon.x, y - moon.y) < moon.r + 26,
  });

  // Wireframe of the "virtual moon": latitude + longitude ellipses clipped to the disc.
  const wire = [];
  for (let i = -3; i <= 3; i++) {
    const yy = moon.y + (i * moon.r) / 4;
    const half = Math.sqrt(Math.max(0, moon.r ** 2 - (yy - moon.y) ** 2));
    wire.push(`<ellipse cx="${moon.x}" cy="${r2(yy)}" rx="${r2(half)}" ry="${r2(half * 0.16)}"/>`);
  }
  for (let i = 1; i <= 5; i++) wire.push(`<ellipse cx="${moon.x}" cy="${moon.y}" rx="${r2((moon.r * i) / 6)}" ry="${moon.r}"/>`);

  // Kessoku Band: four stars, four colours.
  const band = [
    [318, 74, '#f4a6c8'],
    [382, 52, '#f6d863'],
    [446, 86, '#78b6f0'],
    [512, 62, '#ec5a5a'],
  ];
  const bandLines = band
    .slice(1)
    .map((p, i) => `<line x1="${band[i][0]}" y1="${band[i][1]}" x2="${p[0]}" y2="${p[1]}"/>`)
    .join('');
  const bandStars = band
    .map(
      ([x, y, c], i) =>
        `<circle cx="${x}" cy="${y}" r="7" fill="${c}" opacity=".18"/><circle cx="${x}" cy="${y}" r="2.2" fill="${c}" class="tw" style="animation-duration:${
          4 + i
        }s;animation-delay:-${i * 1.3}s"/>`
    )
    .join('');

  // The utility pole that glows in seven colours.
  const pole = { x: 1078, top: 300 };
  const wires = [
    [pole.x - 46, 318, 'M-10 498Q600 560 ' + (pole.x - 46) + ' 318'],
    [pole.x + 46, 318, 'M-10 520Q640 586 ' + (pole.x + 46) + ' 318'],
    [pole.x - 34, 352, 'M-10 542Q660 600 ' + (pole.x - 34) + ' 352'],
  ];

  const defs = `
${panelDefs('bg', { fx: 0.75, fy: 0.32, glow: '#1d2550' })}
${grainDefs()}
<radialGradient id="moonGlow"><stop offset="0" stop-color="${C.goldHi}" stop-opacity=".35"/><stop offset=".45" stop-color="${C.gold}" stop-opacity=".08"/><stop offset="1" stop-color="${C.gold}" stop-opacity="0"/></radialGradient>
<radialGradient id="moonFace" cx=".62" cy=".38" r=".8"><stop offset="0" stop-color="#fbf3df"/><stop offset=".6" stop-color="#e9d9b2"/><stop offset="1" stop-color="#b99f6c"/></radialGradient>
<clipPath id="panel"><rect width="${W}" height="${H}" rx="20"/></clipPath>
<clipPath id="disc"><circle cx="${moon.x}" cy="${moon.y}" r="${moon.r}"/></clipPath>
<linearGradient id="word" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf4e4"/><stop offset=".7" stop-color="${C.ivory}"/><stop offset="1" stop-color="${C.gold}"/></linearGradient>
<linearGradient id="prism" x1="0" y1="0" x2="0" spreadMethod="repeat" gradientUnits="userSpaceOnUse" y2="260">
  <stop offset="0" stop-color="#ff6b81"/><stop offset=".16" stop-color="#ffa65c"/><stop offset=".32" stop-color="#ffe46b"/><stop offset=".48" stop-color="#7fe3a4"/><stop offset=".64" stop-color="#6fd3ff"/><stop offset=".8" stop-color="#8790ff"/><stop offset="1" stop-color="#ff6b81"/>
  <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="0 260" dur="9s" repeatCount="indefinite"/>
</linearGradient>
<filter id="soft" x="-200%" y="-50%" width="500%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
<linearGradient id="streak" x1="0" x2="1"><stop offset="0" stop-color="${C.goldHi}" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>`;

  const css = `
.splash{transform-box:fill-box;transform-origin:center;animation:pulse .5s ease-in-out infinite}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(.945)}}
.orbit{transform-origin:${moon.x}px ${moon.y}px;animation:spin 140s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.halo{animation:breathe 7s ease-in-out infinite}
@keyframes breathe{0%,100%{opacity:.55}50%{opacity:1}}
.meteor{animation:fall 11s ease-in 3s infinite;opacity:0}
@keyframes fall{0%{transform:translate(0,0);opacity:0}2%{opacity:1}9%{transform:translate(-260px,130px);opacity:0}100%{opacity:0}}`;

  const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<rect width="${W}" height="${H}" rx="20" filter="url(#grain)" opacity=".05"/>
<g>${stars}</g>
<g class="meteor"><line x1="760" y1="40" x2="840" y2="0" stroke="url(#streak)" stroke-width="1.4" stroke-linecap="round"/></g>

<g stroke="${C.gold}" stroke-opacity=".4" stroke-width=".8">${bandLines}</g>${bandStars}

<!-- moon -->
<circle cx="${moon.x}" cy="${moon.y}" r="${moon.r * 2.3}" fill="url(#moonGlow)" class="halo"/>
<g class="orbit" fill="none" stroke="${C.gold}">
  <circle cx="${moon.x}" cy="${moon.y}" r="${moon.r + 34}" stroke-opacity=".28" stroke-width=".8" stroke-dasharray="2 7"/>
  <circle cx="${moon.x + moon.r + 34}" cy="${moon.y}" r="3" fill="${C.goldHi}" stroke="none"/>
</g>
<circle cx="${moon.x}" cy="${moon.y}" r="${moon.r + 14}" fill="none" stroke="${C.gold}" stroke-opacity=".22" stroke-width=".6"/>
<g clip-path="url(#disc)">
  <circle cx="${moon.x}" cy="${moon.y}" r="${moon.r}" fill="url(#moonFace)"/>
  <g fill="#b39a6a" opacity=".22">
    <ellipse cx="${moon.x + 30}" cy="${moon.y - 40}" rx="26" ry="20"/><ellipse cx="${moon.x + 62}" cy="${moon.y + 30}" rx="16" ry="12"/>
    <ellipse cx="${moon.x + 10}" cy="${moon.y + 62}" rx="30" ry="18"/><ellipse cx="${moon.x - 20}" cy="${moon.y - 4}" rx="12" ry="10"/>
  </g>
  <circle cx="${moon.x - 74}" cy="${moon.y - 18}" r="${moon.r}" fill="${C.ink2}" opacity=".94"/>
  <g fill="none" stroke="${C.gold}" stroke-width=".7" opacity=".45">${wire.join('')}</g>
</g>

<!-- power lines and the pole -->
<g clip-path="url(#panel)" fill="none" stroke="${C.ivory}" stroke-opacity=".2" stroke-width=".9">${wires.map((w) => `<path d="${w[2]}"/>`).join('')}</g>
<g filter="url(#soft)" opacity=".55" class="halo">
  <rect x="${pole.x - 5}" y="${pole.top}" width="10" height="${H - pole.top}" fill="url(#prism)"/>
  <rect x="${pole.x - 50}" y="312" width="100" height="10" fill="url(#prism)"/>
</g>
<g fill="#05060c" stroke="url(#prism)" stroke-width="1.2">
  <path d="M${pole.x - 4} ${pole.top}L${pole.x + 4} ${pole.top}L${pole.x + 6} ${H}L${pole.x - 6} ${H}Z"/>
  <rect x="${pole.x - 50}" y="314" width="100" height="6" rx="1"/>
  <rect x="${pole.x - 38}" y="348" width="76" height="5" rx="1"/>
  <rect x="${pole.x - 49}" y="304" width="6" height="11" rx="2"/><rect x="${pole.x + 43}" y="304" width="6" height="11" rx="2"/>
  <rect x="${pole.x - 37}" y="339" width="6" height="10" rx="2"/><rect x="${pole.x + 31}" y="339" width="6" height="10" rx="2"/>
  <rect x="${pole.x + 7}" y="392" width="22" height="30" rx="3"/>
</g>

<!-- title block -->
<g class="f-CG" font-weight="600" font-size="15" letter-spacing="7" fill="${C.gold}">
  <line x1="80" y1="125" x2="118" y2="125" stroke="${C.gold}" stroke-width=".8"/>
  <text x="132" y="130">AD ASTRA ABYSSOSQUE</text>
</g>
<text x="66" y="292" class="f-CGI" font-weight="500" font-size="172" fill="url(#word)" letter-spacing="-2">Luomo</text>

<g transform="translate(566 168) rotate(-20)">
  <g class="splash">
    <text x="2.4" y="2.4" text-anchor="middle" class="f-DG" font-size="24" fill="#3f3f15">Ciallo～(∠・ω&lt; )⌒★</text>
    <text x="0" y="0" text-anchor="middle" class="f-DG" font-size="24" fill="#ffff55">Ciallo～(∠・ω&lt; )⌒★</text>
  </g>
</g>

<text x="80" y="362" class="f-NS" font-weight="500" font-size="27" letter-spacing="9" fill="${C.ivoryDim}">洛墨 · 天染 · 依然</text>
<text x="80" y="430" class="f-CGI" font-weight="500" font-size="27" fill="${C.ivory}">a quiet builder of small, lasting things.</text>
<text x="81" y="470" class="f-JB" font-weight="500" font-size="12.5" letter-spacing="3.2" fill="${C.goldDim}">SELF-HOSTED · PYTHON · TYPESCRIPT · LIVE2D · SINCE MMXXII</text>

<text x="80" y="${H - 30}" class="f-CG" font-weight="600" font-size="12" letter-spacing="4.5" fill="${C.goldDim}">PLATE I — THE OBSERVER’S SKY</text>
${frame(W, H)}`;

  return {
    file: 'hero.svg',
    w: W,
    h: H,
    title: 'Luomo',
    desc: 'A midnight plate: a half-digital moon, a pole glowing in seven colours, a four-star constellation and a yellow splash line that pulses beside the name Luomo.',
    defs,
    css,
    body,
  };
}

// ───────────────────────────────── galgame text window ─────────────────────────────────
const LINES = [
  '深夜的键盘前，有人一边追番，一边照看着几台服务器。',
  '把脑海里亮晶晶的念头，慢慢打磨成每天都会用的小工具。',
  '这位旅人究竟是谁呢？——没错，就是我。',
];

export function dialogue() {
  const H = 312;
  const avatar = fs.readFileSync(path.join(import.meta.dirname, '.cache', 'avatar.png')).toString('base64');
  const fx = 46, fy = 58, fs_ = 196;
  const tx = 284, ty0 = 136, lh = 50, size = 25;
  let t = 0.7;
  const step = 0.055;
  const lines = LINES.map((line, li) => {
    const spans = [...line]
      .map((ch) => {
        const s = `<tspan visibility="hidden"><set attributeName="visibility" to="visible" begin="${t.toFixed(3)}s" fill="freeze"/>${esc(ch)}</tspan>`;
        t += step;
        return s;
      })
      .join('');
    t += 0.4;
    return `<text x="${tx}" y="${ty0 + li * lh}" class="f-NS" font-weight="400" font-size="${size}" fill="${C.ivory}" letter-spacing="0.5">${spans}</text>`;
  });
  const last = LINES[LINES.length - 1];
  const cx = tx + [...last].length * (size + 0.5) + 2;
  const cy = ty0 + (LINES.length - 1) * lh - 8;
  const menu = ['Q.SAVE', 'Q.LOAD', 'SAVE', 'LOAD', 'AUTO', 'SKIP', 'LOG', 'CONFIG'];
  let mx = W - 58;
  const menuSvg = menu
    .slice()
    .reverse()
    .map((m) => {
      const wdt = m.length * 7.6;
      mx -= wdt;
      const x = mx;
      mx -= 22;
      return `<text x="${r2(x)}" y="${H - 34}" class="f-JB${m === 'AUTO' ? ' auto' : ''}" font-size="12" font-weight="${m === 'AUTO' ? 700 : 500}" letter-spacing="1.2" fill="${
        m === 'AUTO' ? C.goldHi : C.goldDim
      }">${m}</text>`;
    })
    .join('');

  const defs = `
${panelDefs('bg', { fx: 0.15, fy: 0.0, glow: '#1a2142' })}
<linearGradient id="box" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#20284d" stop-opacity=".55"/><stop offset="1" stop-color="#0c1020" stop-opacity=".9"/></linearGradient>
<linearGradient id="plate" x1="0" x2="1"><stop offset="0" stop-color="${C.crimson}" stop-opacity=".9"/><stop offset=".75" stop-color="${C.crimson}" stop-opacity=".25"/><stop offset="1" stop-color="${C.crimson}" stop-opacity="0"/></linearGradient>
<clipPath id="face"><rect x="${fx}" y="${fy}" width="${fs_}" height="${fs_}" rx="10"/></clipPath>
<linearGradient id="vign" x1="0" y1="0" x2="0" y2="1"><stop offset=".55" stop-color="${C.ink}" stop-opacity="0"/><stop offset="1" stop-color="${C.ink}" stop-opacity=".55"/></linearGradient>`;

  const css = `
.cur{opacity:0;animation:blink 1.1s steps(1) ${t.toFixed(2)}s infinite}
@keyframes blink{0%{opacity:1}50%{opacity:0}}
.bob{animation:bob 1.1s ease-in-out ${t.toFixed(2)}s infinite}
@keyframes bob{50%{transform:translateY(3px)}}
.auto{animation:autoglow 2.4s ease-in-out infinite}
@keyframes autoglow{50%{opacity:.45}}`;

  const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<rect x="262" y="30" width="${W - 262 - 30}" height="${H - 60}" rx="12" fill="url(#box)" stroke="${C.gold}" stroke-opacity=".35"/>
<line x1="284" y1="${H - 56}" x2="${W - 58}" y2="${H - 56}" stroke="${C.gold}" stroke-opacity=".18"/>

<!-- face window -->
<rect x="${fx - 8}" y="${fy - 8}" width="${fs_ + 16}" height="${fs_ + 16}" rx="16" fill="none" stroke="${C.gold}" stroke-opacity=".5"/>
<image href="data:image/jpeg;base64,${avatar}" x="${fx}" y="${fy}" width="${fs_}" height="${fs_}" clip-path="url(#face)" preserveAspectRatio="xMidYMid slice"/>
<rect x="${fx}" y="${fy}" width="${fs_}" height="${fs_}" rx="10" fill="url(#vign)"/>
<rect x="${fx}" y="${fy}" width="${fs_}" height="${fs_}" rx="10" fill="none" stroke="${C.goldHi}" stroke-opacity=".6"/>

<!-- name plate with a witch's star brooch -->
<rect x="262" y="30" width="230" height="44" rx="12" fill="url(#plate)"/>
<g transform="translate(296 52)">
  <circle r="11" fill="${C.ink}" stroke="${C.goldHi}" stroke-width="1.2"/>
  <path d="${star5(0, 0.5, 8)}" fill="${C.goldHi}"/>
  <circle cy="0.8" r="2.1" fill="${C.lapis}"/>
</g>
<text x="320" y="61" class="f-NS" font-weight="600" font-size="24" letter-spacing="4" fill="#fbf1e2">洛墨</text>
<text x="392" y="60" class="f-CGI" font-weight="500" font-size="18" fill="#f3d9c6" opacity=".8">Luomo</text>

${lines.join('\n')}
<g class="cur"><g class="bob"><path d="M${cx - 7} ${cy - 5}L${cx + 7} ${cy - 5}L${cx} ${cy + 5}Z" fill="${C.goldHi}"/></g></g>

${menuSvg}
${frame(W, H, { opacity: 0.4 })}`;

  return {
    file: 'dialogue.svg',
    w: W,
    h: H,
    title: 'Luomo — introduction',
    desc: LINES.join(' '),
    defs,
    css,
    body,
  };
}

// ───────────────────────────────── choices (each one is a link) ─────────────────────────────────
const CHOICES = [
  ['推开主页的门', 'luomo.moe'],
  ['翻开旅行日记', 'march7th.cn'],
  ['确认列车运行状态', 'status.luomo.moe'],
  ['寄一封信到 X', '@luomo712'],
];

export function choices() {
  const H = 76;
  return CHOICES.map(([label, url], i) => {
    const on = i === 0;
    const x = 180, w = W - 360, y = 10, h = H - 20;
    const defs = `
<linearGradient id="fill" x1="0" x2="1"><stop offset="0" stop-color="${C.ink2}"/><stop offset=".5" stop-color="${on ? '#2a2f55' : '#1a1f3a'}" /><stop offset="1" stop-color="${C.ink2}"/></linearGradient>
<linearGradient id="sheen" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="${C.goldHi}" stop-opacity=".22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="bar"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/></clipPath>`;
    const css = on
      ? `.sheen{animation:sweep 4.5s ease-in-out ${1 + i * 0.4}s infinite}@keyframes sweep{0%{transform:translateX(-260px)}45%,100%{transform:translateX(${w + 40}px)}}`
      : '';
    const body = `
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="url(#fill)" stroke="${C.gold}" stroke-opacity="${on ? 0.85 : 0.38}" stroke-width="${on ? 1.4 : 1}"/>
${on ? `<g clip-path="url(#bar)"><rect class="sheen" x="${x}" y="${y}" width="220" height="${h}" fill="url(#sheen)"/></g>` : ''}
<path d="M${x + 34} ${y + h / 2 - 6}L${x + 40} ${y + h / 2}L${x + 34} ${y + h / 2 + 6}L${x + 28} ${y + h / 2}Z" fill="${on ? C.goldHi : C.goldDim}"/>
<text x="${W / 2}" y="${y + h / 2 + 8.5}" text-anchor="middle" class="f-NS" font-weight="${on ? 600 : 500}" font-size="23" letter-spacing="3" fill="${on ? '#fbf3e2' : C.ivoryDim}">${esc(label)}</text>
<text x="${x + w - 34}" y="${y + h / 2 + 4.5}" text-anchor="end" class="f-JB" font-size="12.5" letter-spacing="1" fill="${on ? C.gold : C.goldDim}">${esc(url)}</text>`;
    return { file: `choice-${i + 1}.svg`, w: W, h: H, title: label, desc: `${label} — ${url}`, defs, css, body };
  });
}
export * from './scenes-more.mjs';
