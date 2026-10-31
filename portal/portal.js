'use strict';

// ─── Config ────────────────────────────────────────────────────
const SUPABASE_URL       = 'https://xsilgbtakvkhkpkltgwj.supabase.co';
const SUPABASE_KEY       = 'sb_publishable_FFIgE8oqaH4pE_0IOSDqhQ_V4wdfJv5';
const AGREEMENT_VERSION  = '2026-v1';
const ADMIN_EMAIL        = 'info@supaero.de';

// ─── Supabase Client ───────────────────────────────────────────
let _sb = null;
try {
  const _lib = (typeof supabase !== 'undefined' && supabase)
             || (typeof window !== 'undefined' && window.supabase);
  if (_lib && typeof _lib.createClient === 'function') {
    _sb = _lib.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (e) { console.error('[portal] Supabase init failed:', e); }
function getSB() { return _sb; }

// ─── Auth ──────────────────────────────────────────────────────
async function getAuthUser() {
  const sb = getSB();
  if (!sb) return null;
  try {
    const { data: { session } } = await sb.auth.getSession();
    return session?.user || null;
  } catch { return null; }
}

async function requireAuth() {
  const user = await getAuthUser();
  if (!user) { window.location.href = '/portal/login.html'; return null; }
  return user;
}

async function requireAuthAndAgreement() {
  const user = await requireAuth();
  if (!user) return null;
  const agreed = await hasAgreement(user.id);
  if (!agreed) { window.location.href = '/portal/agreement.html'; return null; }
  return user;
}

async function redirectIfAuthed() {
  const user = await getAuthUser();
  if (!user) return;
  const agreed = await hasAgreement(user.id);
  window.location.href = agreed ? '/portal/models.html' : '/portal/agreement.html';
}

async function portalLogin(email, password) {
  const sb = getSB();
  if (!sb) return { ok: false, error: 'Verbindungsfehler. Bitte Seite neu laden.' };
  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) {
    const msg = (error.message.includes('Invalid login') || error.message.includes('invalid_grant'))
      ? 'E-Mail-Adresse oder Passwort ist nicht korrekt.'
      : error.message;
    return { ok: false, error: msg };
  }
  return { ok: true, user: data.user };
}

async function portalLogout() {
  const sb = getSB();
  if (sb) await sb.auth.signOut();
  window.location.href = '/portal/login.html';
}

function isAdmin(user) {
  return user?.email === ADMIN_EMAIL || user?.user_metadata?.is_admin === true;
}

// ─── Agreement ─────────────────────────────────────────────────
async function hasAgreement(userId) {
  const sb = getSB();
  if (!sb) return false;
  try {
    const { data } = await sb
      .from('agreements')
      .select('id')
      .eq('user_id', userId)
      .eq('version', AGREEMENT_VERSION)
      .maybeSingle();
    return !!data;
  } catch { return false; }
}

async function acceptAgreement(userId) {
  const sb = getSB();
  if (!sb) return false;
  const { error } = await sb.from('agreements').insert({
    user_id: userId,
    version: AGREEMENT_VERSION,
  });
  return !error;
}

// ─── Products ──────────────────────────────────────────────────
async function loadProducts() {
  const sb = getSB();
  if (!sb) return [];
  const { data, error } = await sb
    .from('products')
    .select('*')
    .order('category')
    .order('sort_order')
    .order('name');
  if (error) { console.error('[portal] loadProducts:', error); return []; }
  return data || [];
}

function groupByCategory(products) {
  const map = {};
  for (const p of products) {
    if (!map[p.category]) map[p.category] = [];
    map[p.category].push(p);
  }
  return map;
}

// ─── Admin: Product CRUD ───────────────────────────────────────
async function adminSaveProduct(product) {
  const sb = getSB();
  const { error } = await sb.from('products').upsert(product, { onConflict: 'id' });
  return !error ? { ok: true } : { ok: false, error: error.message };
}

async function adminDeleteProduct(id) {
  const sb = getSB();
  const { error } = await sb.from('products').delete().eq('id', id);
  return !error ? { ok: true } : { ok: false, error: error.message };
}

async function adminBulkInsert(rows) {
  const sb = getSB();
  const { error } = await sb.from('products').upsert(rows, { onConflict: 'id' });
  return !error ? { ok: true } : { ok: false, error: error.message };
}

// ─── CSV Parser ────────────────────────────────────────────────
function parseProductCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return { rows: [], error: 'CSV ist leer oder hat keine Daten.' };

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/[^a-z_]/g, '_'));
  const required = ['id', 'category', 'name'];
  const missing = required.filter(r => !headers.includes(r));
  if (missing.length) return { rows: [], error: `Fehlende Spalten: ${missing.join(', ')}` };

  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
    if (!obj.id || !obj.category || !obj.name) continue;
    rows.push({
      id:            obj.id,
      category:      obj.category,
      name:          obj.name,
      model_url:     obj.model_url || obj.glb_url || null,
      download_url:  obj.download_url || obj.file_url || null,
      download_name: obj.download_name || obj.filename || null,
      sort_order:    parseInt(obj.sort_order || '0', 10) || 0,
    });
  }
  return { rows, error: null };
}

// ─── Session Timeout Bar ───────────────────────────────────────
function initSessionTimeout(user, minutes) {
  if (typeof minutes === 'undefined') minutes = 30;
  const email = user?.email || '';

  const style = document.createElement('style');
  style.textContent = `
    #session-bar { position:fixed;top:0;left:0;right:0;height:30px;background:#fff;
      color:rgba(10,20,40,.55);font-family:'Inter',sans-serif;font-size:11.5px;
      z-index:9999;display:flex;align-items:center;justify-content:center;padding:0 20px;gap:8px;
      border-bottom:1px solid rgba(10,20,40,.08);transition:background .4s; }
    #session-bar.warn   { background:#fffbeb; }
    #session-bar.urgent { background:#fff1f2;animation:sb-blink .9s ease-in-out infinite; }
    @keyframes sb-blink { 0%,100%{opacity:1}50%{opacity:.82} }
    .sb-dot  { width:6px;height:6px;border-radius:50%;background:#22c55e;flex-shrink:0; }
    #session-bar.warn   .sb-dot { background:#f59e0b; }
    #session-bar.urgent .sb-dot { background:#ef4444; }
    .sb-sep  { opacity:.3; }
    .sb-email { opacity:.65;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:220px; }
    .sb-timer { font-variant-numeric:tabular-nums;font-weight:600;color:rgba(10,20,40,.75);
      white-space:nowrap;letter-spacing:.03em;cursor:default; }
    #session-bar.warn   .sb-timer { color:#b45309; }
    #session-bar.urgent .sb-timer { color:#dc2626; }
    #portal-nav { top:30px !important; }
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'session-bar';
  bar.innerHTML = `<span class="sb-dot"></span><span class="sb-email">${email}</span><span class="sb-sep">·</span><span class="sb-timer" id="sb-timer"></span>`;
  document.body.prepend(bar);

  let remaining = minutes * 60;
  const timerEl = document.getElementById('sb-timer');

  function draw() {
    const m = Math.floor(remaining / 60).toString().padStart(2,'0');
    const s = (remaining % 60).toString().padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;
    bar.className = remaining <= 60 ? 'urgent' : remaining <= 300 ? 'warn' : '';
  }
  function reset() { remaining = minutes * 60; }

  ['mousemove','click','keydown','scroll','touchstart'].forEach(ev =>
    document.addEventListener(ev, reset, { passive: true }));

  draw();
  const iv = setInterval(() => { remaining--; draw(); if (remaining <= 0) { clearInterval(iv); portalLogout(); } }, 1000);
}

// ─── Storage: Upload product file ─────────────────────────────
async function uploadProductFile(file, productId) {
  const sb = getSB();
  if (!sb) return { ok: false, error: 'Keine Verbindung' };
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${productId || 'misc'}/${Date.now()}_${safeName}`;
  const { data, error } = await sb.storage.from('product-files').upload(path, file, { upsert: true });
  if (error) return { ok: false, error: error.message };
  const { data: urlData } = sb.storage.from('product-files').getPublicUrl(data.path);
  return { ok: true, url: urlData.publicUrl, name: file.name };
}

// ─── Site Content ──────────────────────────────────────────────
async function loadSiteContent() {
  const sb = getSB();
  if (!sb) return [];
  const { data } = await sb.from('site_content').select('*').order('section').order('sort_order');
  return data || [];
}

async function saveSiteContent(key, value) {
  const sb = getSB();
  if (!sb) return { ok: false, error: 'Keine Verbindung' };
  const { error } = await sb.from('site_content').upsert({ key, value }, { onConflict: 'key' });
  return !error ? { ok: true } : { ok: false, error: error.message };
}

// ─── Portal Nav ────────────────────────────────────────────────
async function initPortalNav(activePage) {
  const el = document.getElementById('portal-nav');
  if (!el) return;
  const user = await getAuthUser();
  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || '';
  const adminLink = user && isAdmin(user)
    ? `<a href="/portal/admin/" class="${activePage === 'admin' ? 'active' : ''}">Admin</a>`
    : '';

  el.innerHTML = `
    <div class="pnav-inner">
      <a href="/portal/models.html" class="pnav-logo">
        <img src="/Logos/supAero-WortLogo-B.webp" alt="supAero" height="24">
        <span class="pnav-tag">Portal</span>
      </a>
      <nav class="pnav-links">
        <a href="/portal/models.html" class="${activePage === 'models' ? 'active' : ''}">CAD-Modelle</a>
        ${adminLink}
      </nav>
      <div class="pnav-right">
        <a href="/" class="pnav-back-site">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M8 2L4 6.5L8 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          supaero.de
        </a>
        <span class="pnav-divider"></span>
        <span class="pnav-name">${name}</span>
        <button onclick="portalLogout()" class="pnav-logout-btn">Abmelden</button>
      </div>
    </div>
  `;
}
