'use strict';

// ─── Supabase Config ───────────────────────────────────────────
const SUPABASE_URL = 'https://yacwkxstvqvdgiiffwos.supabase.co';
const SUPABASE_KEY = 'sb_publishable_JAGI28ms4nmK_dDoS1BLzA_O8locPZk';

// Supabase client — available once the CDN script loads
let _sb = null;
function getSB() {
  if (!_sb && typeof supabase !== 'undefined') {
    _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return _sb;
}

// ─── Mock fallback (set true while testing without Supabase users) ─
const PORTAL_CONFIG = { mockMode: false };

// ─── Demo Users (mock only) ────────────────────────────────────
const MOCK_USERS = [
  { email: 'demo@supaero.de',     password: 'demo123',  name: 'Demo Kunde' },
  { email: 'kunde@motorsport.de', password: 'kunde123', name: 'Lars Weber' },
];

// ─── Product Catalog ───────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'an3-straight',
    name: 'AN3 Gerade-Verbindung',
    category: 'AN Fittings',
    shortDesc: 'Präzisions-Geradfitting AN3, 7075-T6 Aluminium, MIL-F-18280',
    description: 'Die AN3 Gerade-Verbindung ist aus Luftfahrt-zertifiziertem 7075-T6 Aluminium gefertigt und entspricht vollständig den MIL-F-18280-Normen. Der hart-eloxierte Korrosionsschutz garantiert langfristige Beständigkeit unter extremen Betriebsbedingungen.\n\nDie präzise 37°-Flareverbindung sorgt für eine leckagefreie, vibrationsresistente Verbindung — bewährt in Renn- und Luftfahrtanwendungen weltweit.',
    model: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    badge: 'Bestseller',
    specs: {
      'Gewinde':            'AN3 · 3/8"–24 UNF',
      'Material':           '7075-T6 Aluminium',
      'Oberfläche':         'Hart-Eloxiert',
      'Max. Druck':         '5.000 PSI · 345 bar',
      'Temperaturbereich':  '−55 °C bis +150 °C',
      'Norm':               'MIL-F-18280',
      'Gewicht':            '8 g',
    },
  },
  {
    id: 'an6-90deg',
    name: 'AN6 90° Winkelfitting',
    category: 'AN Fittings',
    shortDesc: 'Kompakter 90°-Winkelfitting AN6, Gold-Eloxiert',
    description: 'Der AN6 90°-Winkelfitting ermöglicht platzsparende Leitungsführung in motorsportlichen Anwendungen. Das kurze Baumaß und die präzise 37°-Flareverbindung machen ihn ideal für Motorraumanwendungen mit begrenztem Bauraum.\n\nGefertigt aus 6061-T6 Aluminium mit Gold-Eloxierung — für optimale Korrosionsbeständigkeit und sofortige Erkennbarkeit im Motorsport-Einsatz.',
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/FlightHelmet/glTF-Binary/FlightHelmet.glb',
    badge: null,
    specs: {
      'Gewinde':            'AN6 · 9/16"–18 UNF',
      'Winkel':             '90°',
      'Material':           '6061-T6 Aluminium',
      'Oberfläche':         'Gold-Eloxiert',
      'Max. Druck':         '4.000 PSI · 276 bar',
      'Temperaturbereich':  '−40 °C bis +135 °C',
      'Gewicht':            '22 g',
    },
  },
  {
    id: 'ptfe-brake-3',
    name: 'PTFE Bremsleitung 3 mm',
    category: 'PTFE Leitungen',
    shortDesc: 'Hochdruck PTFE-Bremsleitung mit 304-Edelstahlgeflecht',
    description: 'Die supAero PTFE-Bremsleitung kombiniert einen nahtlosen PTFE-Innenschlauch mit einem engmaschigen 304-Edelstahlgeflecht. Das Ergebnis: deutlich kürzerer Druckmittelweg und damit präziseres Bremsgefühl — sowohl auf der Rennstrecke als auch im Straßeneinsatz.\n\nAlle Leitungen werden nach DOT- und TÜV-Richtlinien gefertigt und mit hydropneumatischem Drucktest geprüft.',
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
    badge: 'Neu',
    specs: {
      'Innendurchmesser':   '3,0 mm',
      'Außendurchmesser':   '7,5 mm',
      'Geflecht':           '304 Edelstahl',
      'Innenschlauch':      'PTFE (Teflon®)',
      'Max. Druck':         '3.000 PSI · 207 bar',
      'Temperaturbereich':  '−65 °C bis +232 °C',
      'Zertifizierung':     'DOT FMVSS 106 · TÜV',
    },
  },
  {
    id: 'hydraulic-block-an4',
    name: 'Hydraulik-Verteilerblock AN4',
    category: 'Verteiler & Adapter',
    shortDesc: '3-fach Verteilerblock für AN4-Leitungssysteme, schwarz eloxiert',
    description: 'Der Verteilerblock ermöglicht die simultane Anbindung von drei AN4-Leitungen an eine gemeinsame Quelle — ideal für Bremssysteme mit ABS oder mehrstufige Hydraulikkreise.\n\nAus dem Vollen aus 7075-T6 Aluminium gefräst, alle Kanäle mit CNC-Präzision gebohrt und auf Rauheit Ra 0,8 geläppt. Jede Einheit wird mit 150 bar Dichtigkeitstest geprüft.',
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/BoomBox/glTF-Binary/BoomBox.glb',
    badge: null,
    specs: {
      'Anschlüsse':         '3 × AN4 · 7/16"–20 UNF',
      'Material':           '7075-T6 Aluminium',
      'Oberfläche':         'Schwarz-Eloxiert (Typ III)',
      'Prüfdruck':          '150 bar',
      'Maße (L×B×H)':      '48 × 22 × 16 mm',
      'Gewicht':            '34 g',
    },
  },
  {
    id: 'an8-t-piece',
    name: 'AN8 T-Stück',
    category: 'AN Fittings',
    shortDesc: 'T-Verteiler AN8 für Kraftstoff- und Ölsysteme, blau eloxiert',
    description: 'Das supAero AN8 T-Stück ist die erste Wahl für Motoröl- und Kraftstoffsysteme, die eine saubere Verzweigung benötigen. Die symmetrische Konstruktion sorgt für gleichmäßige Strömungsaufteilung ohne Druckabfall.\n\nGefertigt aus 6061-T6 Aluminium, blau eloxiert. Kompatibel mit allen Standard-AN8-Leitungen und Verbindungen nach AMS-DTL-7938.',
    model: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/MetalRoughSpheres/glTF-Binary/MetalRoughSpheres.glb',
    badge: null,
    specs: {
      'Gewinde':            'AN8 · 3/4"–16 UNF',
      'Typ':                'Symmetrisches T-Stück',
      'Material':           '6061-T6 Aluminium',
      'Oberfläche':         'Blau-Eloxiert',
      'Max. Druck':         '3.500 PSI · 241 bar',
      'Norm':               'AMS-DTL-7938',
      'Gewicht':            '45 g',
    },
  },
];

// ─── Auth ──────────────────────────────────────────────────────
function getSession() {
  try { return JSON.parse(localStorage.getItem('sa_portal_session') || 'null'); }
  catch { return null; }
}

function requireAuth() {
  if (!getSession()) { window.location.href = '/portal/login.html'; return false; }
  return true;
}

function redirectIfAuthed() {
  if (getSession()) window.location.href = '/portal/welcome.html';
}

async function portalLogin(email, password) {
  if (PORTAL_CONFIG.mockMode) {
    await new Promise(r => setTimeout(r, 700));
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
    );
    if (user) {
      localStorage.setItem('sa_portal_session', JSON.stringify({ email: user.email, name: user.name }));
      return { ok: true };
    }
    return { ok: false, error: 'E-Mail-Adresse oder Passwort ist nicht korrekt.' };
  }

  const sb = getSB();
  if (!sb) return { ok: false, error: 'Verbindungsfehler. Bitte Seite neu laden.' };

  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    const msg = error.message.includes('Invalid login') || error.message.includes('invalid_grant')
      ? 'E-Mail-Adresse oder Passwort ist nicht korrekt.'
      : error.message;
    return { ok: false, error: msg };
  }

  const name = data.user.user_metadata?.name || data.user.email.split('@')[0];
  localStorage.setItem('sa_portal_session', JSON.stringify({ email: data.user.email, name }));
  return { ok: true };
}

async function portalLogout() {
  const sb = getSB();
  if (sb) await sb.auth.signOut();
  localStorage.removeItem('sa_portal_session');
  window.location.href = '/portal/login.html';
}

function getProduct(id) { return PRODUCTS.find(p => p.id === id) || null; }

// ─── Portal Nav ────────────────────────────────────────────────
function initPortalNav(activePage) {
  const el = document.getElementById('portal-nav');
  if (!el) return;
  const session = getSession();
  el.innerHTML = `
    <div class="pnav-inner">
      <a href="/portal/welcome.html" class="pnav-logo">
        <img src="/Logos/supAero-WortLogo-B.webp" alt="supAero" height="24">
        <span class="pnav-tag">Portal</span>
      </a>
      <nav class="pnav-links">
        <a href="/portal/welcome.html" class="${activePage === 'welcome' ? 'active' : ''}">Übersicht</a>
        <a href="/portal/models.html"  class="${activePage === 'models'  ? 'active' : ''}">3D-Modelle</a>
      </nav>
      <div class="pnav-right">
        <a href="/" class="pnav-back-site">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M8 2L4 6.5L8 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          supaero.de
        </a>
        <span class="pnav-divider"></span>
        <span class="pnav-name">${session?.name || session?.email || ''}</span>
        <button onclick="portalLogout()" class="pnav-logout-btn">Abmelden</button>
      </div>
    </div>
  `;
}
