/* =============================================
   supAero.de — Main JavaScript
   - i18n language switching
   - GSAP scroll animations
   - Product carousel
   - Hero product angle viewer
   - Custom cursor
   - Smooth scroll (Lenis-style)
   ============================================= */

// ── i18n ──────────────────────────────────────
let currentLang = localStorage.getItem('sa-lang') || 'de';

function applyTranslations(lang) {
  const t = TRANSLATIONS[lang];
  if (!t) return;
  currentLang = lang;
  localStorage.setItem('sa-lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Update active state on lang options
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });

  // Update lang button label
  const langInfo = { en: {flag:'🇬🇧', label:'EN'}, de: {flag:'🇩🇪', label:'DE'}, es: {flag:'🇪🇸', label:'ES'}, it: {flag:'🇮🇹', label:'IT'}, pt: {flag:'🇵🇹', label:'PT'}, zh: {flag:'🇨🇳', label:'ZH'} };
  const btn = document.querySelector('.lang-btn');
  if (btn && langInfo[lang]) {
    btn.querySelector('.flag').textContent = langInfo[lang].flag;
    btn.querySelector('.lang-label').textContent = langInfo[lang].label;
  }

  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

// ── DOM Ready ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Apply saved language
  applyTranslations(currentLang);

  // Language switcher clicks
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
      applyTranslations(opt.dataset.lang);
      // close dropdown
      document.querySelector('.lang-switcher')?.classList.remove('open');
    });
  });

  // Toggle lang dropdown on mobile
  document.querySelector('.lang-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.lang-switcher')?.classList.toggle('open');
  });
  document.addEventListener('click', () => {
    document.querySelector('.lang-switcher')?.classList.remove('open');
  });

  // ── Nav scroll effect ──────────────────────
  const nav = document.getElementById('nav');
  function updateNav() {
    nav?.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile menu ────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  // ── Custom Cursor ──────────────────────────
  const cursor = document.querySelector('.custom-cursor');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (cursor && cursorRing && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Expand on interactive elements
    document.querySelectorAll('a, button, .product-card, .industry-card, .angle-thumb').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursorRing.style.width = '56px';
        cursorRing.style.height = '56px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '10px';
        cursor.style.height = '10px';
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
      });
    });
  } else {
    if (cursor) cursor.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // ── Hero mouse parallax ────────────────────
  const heroProduct = document.querySelector('.hero-product-wrap');
  const heroSection = document.getElementById('hero');

  if (heroProduct && heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      heroProduct.style.transform = `perspective(1000px) rotateY(${dx * 8}deg) rotateX(${-dy * 5}deg) translateZ(20px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      heroProduct.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    });
  }

  // ── Hero angle carousel ────────────────────
  const angles = document.querySelectorAll('.product-angle');
  let currentAngle = 0;
  if (angles.length > 0) {
    angles[0].classList.add('active');
    setInterval(() => {
      angles[currentAngle].classList.remove('active');
      currentAngle = (currentAngle + 1) % angles.length;
      angles[currentAngle].classList.add('active');
    }, 2200);
  }

  // ── Featured product angle switcher ───────
  const thumbs = document.querySelectorAll('.angle-thumb');
  const featuredImg = document.querySelector('.featured-main-img');

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.querySelector('img')?.src;
      if (featuredImg && src) {
        featuredImg.style.opacity = '0';
        setTimeout(() => {
          featuredImg.src = src;
          featuredImg.style.opacity = '1';
        }, 200);
      }
    });
  });

  // ── Product carousel ───────────────────────
  const track = document.querySelector('.products-track');
  const prevBtn = document.getElementById('prod-prev');
  const nextBtn = document.getElementById('prod-next');
  let trackOffset = 0;
  const cardWidth = 300 + 20; // card width + gap

  function updateTrack() {
    if (track) track.style.transform = `translateX(${trackOffset}px)`;
  }

  nextBtn?.addEventListener('click', () => {
    const maxOffset = -(track.scrollWidth - track.parentElement.offsetWidth - 32);
    trackOffset = Math.max(trackOffset - cardWidth, maxOffset);
    updateTrack();
  });

  prevBtn?.addEventListener('click', () => {
    trackOffset = Math.min(trackOffset + cardWidth, 0);
    updateTrack();
  });

  // Touch/swipe on carousel
  if (track) {
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) nextBtn?.click();
        else prevBtn?.click();
      }
    }, { passive: true });
  }

  // ── Stats counter animation ────────────────
  function animateCounter(el, target, suffix = '') {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(update);
  }

  // ── Scroll reveal (IntersectionObserver) ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Stats counter trigger
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate number stats
        const numEl = entry.target.querySelector('.stat-number');
        if (numEl) {
          const text = numEl.dataset.target || numEl.textContent.trim();
          const num = parseInt(text.replace(/[^0-9]/g, ''));
          const suffix = text.replace(/[0-9]/g, '').trim();
          if (!isNaN(num)) animateCounter(numEl, num, suffix);
        }
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el));

  // ── Ticker duplicate for seamless loop ────
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
  }

  // ── Variant chip toggle + image swap ────────
  const variantImages = {
    blue:  ['Produktbilder/236/236-01.png','Produktbilder/236/236-45.png','Produktbilder/236/236-90.png','Produktbilder/236/236-120.png','Produktbilder/236/236-150.png','Produktbilder/236/236-180.png'],
    black: ['Produktbilder/236/236-01-BLK.png','Produktbilder/236/236-45-BLK.png','Produktbilder/236/236-90-BLK.png','Produktbilder/236/236-120-BLK.png','Produktbilder/236/236-150-BLK.png','Produktbilder/236/236-180-BLK.png']
  };
  document.querySelectorAll('.variant-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.variant-chip').forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const variant = chip.dataset.variant;
      const imgs = variantImages[variant];
      if (!imgs) return;
      const thumbs = document.querySelectorAll('.featured-angles .angle-thumb');
      const mainImg = document.getElementById('featured-img');
      const activeIdx = [...thumbs].findIndex(t => t.classList.contains('active'));
      const idx = activeIdx >= 0 ? activeIdx : 0;
      thumbs.forEach((t, i) => { if (imgs[i]) t.querySelector('img').src = imgs[i]; });
      if (mainImg && imgs[idx]) {
        mainImg.style.opacity = '0';
        setTimeout(() => { mainImg.src = imgs[idx]; mainImg.style.opacity = '1'; }, 200);
      }
    });
  });

  // ── Smooth scroll for anchor links ────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── GSAP animations (if loaded) ───────────
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero content entrance
    gsap.from('.hero-badge', { duration: 0.8, opacity: 0, y: 20, delay: 0.2 });
    gsap.from('.hero-title', { duration: 1, opacity: 0, y: 40, delay: 0.4, ease: 'power3.out' });
    gsap.from('.hero-sub', { duration: 0.8, opacity: 0, y: 25, delay: 0.65, ease: 'power2.out' });
    gsap.from('.hero-actions', { duration: 0.7, opacity: 0, y: 20, delay: 0.85 });
    gsap.from('.hero-specs', { duration: 0.7, opacity: 0, y: 20, delay: 1.0 });
    gsap.from('.hero-product-wrap', { duration: 1.2, opacity: 0, x: 60, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero-ring', { duration: 1.4, opacity: 0, scale: 0.7, delay: 0.5, ease: 'power2.out', stagger: 0.15 });

    // Industries
    gsap.from('.industry-card', {
      scrollTrigger: { trigger: '#industries', start: 'top 75%' },
      duration: 0.7, opacity: 0, y: 50, stagger: 0.15, ease: 'power2.out'
    });

    // Products
    gsap.from('.product-card', {
      scrollTrigger: { trigger: '#products', start: 'top 75%' },
      duration: 0.6, opacity: 0, y: 40, stagger: 0.1, ease: 'power2.out'
    });

    // Featured
    gsap.from('.featured-content', {
      scrollTrigger: { trigger: '#featured', start: 'top 70%' },
      duration: 0.9, opacity: 0, x: 50, ease: 'power3.out'
    });
    gsap.from('.featured-visual', {
      scrollTrigger: { trigger: '#featured', start: 'top 70%' },
      duration: 0.9, opacity: 0, x: -50, ease: 'power3.out'
    });

    // About
    gsap.from('.about-visual', {
      scrollTrigger: { trigger: '#about', start: 'top 75%' },
      duration: 0.9, opacity: 0, x: -50, ease: 'power3.out'
    });
    gsap.from('.about-content', {
      scrollTrigger: { trigger: '#about', start: 'top 75%' },
      duration: 0.9, opacity: 0, x: 50, ease: 'power3.out'
    });

    // CTA
    gsap.from('.cta-inner', {
      scrollTrigger: { trigger: '#cta', start: 'top 75%' },
      duration: 0.9, opacity: 0, y: 40, ease: 'power3.out'
    });

  }

});
