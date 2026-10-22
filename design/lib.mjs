// Shared design tokens and SVG helpers.
// Zero dependencies: imported both by the local asset build and by the CI card renderer.

export const C = {
  ink: '#090b14',
  ink2: '#0e1224',
  ink3: '#161b33',
  navy: '#1b2246',
  gold: '#d4b26a',
  goldHi: '#f2dda6',
  goldDim: '#8c774b',
  ivory: '#efe7d6',
  ivoryDim: '#b4ac9c',
  mute: '#77738a',
  crimson: '#c3313d',
  lapis: '#8a98e0',
  pink: '#f3a8c6',
};

export const FONT_FILES = {
  CG: 'CormorantGaramond.ttf',
  CGI: 'CormorantGaramond-Italic.ttf',
  NS: 'NotoSerifSC.ttf',
  JB: 'JetBrainsMono.ttf',
  DG: 'DotGothic16.ttf',
};

export const FONT_STYLE = {
  CG: "font-family:'CG',serif",
  CGI: "font-family:'CGI',serif;font-style:italic",
  NS: "font-family:'NS',serif",
  JB: "font-family:'JB',monospace",
  DG: "font-family:'DG',monospace",
};

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const unesc = (s) =>
  s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, '&');

/** Characters that appear inside <text> elements, grouped by the font classes used on or above them. */
export function textChars(svg) {
  const out = new Set();
  for (const m of svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)) {
    const inner = m[1].replace(/<set\b[^>]*\/>/g, '').replace(/<[^>]+>/g, '');
    for (const ch of unesc(inner)) out.add(ch);
  }
  return [...out].join('');
}

/**
 * Walks the markup and returns [font key, weight, chars] for every face that renders text.
 * Font comes from the nearest .f-XX class, weight from the nearest font-weight attribute (default 400).
 */
export function usedFaces(svg) {
  const faces = new Map();
  const stack = [{ font: null, weight: 400, text: false }];
  for (const [tok] of svg.matchAll(/<[^>]+>|[^<]+/g)) {
    if (tok[0] === '<') {
      if (tok[1] === '/') stack.pop();
      else if (!tok.endsWith('/>') && !tok.startsWith('<!') && !tok.startsWith('<?')) {
        const top = stack[stack.length - 1];
        const font = (tok.match(/\bclass="[^"]*\bf-(CG|CGI|NS|JB|DG)\b/) || [])[1] || top.font;
        const weight = Number((tok.match(/font-weight="(\d+)"/) || [])[1] || top.weight);
        stack.push({ font, weight, text: top.text || /^<(text|tspan)\b/.test(tok) });
      }
      continue;
    }
    const top = stack[stack.length - 1];
    if (!top.text || !top.font || !tok.trim()) continue;
    const key = `${top.font}:${top.weight}`;
    faces.set(key, (faces.get(key) || '') + unesc(tok));
  }
  return [...faces].map(([k, chars]) => {
    const [font, w] = k.split(':');
    return [font, Number(w), [...new Set(chars)].join('')];
  });
}

export function fontFaceCss(name, weight, base64) {
  return `@font-face{font-family:'${name}';src:url(data:font/woff2;base64,${base64}) format('woff2');font-weight:${weight};${
    name === 'CGI' ? 'font-style:italic;' : ''
  }}`;
}

export const fontClassCss = () =>
  Object.entries(FONT_STYLE)
    .map(([k, v]) => `.f-${k}{${v}}`)
    .join('');

/** Deterministic PRNG so star fields are stable between builds. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const r2 = (n) => Math.round(n * 100) / 100;

/** A field of small stars; a fraction of them twinkle. */
export function starField({ seed, w, h, count, twinkle = 0.25, avoid = () => false, maxR = 1.4 }) {
  const rand = rng(seed);
  const out = [];
  let made = 0;
  let guard = 0;
  while (made < count && guard++ < count * 20) {
    const x = rand() * w;
    const y = rand() * h;
    if (avoid(x, y)) continue;
    const r = 0.35 + Math.pow(rand(), 3) * maxR;
    const o = 0.25 + rand() * 0.6;
    const tw = rand() < twinkle;
    const d = (rand() * 6).toFixed(2);
    const dur = (3 + rand() * 5).toFixed(2);
    out.push(
      `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${rand() < 0.18 ? C.goldHi : C.ivory}" opacity="${r2(o)}"${
        tw ? ` class="tw" style="animation-duration:${dur}s;animation-delay:-${d}s"` : ''
      }/>`
    );
    made++;
  }
  return out.join('');
}

/** Four-point sparkle path centred on (x, y). */
export const sparkle = (x, y, s, fill = C.goldHi, extra = '') =>
  `<path d="M${x} ${y - s}C${x + s * 0.12} ${y - s * 0.12} ${x + s * 0.12} ${y - s * 0.12} ${x + s} ${y}C${x + s * 0.12} ${
    y + s * 0.12
  } ${x + s * 0.12} ${y + s * 0.12} ${x} ${y + s}C${x - s * 0.12} ${y + s * 0.12} ${x - s * 0.12} ${y + s * 0.12} ${x - s} ${y}C${
    x - s * 0.12
  } ${y - s * 0.12} ${x - s * 0.12} ${y - s * 0.12} ${x} ${y - s}Z" fill="${fill}" ${extra}/>`;

/** Five-point star path. */
export function star5(cx, cy, R, r = R * 0.42, rot = -90) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = ((rot + i * 36) * Math.PI) / 180;
    const rr = i % 2 ? r : R;
    pts.push(`${r2(cx + Math.cos(a) * rr)} ${r2(cy + Math.sin(a) * rr)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** Engraved double frame with small diamond corners. */
export function frame(w, h, { inset = 12, rx = 18, opacity = 0.55 } = {}) {
  const i = inset;
  const j = inset + 6;
  const d = (x, y) => `<path d="M${x} ${y - 4}L${x + 4} ${y}L${x} ${y + 4}L${x - 4} ${y}Z" fill="${C.gold}"/>`;
  return `<g opacity="${opacity}">
<rect x="${i}" y="${i}" width="${w - i * 2}" height="${h - i * 2}" rx="${rx - 6}" fill="none" stroke="${C.gold}" stroke-width="1"/>
<rect x="${j}" y="${j}" width="${w - j * 2}" height="${h - j * 2}" rx="${rx - 10}" fill="none" stroke="${C.gold}" stroke-width="0.5" stroke-opacity="0.6"/>
${d(i + 22, i)}${d(w - i - 22, i)}${d(i + 22, h - i)}${d(w - i - 22, h - i)}
</g>`;
}

/** Common panel background: deep ink with a soft glow from a focal point. */
export function panelDefs(id, { fx = 0.8, fy = 0.1, glow = C.navy } = {}) {
  return `<radialGradient id="${id}" cx="${fx}" cy="${fy}" r="1.1">
<stop offset="0" stop-color="${glow}"/><stop offset="0.55" stop-color="${C.ink2}"/><stop offset="1" stop-color="${C.ink}"/></radialGradient>`;
}

/** Fine film grain, kept very faint. */
export const grainDefs = (id = 'grain') =>
  `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"/></filter>`;

export const baseCss = `
.tw{animation:tw 5s ease-in-out infinite}
@keyframes tw{0%,100%{opacity:.15}50%{opacity:.95}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

/** Wrap a body into a full SVG document with embedded fonts. `fonts` is a list of [key, weight, base64 woff2]. */
export function svgDoc({ w, h, title, desc, defs = '', css = '', body, fonts = [] }) {
  const faces = fonts.map(([k, wt, b64]) => fontFaceCss(k, wt, b64)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="t d">
<title id="t">${esc(title)}</title>
<desc id="d">${esc(desc)}</desc>
<defs>${defs}</defs>
<style>${faces}${fontClassCss()}${baseCss}${css}</style>
${body}
</svg>
`;
}

// Labels used by the CI-rendered cards. The build pre-subsets fonts to exactly these
// characters (plus printable ASCII) so CI needs no font tooling.
export const DYNAMIC_CJK =
  '开拓记录等级均衡获得星标提交合并请求议题公开仓库同伴旅程第天语言构成圆环之理每一次贡献都被温柔地回收再出发自年月日至今，。';
// Static weights pre-built for the CI cards.
export const DYNAMIC_FACES = [['CG', 600], ['CG', 700], ['NS', 400], ['NS', 500], ['JB', 400]];
export const ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join('') + '·—′″★✦';
