// Chapter headers, project cards, garage and footer.
import { C, esc, sparkle, star5, frame, panelDefs, r2 } from './lib.mjs';

const W = 1200;
export const GOLD5 = '#f0c865';
export const PURPLE4 = '#b996f6';

// ───────────────────────────────── chapter headers ─────────────────────────────────
const CHAPTERS = [
  ['I', '旅途手记', 'Travelogue', 'compass'],
  ['II', '开拓记录', 'Trailblaze Record', 'ticket'],
  ['III', '圆环之理', 'Law of Cycles', 'gem'],
];

function motif(kind, x, y) {
  if (kind === 'compass') return `${sparkle(x, y, 11, C.goldHi)}`;
  if (kind === 'ticket')
    return `<g transform="translate(${x} ${y})" fill="${C.ink2}" stroke="${C.goldHi}" stroke-width="1.1"><path d="M-16 -8H16V-3A3 3 0 0 0 16 3V8H-16V3A3 3 0 0 0 -16 -3Z"/><path d="M5 -8V8" stroke-dasharray="2 2"/></g>`;
  // a soul gem: an egg-shaped stone under a small crown setting
  return `<g transform="translate(${x} ${y})"><path d="M-6 -11L-3 -15L0 -11L3 -15L6 -11" fill="none" stroke="${C.goldHi}" stroke-width="1"/><ellipse cy="1" rx="8" ry="11" fill="${C.pink}" opacity=".92"/><ellipse cx="-2.5" cy="-3" rx="2.4" ry="4" fill="#fff" opacity=".55"/><ellipse cy="1" rx="8" ry="11" fill="none" stroke="${C.goldHi}" stroke-width="1"/></g>`;
}

export function chapters() {
  const H = 150;
  return CHAPTERS.map(([num, cn, en, kind], i) => {
    const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<text x="${W / 2}" y="46" text-anchor="middle" class="f-JB" font-size="11" letter-spacing="6" fill="${C.goldDim}">CHAPTER ${num}</text>
<text x="${W / 2}" y="90" text-anchor="middle"><tspan class="f-NS" font-weight="600" font-size="31" letter-spacing="6" fill="${C.ivory}">${cn}</tspan><tspan dx="18" class="f-CGI" font-weight="500" font-size="28" fill="${C.gold}">${en}</tspan></text>
<g stroke="${C.gold}" stroke-opacity=".55" stroke-width=".8"><line x1="330" y1="116" x2="574" y2="116"/><line x1="626" y1="116" x2="870" y2="116"/></g>
<circle cx="330" cy="116" r="2" fill="${C.gold}"/><circle cx="870" cy="116" r="2" fill="${C.gold}"/>
${motif(kind, W / 2, 116)}
${frame(W, H, { opacity: 0.35, inset: 10 })}`;
    return {
      file: `chapter-${i + 1}.svg`,
      w: W,
      h: H,
      title: `Chapter ${num} — ${en}`,
      desc: `${cn} · ${en}`,
      defs: panelDefs('bg', { fx: 0.5, fy: 0, glow: '#1a2041' }),
      body,
    };
  });
}

// ───────────────────────────────── project cards ─────────────────────────────────
const icons = {
  moonGate: (x, y) => `<g transform="translate(${x} ${y})" fill="none" stroke="${C.gold}" stroke-width="1.3">
<path d="M-46 60V-10A46 46 0 0 1 46 -10V60"/><path d="M-34 60V-6A34 34 0 0 1 34 -6V60" stroke-opacity=".45"/>
<path d="M8 -30A22 22 0 1 0 24 4A17 17 0 1 1 8 -30Z" fill="${C.goldHi}" fill-opacity=".88" stroke="none"/>
<path d="M-62 60H62" stroke-opacity=".6"/><path d="M-20 60L-14 48H14L20 60" stroke-opacity=".4"/></g>`,
  gauge: (x, y) => {
    const ticks = [];
    for (let i = 0; i <= 12; i++) {
      const a = ((-210 + i * 20) * Math.PI) / 180;
      const r1 = i % 3 ? 48 : 42;
      ticks.push(
        `<line x1="${r2(Math.cos(a) * r1)}" y1="${r2(Math.sin(a) * r1)}" x2="${r2(Math.cos(a) * 54)}" y2="${r2(Math.sin(a) * 54)}"${
          i > 9 ? ` stroke="${C.crimson}"` : ''
        }/>`
      );
    }
    return `<g transform="translate(${x} ${y})" fill="none" stroke="${C.gold}" stroke-width="1.3">
<path d="M-50.2 29A58 58 0 1 1 50.2 29" stroke-opacity=".45"/>${ticks.join('')}
<g class="needle"><line x1="0" y1="0" x2="40" y2="0" stroke="${C.goldHi}" stroke-width="2" stroke-linecap="round"/></g><circle r="5" fill="${C.ink}" stroke="${C.goldHi}"/></g>`;
  },
  nodes: (x, y) => {
    const p = [[-42, -20], [0, -46], [40, -14], [24, 36], [-30, 32], [0, 0]];
    const e = [[0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [0, 1], [1, 2], [2, 3], [3, 4], [4, 0]];
    return `<g transform="translate(${x} ${y})"><g stroke="${C.gold}" stroke-width="1.1" stroke-opacity=".55">${e
      .map(([a, b]) => `<line x1="${p[a][0]}" y1="${p[a][1]}" x2="${p[b][0]}" y2="${p[b][1]}"/>`)
      .join('')}</g>${p
      .map(([a, b], i) => `<circle cx="${a}" cy="${b}" r="${i === 5 ? 7 : 4}" fill="${i === 5 ? C.goldHi : C.ink}" stroke="${C.goldHi}" stroke-width="1.2"/>`)
      .join('')}</g>`;
  },
  chest: (x, y) => `<g transform="translate(${x} ${y})" fill="none" stroke="${C.gold}" stroke-width="1.3">
<rect x="-48" y="-32" width="96" height="70" rx="3"/><path d="M-48 -6H48"/><path d="M-48 -20H48" stroke-opacity=".3"/><path d="M-48 14H48M-48 26H48" stroke-opacity=".15"/>
<rect x="-7" y="-13" width="14" height="18" rx="1.5" fill="${C.goldHi}" fill-opacity=".9" stroke="none"/></g>`,
  terminal: (x, y) => `<g transform="translate(${x} ${y})" fill="none" stroke="${C.gold}" stroke-width="1.3">
<rect x="-54" y="-40" width="108" height="80" rx="7"/><path d="M-54 -26H54" stroke-opacity=".45"/>
<circle cx="-44" cy="-33" r="2.2" fill="${C.gold}"/><circle cx="-36" cy="-33" r="2.2" fill="${C.gold}" fill-opacity=".5"/>
<path d="M-36 -6L-22 4L-36 14" stroke="${C.goldHi}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<rect class="caret" x="-14" y="11" width="16" height="4" fill="${C.goldHi}" stroke="none"/></g>`,
  loupe: (x, y) => `<g transform="translate(${x} ${y})" fill="none" stroke="${C.gold}" stroke-width="1.3">
<circle cx="-8" cy="-8" r="36"/><circle cx="-8" cy="-8" r="29" stroke-opacity=".4"/>
<path d="M18 18L46 46" stroke-width="7" stroke-linecap="round" stroke="${C.goldDim}"/><path d="M18 18L46 46" stroke="${C.goldHi}"/>
<path d="M-8 6C-26 -6 -24 -22 -15 -23C-11.5 -23.5 -9.2 -21 -8 -18.4C-6.8 -21 -4.5 -23.5 -1 -23C8 -22 10 -6 -8 6Z" fill="${C.pink}" fill-opacity=".85" stroke="none"/>
<path d="M-30 -26A28 28 0 0 1 -15 -35" stroke="#fff" stroke-opacity=".5"/></g>`,
};

const PROJECTS = [
  ['luomo-home', 'Luomo Home', '云端主页 · 一扇通往月面的门', ['A dreamy cloud gateway with Live2D', 'companions and a service constellation.'], ['TypeScript', 'Next.js', 'Live2D'], 5, 'moonGate'],
  ['luomocore', 'LuomoCore', '个人云运维驾驶舱', ['Status, incidents, reports and', 'integrations in one quiet cockpit.'], ['Python', 'FastAPI', 'Ops'], 5, 'gauge'],
  ['luomoapi-hub', 'LuomoAPI Hub', '自托管 API 目录与安全网关', ['An API catalog, a key workflow and', 'an SSRF-hardened public gateway.'], ['Python', 'FastAPI', 'Gateway'], 4, 'nodes'],
  ['luomofile-hub', 'LuomoFile Hub', '私有优先的文件中枢', ['Local, S3-compatible and routed', 'storage — private by default.'], ['Python', 'S3', 'Storage'], 4, 'chest'],
  ['luomoterminal', 'LuomoTerminal', '浏览器里的运维桥', ['SSH, SFTP, FTPS and project', 'actions, straight from the browser.'], ['Python', 'SSH', 'Bridge'], 4, 'terminal'],
  ['fog-harbor-archive', 'Fog Harbor Archive', '雾港档案 · 沉浸式悬疑解谜', ['Rebuild the timeline from tapes,', 'photographs and a chain of evidence.'], ['TypeScript', 'Next.js', 'Mystery'], 4, 'loupe'],
];

const ROMAN = ['II', 'III', 'IV', 'V', 'VI', 'VII'];

export function projects() {
  const w = 600, H = 300;
  return PROJECTS.map(([slug, name, cn, en, tags, rarity, icon], i) => {
    const tint = rarity === 5 ? GOLD5 : PURPLE4;
    const stars = [...Array(rarity)].map((_, k) => `<path d="${star5(w - 44 - k * 17, 46, 6.5)}" fill="${tint}"/>`).join('');
    let tx = 38;
    const tagSvg = tags
      .map((t) => {
        const tw = t.length * 7.2 + 22;
        const s = `<rect x="${tx}" y="236" width="${r2(tw)}" height="24" rx="12" fill="none" stroke="${C.gold}" stroke-opacity=".4"/><text x="${r2(
          tx + tw / 2
        )}" y="252" text-anchor="middle" class="f-JB" font-size="11.5" fill="${C.ivoryDim}">${esc(t)}</text>`;
        tx += tw + 8;
        return s;
      })
      .join('');
    const defs = `<radialGradient id="glow" cx="1" cy="0" r="1.1"><stop offset="0" stop-color="${tint}" stop-opacity=".2"/><stop offset=".5" stop-color="${tint}" stop-opacity="0"/></radialGradient><linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.ink3}"/><stop offset="1" stop-color="${C.ink}"/></linearGradient>`;
    const css = `.needle{animation:rev 6s ease-in-out infinite}@keyframes rev{0%,100%{transform:rotate(-200deg)}40%{transform:rotate(-12deg)}55%{transform:rotate(-24deg)}}
.caret{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}`;
    const body = `
<rect width="${w}" height="${H}" rx="18" fill="url(#bg)"/><rect width="${w}" height="${H}" rx="18" fill="url(#glow)"/>
<text x="38" y="51" class="f-JB" font-size="11" letter-spacing="3.5" fill="${C.goldDim}">No. ${ROMAN[i]}</text>
${stars}
${icons[icon](486, 160)}
<text x="36" y="112" class="f-CGI" font-weight="600" font-size="40" fill="${C.ivory}">${esc(name)}</text>
<text x="38" y="146" class="f-NS" font-weight="500" font-size="17" letter-spacing="1.5" fill="${C.gold}">${esc(cn)}</text>
<text class="f-CG" font-weight="500" font-size="18" fill="${C.ivoryDim}"><tspan x="38" y="184">${esc(en[0])}</tspan><tspan x="38" y="208">${esc(en[1])}</tspan></text>
${tagSvg}
${frame(w, H, { opacity: 0.45, inset: 10, rx: 16 })}`;
    return { file: `projects/${slug}.svg`, w, h: H, title: name, desc: `${cn}. ${en.join(' ')}`, defs, css, body };
  });
}

// ───────────────────────────────── featured: Amahane Hikari ─────────────────────────────────
export function featured() {
  const H = 340;
  const cx = 200, cy = 170;
  const flake = [...Array(6)]
    .map((_, k) => `<g transform="rotate(${k * 60})"><line y1="0" y2="-30"/><path d="M0 -17L-6 -24M0 -17L6 -24M0 -8L-4 -13M0 -8L4 -13"/></g>`)
    .join('');
  const defs = `
<radialGradient id="bg" cx=".17" cy=".5" r="1"><stop offset="0" stop-color="#2a2f5c"/><stop offset=".5" stop-color="${C.ink2}"/><stop offset="1" stop-color="${C.ink}"/></radialGradient>
<linearGradient id="shine" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="${C.goldHi}" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="card"><rect width="${W}" height="${H}" rx="20"/></clipPath>`;
  const css = `.ring{transform-origin:${cx}px ${cy}px;animation:spin 90s linear infinite}.ring2{transform-origin:${cx}px ${cy}px;animation:spin 60s linear infinite reverse}@keyframes spin{to{transform:rotate(360deg)}}
.shine{animation:sweep 7s ease-in-out 1.5s infinite}@keyframes sweep{0%{transform:translateX(-400px) skewX(-20deg)}40%,100%{transform:translateX(${W + 200}px) skewX(-20deg)}}
.fall{animation:snow 9s linear infinite}@keyframes snow{0%{transform:translateY(-20px);opacity:0}15%{opacity:.9}100%{transform:translateY(170px);opacity:0}}`;
  const snow = [...Array(16)]
    .map((_, k) => {
      const x = 50 + ((k * 97) % 310);
      const y = 30 + ((k * 53) % 120);
      return `<circle cx="${x}" cy="${y}" r="${1 + (k % 3) * 0.5}" fill="#fff" class="fall" style="animation-delay:-${(k * 0.7).toFixed(1)}s;animation-duration:${8 + (k % 4)}s"/>`;
    })
    .join('');
  let tx = 420;
  const tags = ['TypeScript', 'WebGL', 'Live2D Cubism', 'Codex Skill', 'MIT']
    .map((t) => {
      const tw = t.length * 7.4 + 24;
      const s = `<rect x="${r2(tx)}" y="266" width="${r2(tw)}" height="26" rx="13" fill="none" stroke="${C.gold}" stroke-opacity=".45"/><text x="${r2(
        tx + tw / 2
      )}" y="283.5" text-anchor="middle" class="f-JB" font-size="12" fill="${C.ivoryDim}">${t}</text>`;
      tx += tw + 9;
      return s;
    })
    .join('');
  const ringStars = [...Array(12)]
    .map((_, k) => `<path d="${star5(cx + Math.cos((k * Math.PI) / 6) * 118, cy + Math.sin((k * Math.PI) / 6) * 118, 3)}" fill="${C.goldHi}" stroke="none" opacity=".6"/>`)
    .join('');
  const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<g clip-path="url(#card)"><rect class="shine" x="0" y="0" width="160" height="${H}" fill="url(#shine)"/>${snow}</g>

<g fill="none" stroke="${C.gold}">
  <g class="ring"><circle cx="${cx}" cy="${cy}" r="118" stroke-opacity=".25" stroke-dasharray="1 6"/>${ringStars}</g>
  <g class="ring2"><circle cx="${cx}" cy="${cy}" r="96" stroke-opacity=".4" stroke-dasharray="40 8 2 8"/></g>
  <circle cx="${cx}" cy="${cy}" r="74" stroke-opacity=".6"/>
</g>
<path d="M${cx + 14} ${cy - 54}A56 56 0 1 0 ${cx + 50} ${cy + 22}A44 44 0 1 1 ${cx + 14} ${cy - 54}Z" fill="${C.goldHi}" opacity=".92"/>
<g transform="translate(${cx - 12} ${cy + 2})" fill="none" stroke="#f6f1ff" stroke-width="1.4" stroke-linecap="round" opacity=".95">${flake}</g>

<text x="420" y="66" class="f-JB" font-size="11.5" letter-spacing="4.5" fill="${C.gold}">No. I · SIGNATURE WORK</text>
${[...Array(5)].map((_, k) => `<path d="${star5(W - 60 - k * 20, 61, 7.5)}" fill="${GOLD5}"/>`).join('')}
<text x="416" y="138" class="f-CGI" font-weight="600" font-size="62" fill="${C.ivory}">Amahane Hikari</text>
<text x="420" y="178" class="f-CG" font-weight="600" font-size="19" letter-spacing="9" fill="${C.gold}">LIVE2D · MOON &amp; SNOW</text>
<text x="420" y="220" class="f-NS" font-weight="500" font-size="18" letter-spacing="1" fill="${C.ivoryDim}">AI 主导制作的月雪主题 Live2D 角色 · 网页查看器与制作 Skill</text>
<text x="420" y="248" class="f-CGI" font-weight="500" font-size="19" fill="${C.mute}">AI-led Live2D creation with OpenAI Codex — code, tested tools and a reusable production skill.</text>
${tags}
${frame(W, H, { opacity: 0.55 })}`;
  return {
    file: 'projects/amahane-hikari-live2d.svg',
    w: W,
    h: H,
    title: 'Amahane Hikari · Live2D',
    desc: 'Signature work: an AI-led Live2D character with a TypeScript/WebGL viewer and reusable tooling.',
    defs,
    css,
    body,
  };
}

// ───────────────────────────────── garage: the toolkit as performance-class plates ─────────────────────────────────
const PI = { D: '#45c0e8', C: '#f2d64b', B: '#f5a03a', A: '#e8504a', S1: '#a65fd6', S2: '#3d7ff0' };
const GARAGE = [
  ['Python', 'S2', 951, '主力引擎'],
  ['TypeScript', 'S2', 924, '前端与工具链'],
  ['FastAPI', 'S1', 880, '服务骨架'],
  ['Next.js', 'S1', 846, '门户与展示'],
  ['Docker', 'A', 792, '部署容器'],
  ['Linux', 'A', 780, '日常座驾'],
  ['Cloudflare', 'A', 754, '边缘与隧道'],
  ['Nginx', 'B', 688, '网关与反代'],
];

export function garage() {
  const H = 330;
  const cells = GARAGE.map(([name, cls, pi, role], i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 56 + col * 274, y = 140 + row * 88;
    const light = ['D', 'C', 'B'].includes(cls);
    return `<g transform="translate(${x} ${y})">
<rect width="40" height="30" rx="4" fill="${PI[cls]}"/><text x="20" y="21" text-anchor="middle" class="f-JB" font-weight="800" font-size="${cls.length > 1 ? 14 : 16}" fill="${light ? '#111' : '#fff'}">${cls}</text>
<rect x="38" width="56" height="30" rx="4" fill="#05060b" stroke="${PI[cls]}" stroke-opacity=".7"/><text x="66" y="21" text-anchor="middle" class="f-JB" font-weight="700" font-size="15" fill="#f4f4f4">${pi}</text>
<text x="110" y="15" class="f-CG" font-weight="700" font-size="22" fill="${C.ivory}">${name}</text>
<text x="111" y="37" class="f-NS" font-weight="500" font-size="13.5" letter-spacing="1" fill="${C.mute}">${role}</text>
</g>`;
  }).join('');
  // seven festival wristbands; the last one is gold
  const bands = [...Array(7)]
    .map((_, i) => {
      const gold = i === 6;
      return `<g transform="translate(${W - 74 - (6 - i) * 32} 62) rotate(-8)"><rect x="-12" y="-8" width="24" height="16" rx="4" fill="${gold ? GOLD5 : '#e0457b'}" opacity="${
        gold ? 1 : r2(0.3 + i * 0.09)
      }"/><path d="M-12 -2.5H12M-12 2.5H12" stroke="#000" stroke-opacity=".2"/></g>`;
    })
    .join('');
  const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>
<text x="56" y="62" class="f-JB" font-size="11" letter-spacing="5" fill="${C.goldDim}">GARAGE</text>
<text x="56" y="98"><tspan class="f-NS" font-weight="600" font-size="26" letter-spacing="4" fill="${C.ivory}">车库</tspan><tspan dx="14" class="f-CGI" font-weight="500" font-size="23" fill="${C.gold}">tuned for the long road</tspan></text>
${bands}
<text x="${W - 60}" y="100" text-anchor="end" class="f-JB" font-size="10.5" letter-spacing="2.5" fill="${C.goldDim}">FESTIVAL WRISTBANDS 7 / 7</text>
<line x1="56" y1="116" x2="${W - 56}" y2="116" stroke="${C.gold}" stroke-opacity=".2"/>
${cells}
${frame(W, H, { opacity: 0.45 })}`;
  return {
    file: 'garage.svg',
    w: W,
    h: H,
    title: 'Garage — toolkit',
    desc: GARAGE.map((g) => `${g[0]} (${g[1]} ${g[2]})`).join(', '),
    defs: panelDefs('bg', { fx: 0.9, fy: 0, glow: '#1d1f45' }),
    body,
  };
}

// ───────────────────────────────── footer ─────────────────────────────────
function spiderLily(x, y, s = 1) {
  const petals = [];
  for (let k = 0; k < 6; k++) {
    const a = (k - 2.5) * 28;
    petals.push(`<path transform="rotate(${a})" d="M0 0C-4 -10 -2 -20 6 -24C10 -26 12 -22 8 -20"/>`);
  }
  const stamens = [];
  for (let k = 0; k < 7; k++) {
    const a = ((-90 + (k - 3) * 22) * Math.PI) / 180;
    const ex = Math.cos(a) * 34, ey = Math.sin(a) * 34 - 4;
    stamens.push(
      `<path d="M0 0Q${r2(ex * 0.3)} ${r2(ey * 0.9)} ${r2(ex)} ${r2(ey)}" stroke-width=".8"/><circle cx="${r2(ex)}" cy="${r2(ey)}" r="1.4" fill="${C.crimson}" stroke="none"/>`
    );
  }
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${C.crimson}" stroke-width="1.3" stroke-linecap="round">${petals.join('')}${stamens.join(
    ''
  )}<path d="M0 0V24" stroke="${C.gold}" stroke-opacity=".6"/></g>`;
}

const cube = (x, y, c) =>
  `<g transform="translate(${x} ${y})"><path d="M0 -7L7 -3.5V3.5L0 7L-7 3.5V-3.5Z" fill="${c}" opacity=".9"/><path d="M0 -7L7 -3.5L0 0L-7 -3.5Z" fill="#fff" opacity=".35"/><path d="M0 0V7" stroke="#000" stroke-opacity=".2"/></g>`;

function owl(x, y) {
  return `<g transform="translate(${x} ${y})" fill="none" stroke="#c09257" stroke-width="1.1">
<path d="M0 -26V-14" stroke-opacity=".6"/><circle cy="-12" r="1.8"/>
<path d="M-8 -6L-6 -11L-3 -7.5A9 9 0 0 1 3 -7.5L6 -11L8 -6V4C8 10 4 13 0 13C-4 13 -8 10 -8 4Z" fill="#c09257" fill-opacity=".22"/>
<circle cx="-3.4" cy="-2" r="2.6"/><circle cx="3.4" cy="-2" r="2.6"/><path d="M-1 2L0 4L1 2"/></g>`;
}

export function footer() {
  const H = 330;
  const eq = ['#f4a6c8', '#f6d863', '#78b6f0', '#ec5a5a']
    .map(
      (c, i) =>
        `<rect class="eq" style="animation-delay:-${(i * 0.37).toFixed(2)}s;animation-duration:${(0.9 + i * 0.17).toFixed(2)}s" x="${i * 6}" y="-14" width="3.5" height="14" rx="1.5" fill="${c}"/>`
    )
    .join('');
  const px = 330, pw = 540;
  const ox = W - 92, oy = 236;
  const css = `.eq{transform-box:fill-box;transform-origin:50% 100%;animation:eq 1s ease-in-out infinite}
@keyframes eq{0%,100%{transform:scaleY(.25)}50%{transform:scaleY(1)}}
.play{animation:play 271s linear infinite}@keyframes play{from{transform:translateX(0)}to{transform:translateX(${pw - 80}px)}}
.fill{transform-box:fill-box;transform-origin:0 0;animation:fillw 271s linear infinite}@keyframes fillw{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.sway{transform-origin:${ox}px ${oy - 26}px;animation:sway 5s ease-in-out infinite}@keyframes sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}`;
  const body = `
<rect width="${W}" height="${H}" rx="20" fill="url(#bg)"/>

<rect x="${px}" y="34" width="${pw}" height="74" rx="37" fill="#0b0e1c" stroke="${C.gold}" stroke-opacity=".35"/>
<g transform="translate(${px + 34} 80)">${eq}</g>
<text x="${px + 76}" y="61" class="f-JB" font-size="9.5" letter-spacing="3" fill="${C.goldDim}">NOW PLAYING</text>
${cube(px + 82, 81, '#6aaef0')}${cube(px + 97, 81, '#f2d24b')}
<text x="${px + 114}" y="87"><tspan class="f-NS" font-weight="600" font-size="18" fill="${C.ivory}">星座になれたら</tspan><tspan dx="12" class="f-NS" font-weight="500" font-size="13" fill="${C.mute}">結束バンド</tspan></text>
<g transform="translate(${px + pw - 92} 72)" fill="${C.ivoryDim}"><path d="M-20 -6V6L-29 0Z"/><path d="M-5 -7H-1.5V7H-5ZM1.5 -7H5V7H1.5Z"/><path d="M20 -6V6L29 0Z"/></g>
<rect x="${px + 40}" y="100" width="${pw - 80}" height="1.4" fill="${C.gold}" opacity=".2"/>
<rect class="fill" x="${px + 40}" y="100" width="${pw - 80}" height="1.4" fill="${C.gold}" opacity=".8"/>
<circle class="play" cx="${px + 40}" cy="100.7" r="3" fill="${C.goldHi}"/>

<g stroke="${C.gold}" stroke-opacity=".45" stroke-width=".8"><line x1="160" y1="166" x2="556" y2="166"/><line x1="644" y1="166" x2="1040" y2="166"/></g>
<circle cx="160" cy="166" r="2" fill="${C.gold}"/><circle cx="1040" cy="166" r="2" fill="${C.gold}"/>
${spiderLily(600, 168, 0.85)}

<text x="${W / 2}" y="234" text-anchor="middle" class="f-NS" font-weight="500" font-size="28" letter-spacing="10" fill="${C.ivory}">愿此行，终抵群星。</text>
<text x="${W / 2}" y="270" text-anchor="middle" class="f-CGI" font-weight="500" font-size="21" fill="${C.gold}">May this journey lead us starward.</text>

<g transform="translate(46 302)">
  <text class="f-NS" font-size="12.5" fill="${C.mute}"><tspan>／人</tspan><tspan class="f-JB" dx="2">◕</tspan><tspan dx="18" class="f-JB">◕</tspan><tspan dx="2">人＼</tspan><tspan dx="12">和我签订契约，成为魔法少女吧！—— 下次一定。</tspan></text>
  <path d="M37 -4.5Q40.5 -0.5 44 -4.5Q47.5 -0.5 51 -4.5" fill="none" stroke="${C.mute}" stroke-width="1.1"/>
</g>
<g class="sway">${owl(ox, oy)}</g>
<text x="${W - 46}" y="302" text-anchor="end" class="f-CG" font-weight="600" font-size="12" letter-spacing="4" fill="${C.goldDim}">MMXXVI · LUOMO</text>
${frame(W, H, { opacity: 0.4 })}`;
  return {
    file: 'footer.svg',
    w: W,
    h: H,
    title: 'May this journey lead us starward',
    desc: 'Now playing, a spider lily on the divider and a farewell line.',
    defs: panelDefs('bg', { fx: 0.5, fy: 1, glow: '#1c2246' }),
    css,
    body,
  };
}
