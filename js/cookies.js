/* =============================================
   supAero Cookie Consent
   Stores choice in localStorage under 'sa-consent'
   Values: 'all' | 'essential'
   GA4 is loaded only after 'all' consent.
   ============================================= */

(function () {
  const STORAGE_KEY = 'sa-consent';
  const GA_ID = 'G-N48RWDGSJ8';

  // ── Load GA4 ────────────────────────────────
  function loadGA() {
    if (!GA_ID) return;
    const s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // ── Apply stored choice ──────────────────────
  function applyConsent(choice) {
    localStorage.setItem(STORAGE_KEY, choice);
    if (choice === 'all') loadGA();
  }

  // ── Build banner HTML ────────────────────────
  function buildBanner() {
    const banner = document.createElement('div');
    banner.id = 'sa-cookie-banner';
    banner.innerHTML = `
      <div class="sa-cookie-inner">
        <div class="sa-cookie-text">
          <strong>Cookies &amp; Datenschutz</strong>
          <p>Wir verwenden essentielle Cookies für den Betrieb der Seite und — mit Ihrer Zustimmung — Google Analytics zur Analyse des Datenverkehrs. Keine Weitergabe an Dritte.
          <a href="/pages/privacy.html">Datenschutzerklärung</a></p>
        </div>
        <div class="sa-cookie-actions">
          <button id="sa-cookie-essential" class="sa-btn-secondary">Nur Essentielle</button>
          <button id="sa-cookie-all" class="sa-btn-primary">Alle akzeptieren</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Animate in after a short delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { banner.classList.add('sa-cookie-visible'); });
    });

    document.getElementById('sa-cookie-all').addEventListener('click', () => {
      applyConsent('all');
      hideBanner(banner);
    });
    document.getElementById('sa-cookie-essential').addEventListener('click', () => {
      applyConsent('essential');
      hideBanner(banner);
    });
  }

  function hideBanner(banner) {
    banner.classList.remove('sa-cookie-visible');
    banner.classList.add('sa-cookie-hiding');
    setTimeout(() => banner.remove(), 400);
  }

  // ── Init ─────────────────────────────────────
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'all') {
    loadGA(); // already consented — load silently
  } else if (!stored) {
    // First visit — show banner after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', buildBanner);
    } else {
      buildBanner();
    }
  }
  // stored === 'essential' → do nothing, no banner needed
})();
