// Vercel Edge Middleware — SSR meta tags + JSON-LD for /parts/[pn] URLs
//
// Problem: parts/index.html is served for every /parts/[PN] via Vercel rewrite.
// JavaScript updates title/meta client-side, but Googlebot often misses it.
// This middleware intercepts before the rewrite, fetches the base HTML,
// injects server-rendered meta tags and Product schema, then returns the
// modified page — so Google sees unique, indexable content for every part number.

export const config = {
  matcher: '/parts/:pn+'
};

// Allow only safe characters that appear in real part numbers
function sanitize(raw) {
  return String(raw).replace(/[^A-Za-z0-9\-_.]/g, '').slice(0, 60);
}

// HTML-escape for attribute values and element content
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Part-number prefix → product category (English label, German label)
const CATEGORIES = [
  [/^S900/i,              'Fire Sleeve S900',          'Feuerschutzschlauch S900'],
  [/^S70/i,               'PTFE Hydraulic Hose',       'PTFE Hydraulikschlauch'],
  [/^S71/i,               'PTFE Hose S710',            'PTFE Schlauch S710'],
  [/^S74/i,               'PTFE Hose S740',            'PTFE Schlauch S740'],
  [/^S75/i,               'PTFE Hose S750',            'PTFE Schlauch S750'],
  [/^S77/i,               'Crimp Collar S777',         'Crimpmuffe S777'],
  [/^S4[0-9]/i,           'AN Fitting (Aluminium)',    'AN Fitting Aluminium'],
  [/^S5[0-9]/i,           'AN Fitting (Steel)',        'AN Fitting Stahl'],
  [/^S7[0-9]/i,           'AN Stainless Fitting',      'AN Edelstahl Fitting'],
  [/^AN8/i,               'Military-Spec AN Fitting',  'Military-Spec AN Fitting'],
  [/^AN9/i,               'Military-Spec AN Adaptor',  'Military-Spec AN Adaptor'],
  [/^CPL/i,               'AN Coupling',               'AN Kupplung'],
  [/^FP-19/i,             'Fire-Proof Fitting',        'Feuersicherer Fitting'],
  [/^536/i,               '536 Push-Fit Fitting',      '536 Push-Fit Fitting'],
  [/^336/i,               '336 Series Fitting',        '336 Fitting'],
  [/^236/i,               '236 Fuel Fitting',          '236 Kraftstoff-Fitting'],
  [/^306/i,               'Metric Adaptor 306',        'Metrischer Adaptor 306'],
  [/^776/i,               'Banjo Fitting 776',         'Banjo Fitting 776'],
  [/^(6001|6645|6690)/i,  'Banjo Fitting',             'Banjo Fitting'],
  [/^50[9][0-9]/i,        'Banjo Fitting',             'Banjo Fitting'],
  [/^(758|759)/i,         'Banjo Fitting',             'Banjo Fitting'],
  [/^(775|992|721)/i,     'Brake Line Fitting',        'Bremsleitung Fitting'],
  [/^(832|837|BN|445|513[0-9]|815|833|834)/i, 'Brake Component', 'Bremsanlage Bauteil'],
  [/^(600-|924)/i,        'Brake Fitting',             'Bremsleitung Fitting'],
  [/^811/i,               '811 Series Fitting',        '811 Fitting'],
  [/^910/i,               '910 Series Fitting',        '910 Fitting'],
  [/^W991/i,              'Hose Clamp W991',           'Schlauchschelle W991'],
];

function getCategory(pn) {
  for (const [re, en, de] of CATEGORIES) {
    if (re.test(pn)) return { en, de };
  }
  return { en: 'AN Hydraulic Fitting', de: 'AN Hydraulik Fitting' };
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);

  // Only intercept /parts/[pn] — not /parts/ itself (which has no sub-segment)
  if (segments.length < 2 || segments[0] !== 'parts') return;

  const rawPn = decodeURIComponent(segments.slice(1).join('/'));
  const pn = sanitize(rawPn);
  if (!pn) return;

  const cat = getCategory(pn);

  // Fetch the base parts page HTML.
  // This fetch does NOT re-trigger the middleware — /parts/ has no pn sub-segment.
  let html;
  try {
    const res = await fetch(new URL('/parts/', url.origin), {
      headers: { accept: 'text/html', 'accept-encoding': 'identity' }
    });
    if (!res.ok) return; // fallback: let Vercel serve without SSR
    html = await res.text();
  } catch {
    return; // network error → serve base page without SSR
  }

  // Build SSR meta values
  const titleText = `${pn} – ${cat.de} kaufen | supAero.de`;
  const descText  = `${pn} ${cat.de} bei supAero bestellen. Hochwertige AN Fittings & Hydraulikkomponenten aus Deutschland. Anfrage & Lieferung innerhalb 24 h.`;
  const canon     = `https://supaero.de/parts/${encodeURIComponent(pn)}`;
  const ogTitle   = `${pn} – ${cat.en} | supAero`;

  // JSON-LD: Product schema — required for Google Product rich results
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${pn} – ${cat.en}`,
    mpn: pn,
    sku: pn,
    description: `${pn} ${cat.de} – Military-Spec AN Fitting von supAero. Auf Anfrage verfügbar.`,
    brand: { '@type': 'Brand', name: 'supAero' },
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      url: canon,
      priceCurrency: 'EUR',
      seller: {
        '@type': 'Organization',
        name: 'supAero – Superb Hydraulics',
        url: 'https://supaero.de'
      }
    }
  });

  // Server-rendered part banner: unique visible content above the hero.
  // Gives Google something specific to this URL beyond just meta tags.
  const banner = [
    '<div class="ssr-pn-banner" style="background:rgba(59,127,232,.08);',
    'border-bottom:1px solid rgba(59,127,232,.2);padding:.6rem 0;">',
    '<div class="container" style="max-width:1200px;margin:0 auto;padding:0 1.5rem;',
    'display:flex;align-items:center;gap:.75rem;font-size:.875rem;">',
    `<code style="font-family:monospace;font-weight:700;color:#60a5fa;font-size:1rem">${esc(pn)}</code>`,
    `<span style="color:#64748b">–</span>`,
    `<span style="color:#94a3b8">${esc(cat.de)}</span>`,
    `<a href="/parts/" style="margin-left:auto;color:#60a5fa;font-size:.8rem;">Alle Teilenummern →</a>`,
    '</div></div>'
  ].join('');

  // Apply all SSR injections
  html = html
    .replace(/<title>[^<]*<\/title>/i,
      `<title>${esc(titleText)}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*">/i,
      `<meta name="description" content="${esc(descText)}">`)
    .replace(/<link\s+rel="canonical"\s+href="[^"]*">/i,
      `<link rel="canonical" href="${canon}">`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*">/i,
      `<meta property="og:title" content="${esc(ogTitle)}">`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*">/i,
      `<meta property="og:url" content="${canon}">`)
    .replace('</head>',
      `<script type="application/ld+json">${schema}</script>\n</head>`)
    .replace('<div class="parts-hero">',
      `${banner}\n<div class="parts-hero">`);

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Cache at CDN edge for 1 h; browser cache 10 min
      'cache-control': 'public, s-maxage=3600, max-age=600',
    },
  });
}
