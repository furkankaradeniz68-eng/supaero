'use strict';

// ─── Language metadata ─────────────────────────────────────────
const PORTAL_LANGS = {
  en: { label: 'EN', flag: '/img/flags/gb.png',  name: 'English' },
  de: { label: 'DE', flag: '/img/flags/de.png',  name: 'Deutsch' },
  tr: { label: 'TR', flag: '/img/flags/tr.png',  name: 'Türkçe' },
  es: { label: 'ES', flag: '/img/flags/es.png',  name: 'Español' },
  it: { label: 'IT', flag: '/img/flags/it.png',  name: 'Italiano' },
  pt: { label: 'PT', flag: '/img/flags/pt.png',  name: 'Português' },
  zh: { label: 'ZH', flag: '/img/flags/cn.png',  name: '中文' },
  ar: { label: 'AR', flag: '/img/flags/sa.png',  name: 'العربية' },
};

// ─── Translations ──────────────────────────────────────────────
const PORTAL_T = {
  en: {
    login_title:     'Sign In',
    login_badge:     'Exclusive Customer Area',
    login_sub:       'Sign in to access the interactive 3D product models.',
    login_email_lbl: 'Email address',
    login_email_ph:  'name@company.com',
    login_pw_lbl:    'Password',
    login_btn:       'Sign In',
    login_checking:  'Checking …',
    login_hint:      'No access yet? Contact your supAero representative to receive your personal login credentials.',
    login_vis_h:     'Exclusive 3D Product Views for Your Planning',
    login_vis_p:     'Explore our precision components fully interactively — rotate, zoom and inspect every detail from every angle.',
    login_cert:      'ISO 9001:2015 certified · For many years',
    nav_models:      'CAD Models',
    nav_admin:       'Admin',
    nav_logout:      'Sign Out',
    agr_title:       'CAD Data Usage Agreement',
    agr_sub:         'Please read the agreement in full and accept it to gain access to the portal.',
    agr_check:       'I have read the CAD Data Usage Agreement in full and accept it as binding.',
    agr_btn:         'Accept Agreement & Open Access',
    agr_progress:    '% read',
    models_empty:    'Select a product from the list',
    models_no_model: 'No 3D model available',
    models_no_file:  'No file available',
    models_download: 'Download file',
    models_selected: 'Selected Product',
    models_file_lbl: 'CAD File',
    models_search:   'Search …',
    models_hint:     'This file is subject to the CAD Data Usage Agreement you accepted at first login.',
  },
  de: {
    login_title:     'Anmelden',
    login_badge:     'Exklusiver Kundenbereich',
    login_sub:       'Melden Sie sich an, um Zugang zu den interaktiven 3D-Produktmodellen zu erhalten.',
    login_email_lbl: 'E-Mail-Adresse',
    login_email_ph:  'name@firma.de',
    login_pw_lbl:    'Passwort',
    login_btn:       'Anmelden',
    login_checking:  'Wird überprüft …',
    login_hint:      'Noch keinen Zugang? Wenden Sie sich an Ihren supAero-Ansprechpartner, um Ihre persönlichen Zugangsdaten zu erhalten.',
    login_vis_h:     'Exklusive 3D-Produktansichten für Ihre Planung',
    login_vis_p:     'Erkunden Sie unsere Präzisionskomponenten vollständig interaktiv — drehen, zoomen und prüfen Sie jedes Detail aus jedem Winkel.',
    login_cert:      'ISO 9001:2015 zertifiziert · Seit vielen Jahren',
    nav_models:      'CAD-Modelle',
    nav_admin:       'Admin',
    nav_logout:      'Abmelden',
    agr_title:       'CAD-Daten-Nutzungsvereinbarung',
    agr_sub:         'Bitte lesen Sie die Vereinbarung vollständig und akzeptieren Sie diese, um Zugang zum Portal zu erhalten.',
    agr_check:       'Ich habe die CAD-Daten-Nutzungsvereinbarung vollständig gelesen und akzeptiere diese verbindlich.',
    agr_btn:         'Vereinbarung akzeptieren & Zugang öffnen',
    agr_progress:    '% gelesen',
    models_empty:    'Produkt aus der Liste auswählen',
    models_no_model: 'Kein 3D-Modell verfügbar',
    models_no_file:  'Keine Datei verfügbar',
    models_download: 'Datei herunterladen',
    models_selected: 'Ausgewähltes Produkt',
    models_file_lbl: 'CAD-Datei',
    models_search:   'Suchen …',
    models_hint:     'Diese Datei unterliegt der CAD-Daten-Nutzungsvereinbarung, der Sie beim ersten Login zugestimmt haben.',
  },
  tr: {
    login_title:     'Giriş Yap',
    login_badge:     'Özel Müşteri Alanı',
    login_sub:       'İnteraktif 3D ürün modellerine erişmek için giriş yapın.',
    login_email_lbl: 'E-posta adresi',
    login_email_ph:  'ad@sirket.com',
    login_pw_lbl:    'Şifre',
    login_btn:       'Giriş Yap',
    login_checking:  'Kontrol ediliyor …',
    login_hint:      'Henüz erişiminiz yok mu? Kişisel giriş bilgilerinizi almak için supAero temsilcinizle iletişime geçin.',
    login_vis_h:     'Planlamanız için Özel 3D Ürün Görünümleri',
    login_vis_p:     'Hassas bileşenlerimizi tamamen interaktif olarak keşfedin — döndürün, yakınlaştırın, her detayı inceleyin.',
    login_cert:      'ISO 9001:2015 sertifikalı · Uzun yıllar boyunca',
    nav_models:      'CAD Modelleri',
    nav_admin:       'Admin',
    nav_logout:      'Çıkış Yap',
    agr_title:       'CAD Veri Kullanım Sözleşmesi',
    agr_sub:         'Portala erişmek için lütfen sözleşmeyi tamamen okuyun ve kabul edin.',
    agr_check:       'CAD Veri Kullanım Sözleşmesini tamamen okudum ve bağlayıcı olarak kabul ediyorum.',
    agr_btn:         'Sözleşmeyi Kabul Et & Erişimi Aç',
    agr_progress:    '% okundu',
    models_empty:    'Listeden bir ürün seçin',
    models_no_model: '3D model mevcut değil',
    models_no_file:  'Dosya mevcut değil',
    models_download: 'Dosyayı indir',
    models_selected: 'Seçilen Ürün',
    models_file_lbl: 'CAD Dosyası',
    models_search:   'Ara …',
    models_hint:     'Bu dosya, ilk girişte kabul ettiğiniz CAD Veri Kullanım Sözleşmesine tabidir.',
  },
  es: {
    login_title:     'Iniciar sesión',
    login_badge:     'Área exclusiva de clientes',
    login_sub:       'Inicie sesión para acceder a los modelos interactivos de productos 3D.',
    login_email_lbl: 'Dirección de correo',
    login_email_ph:  'nombre@empresa.com',
    login_pw_lbl:    'Contraseña',
    login_btn:       'Iniciar sesión',
    login_checking:  'Verificando …',
    login_hint:      '¿No tiene acceso? Contacte a su representante supAero para recibir sus credenciales.',
    login_vis_h:     'Vistas 3D exclusivas para su planificación',
    login_vis_p:     'Explore nuestros componentes de precisión de forma completamente interactiva.',
    login_cert:      'Certificado ISO 9001:2015 · Durante muchos años',
    nav_models:      'Modelos CAD',
    nav_admin:       'Admin',
    nav_logout:      'Cerrar sesión',
    agr_title:       'Acuerdo de uso de datos CAD',
    agr_sub:         'Por favor, lea el acuerdo completo y acéptelo para obtener acceso al portal.',
    agr_check:       'He leído y acepto el Acuerdo de uso de datos CAD como vinculante.',
    agr_btn:         'Aceptar y abrir acceso',
    agr_progress:    '% leído',
    models_empty:    'Seleccione un producto de la lista',
    models_no_model: 'Modelo 3D no disponible',
    models_no_file:  'Archivo no disponible',
    models_download: 'Descargar archivo',
    models_selected: 'Producto seleccionado',
    models_file_lbl: 'Archivo CAD',
    models_search:   'Buscar …',
    models_hint:     'Este archivo está sujeto al Acuerdo de uso de datos CAD que aceptó al primer inicio de sesión.',
  },
  it: {
    login_title:     'Accedi',
    login_badge:     'Area clienti esclusiva',
    login_sub:       'Accedi per visualizzare i modelli interattivi di prodotti 3D.',
    login_email_lbl: 'Indirizzo email',
    login_email_ph:  'nome@azienda.com',
    login_pw_lbl:    'Password',
    login_btn:       'Accedi',
    login_checking:  'Verifica in corso …',
    login_hint:      'Non hai ancora accesso? Contatta il tuo referente supAero per ricevere le credenziali.',
    login_vis_h:     'Viste 3D esclusive per la tua pianificazione',
    login_vis_p:     'Esplora i nostri componenti di precisione in modo completamente interattivo.',
    login_cert:      'Certificato ISO 9001:2015 · Da molti anni',
    nav_models:      'Modelli CAD',
    nav_admin:       'Admin',
    nav_logout:      'Disconnetti',
    agr_title:       'Accordo sull\'uso dei dati CAD',
    agr_sub:         'Si prega di leggere l\'accordo completo e accettarlo per ottenere l\'accesso al portale.',
    agr_check:       'Ho letto e accetto l\'Accordo sull\'uso dei dati CAD come vincolante.',
    agr_btn:         'Accetta & Apri accesso',
    agr_progress:    '% letto',
    models_empty:    'Seleziona un prodotto dalla lista',
    models_no_model: 'Nessun modello 3D disponibile',
    models_no_file:  'Nessun file disponibile',
    models_download: 'Scarica file',
    models_selected: 'Prodotto selezionato',
    models_file_lbl: 'File CAD',
    models_search:   'Cerca …',
    models_hint:     'Questo file è soggetto all\'Accordo sull\'uso dei dati CAD accettato al primo accesso.',
  },
  pt: {
    login_title:     'Entrar',
    login_badge:     'Área exclusiva de clientes',
    login_sub:       'Entre para acessar os modelos interativos de produtos 3D.',
    login_email_lbl: 'Endereço de e-mail',
    login_email_ph:  'nome@empresa.com',
    login_pw_lbl:    'Senha',
    login_btn:       'Entrar',
    login_checking:  'Verificando …',
    login_hint:      'Ainda não tem acesso? Contacte o seu representante supAero para receber as suas credenciais.',
    login_vis_h:     'Visualizações 3D exclusivas para o seu planeamento',
    login_vis_p:     'Explore os nossos componentes de precisão de forma totalmente interativa.',
    login_cert:      'Certificado ISO 9001:2015 · Por muitos anos',
    nav_models:      'Modelos CAD',
    nav_admin:       'Admin',
    nav_logout:      'Sair',
    agr_title:       'Acordo de uso de dados CAD',
    agr_sub:         'Por favor, leia o acordo completo e aceite-o para obter acesso ao portal.',
    agr_check:       'Li e aceito o Acordo de uso de dados CAD como vinculativo.',
    agr_btn:         'Aceitar & Abrir acesso',
    agr_progress:    '% lido',
    models_empty:    'Selecione um produto da lista',
    models_no_model: 'Modelo 3D não disponível',
    models_no_file:  'Arquivo não disponível',
    models_download: 'Descarregar arquivo',
    models_selected: 'Produto selecionado',
    models_file_lbl: 'Arquivo CAD',
    models_search:   'Pesquisar …',
    models_hint:     'Este arquivo está sujeito ao Acordo de uso de dados CAD que aceitou no primeiro início de sessão.',
  },
  zh: {
    login_title:     '登录',
    login_badge:     '专属客户区域',
    login_sub:       '请登录以访问互动式3D产品模型。',
    login_email_lbl: '电子邮件地址',
    login_email_ph:  'name@company.com',
    login_pw_lbl:    '密码',
    login_btn:       '登录',
    login_checking:  '验证中 …',
    login_hint:      '还没有访问权限？请联系您的supAero代表以获取您的个人登录凭据。',
    login_vis_h:     '为您的规划提供专属3D产品视图',
    login_vis_p:     '完全交互式地探索我们的精密组件 — 从各个角度旋转、缩放和检查每个细节。',
    login_cert:      'ISO 9001:2015认证 · 多年来',
    nav_models:      'CAD模型',
    nav_admin:       '管理',
    nav_logout:      '退出',
    agr_title:       'CAD数据使用协议',
    agr_sub:         '请阅读完整协议并接受，以获得门户访问权限。',
    agr_check:       '我已完整阅读CAD数据使用协议并接受其约束。',
    agr_btn:         '接受协议并开放访问',
    agr_progress:    '% 已读',
    models_empty:    '从列表中选择产品',
    models_no_model: '没有可用的3D模型',
    models_no_file:  '没有可用文件',
    models_download: '下载文件',
    models_selected: '已选产品',
    models_file_lbl: 'CAD文件',
    models_search:   '搜索 …',
    models_hint:     '此文件受您在首次登录时接受的CAD数据使用协议约束。',
  },
  ar: {
    login_title:     'تسجيل الدخول',
    login_badge:     'منطقة العملاء الحصرية',
    login_sub:       'سجّل الدخول للوصول إلى نماذج المنتجات ثلاثية الأبعاد التفاعلية.',
    login_email_lbl: 'عنوان البريد الإلكتروني',
    login_email_ph:  'name@company.com',
    login_pw_lbl:    'كلمة المرور',
    login_btn:       'تسجيل الدخول',
    login_checking:  'جارٍ التحقق …',
    login_hint:      'ليس لديك وصول بعد؟ تواصل مع مندوب supAero للحصول على بيانات الدخول الخاصة بك.',
    login_vis_h:     'مشاهدات ثلاثية الأبعاد حصرية لتخطيطك',
    login_vis_p:     'استكشف مكوناتنا الدقيقة بشكل تفاعلي كامل — دوّر وكبّر وافحص كل تفصيل.',
    login_cert:      'معتمد ISO 9001:2015 · لسنوات عديدة',
    nav_models:      'نماذج CAD',
    nav_admin:       'الإدارة',
    nav_logout:      'تسجيل الخروج',
    agr_title:       'اتفاقية استخدام بيانات CAD',
    agr_sub:         'يرجى قراءة الاتفاقية كاملةً وقبولها للحصول على وصول إلى البوابة.',
    agr_check:       'لقد قرأت اتفاقية استخدام بيانات CAD كاملةً وأقبلها بشكل ملزم.',
    agr_btn:         'قبول الاتفاقية وفتح الوصول',
    agr_progress:    '% مقروء',
    models_empty:    'اختر منتجاً من القائمة',
    models_no_model: 'لا يوجد نموذج ثلاثي الأبعاد',
    models_no_file:  'لا يوجد ملف متاح',
    models_download: 'تحميل الملف',
    models_selected: 'المنتج المحدد',
    models_file_lbl: 'ملف CAD',
    models_search:   'بحث …',
    models_hint:     'هذا الملف خاضع لاتفاقية استخدام بيانات CAD التي وافقت عليها عند تسجيل الدخول الأول.',
  },
};

// ─── Core ──────────────────────────────────────────────────────
const _langCallbacks = [];

function getLang() {
  const s = localStorage.getItem('sa-lang');
  return (s && PORTAL_T[s]) ? s : 'de';
}

function t(key) {
  const lang = getLang();
  return (PORTAL_T[lang]?.[key]) ?? (PORTAL_T.en?.[key]) ?? key;
}

function setLang(lang) {
  if (!PORTAL_T[lang]) return;
  localStorage.setItem('sa-lang', lang);
  applyLang(lang);
  _langCallbacks.forEach(fn => fn(lang));
}

function onLangChange(fn) { _langCallbacks.push(fn); }

function applyLang(lang) {
  const dict = PORTAL_T[lang] || PORTAL_T.en;
  document.querySelectorAll('[data-pi18n]').forEach(el => {
    const key  = el.getAttribute('data-pi18n');
    const attr = el.getAttribute('data-pi18n-attr');
    const val  = dict[key] ?? (PORTAL_T.en[key]) ?? key;
    if (attr) el.setAttribute(attr, val); else el.textContent = val;
  });
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  _updateSwitcherDisplay(lang);
}

function _updateSwitcherDisplay(lang) {
  const info = PORTAL_LANGS[lang] || PORTAL_LANGS.en;
  document.querySelectorAll('.pi-flag').forEach(el => { el.src = info.flag; });
  document.querySelectorAll('.pi-label').forEach(el => { el.textContent = info.label; });
  document.querySelectorAll('.pi-option').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === lang);
  });
}

// ─── Switcher widget ───────────────────────────────────────────
(function injectCSS() {
  const s = document.createElement('style');
  s.textContent = `
    .pi-sw { position:relative;display:inline-flex;align-items:center; }
    .pi-btn { display:inline-flex;align-items:center;gap:5px;padding:5px 10px;
      font-family:'Inter',sans-serif;font-size:12px;font-weight:500;
      border:1px solid var(--border,rgba(10,20,40,.12));border-radius:8px;
      background:var(--bg,#fff);color:var(--text-2,rgba(10,20,40,.56));
      cursor:pointer;transition:background .15s,border-color .15s;white-space:nowrap; }
    .pi-btn:hover { background:var(--bg-2,#f3f6fb);border-color:rgba(10,20,40,.2); }
    .pi-flag { border-radius:2px;vertical-align:middle; }
    .pi-caret { opacity:.5; }
    .pi-dd { position:absolute;top:calc(100% + 5px);right:0;min-width:130px;
      background:var(--bg,#fff);border:1px solid var(--border,rgba(10,20,40,.12));
      border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,.1);overflow:hidden;
      z-index:1001;animation:pi-fade .12s ease; }
    @keyframes pi-fade { from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none} }
    .pi-dd.hidden { display:none; }
    .pi-option { display:flex;align-items:center;gap:8px;padding:8px 12px;
      font-family:'Inter',sans-serif;font-size:13px;font-weight:400;
      color:var(--text-2,rgba(10,20,40,.56));cursor:pointer;transition:background .1s; }
    .pi-option:hover { background:var(--bg-2,#f3f6fb); }
    .pi-option.active { color:var(--blue,#1B4F9B);font-weight:600;background:rgba(27,79,155,.05); }
    /* login-page override: dark bg switcher */
    .login-lang-wrap .pi-btn { background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.2);color:#fff; }
    .login-lang-wrap .pi-btn:hover { background:rgba(255,255,255,.2); }
    .login-lang-wrap .pi-dd { background:#0c2044;border-color:rgba(255,255,255,.15); }
    .login-lang-wrap .pi-option { color:rgba(255,255,255,.75); }
    .login-lang-wrap .pi-option:hover { background:rgba(255,255,255,.08); }
    .login-lang-wrap .pi-option.active { color:#fff;background:rgba(255,255,255,.12); }
  `;
  document.head.appendChild(s);
})();

function initPortalLangSwitcher(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const lang = getLang();
  const info = PORTAL_LANGS[lang] || PORTAL_LANGS.en;
  container.innerHTML = `<div class="pi-sw" id="pi-sw-${containerId}">
    <button class="pi-btn" onclick="_toggleLangDD('${containerId}')">
      <img class="pi-flag" src="${info.flag}" width="16" height="11" alt="">
      <span class="pi-label">${info.label}</span>
      <svg class="pi-caret" width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1l3 3 3-3" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
    </button>
    <div class="pi-dd hidden" id="pi-dd-${containerId}">
      ${Object.entries(PORTAL_LANGS).map(([code, inf]) =>
        `<div class="pi-option${code===lang?' active':''}" data-lang="${code}" onclick="setLang('${code}');_closeLangDD('${containerId}')">
          <img src="${inf.flag}" width="14" height="10" alt=""> ${inf.name}
        </div>`).join('')}
    </div>
  </div>`;
}

function _toggleLangDD(id) {
  const dd = document.getElementById(`pi-dd-${id}`);
  if (!dd) return;
  const willOpen = dd.classList.contains('hidden');
  dd.classList.toggle('hidden');
  if (willOpen) {
    const close = (e) => {
      if (!e.target.closest(`#pi-sw-${id}`)) {
        dd.classList.add('hidden');
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 10);
  }
}

function _closeLangDD(id) {
  document.getElementById(`pi-dd-${id}`)?.classList.add('hidden');
}
