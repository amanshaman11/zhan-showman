document.addEventListener('DOMContentLoaded', () => {

  /* ---------- SWIPER INSTANCES (hoisted for i18n refresh) ---------- */
  let reviewsSwiper = null;
  let portfolioSwiper = null;

  /* ---------- I18N ---------- */
  const LANG_KEY = 'zhan-showman-lang';
  let currentLang = localStorage.getItem(LANG_KEY) || 'ru';

  const getNested = (obj, path) => path.split('.').reduce((o, k) => (o ? o[k] : null), obj);

  const SERVICE_KEYS = {
    wedding: 'services.wedding',
    uzatu: 'services.uzatu',
    corporate: 'services.corporate',
    anniversary: 'services.anniversary',
    birthday: 'services.birthday',
    toy: 'services.toy',
    presentation: 'services.presentation',
    turnkey: 'services.turnkey'
  };

  const PACKAGE_KEYS = {
    standard: 'packages.standard',
    comfort: 'packages.comfort',
    premium: 'packages.premium'
  };

  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang];
    if (!dict) return;

    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang === 'kk' ? 'kk' : lang;

    document.title = dict.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = dict.meta.description;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const text = getNested(dict, el.dataset.i18n);
      if (text != null) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const text = getNested(dict, el.dataset.i18nPlaceholder);
      if (text != null) el.placeholder = text;
    });

    document.querySelectorAll('.lang-switcher__btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    const eventSelect = document.getElementById('eventType');
    if (eventSelect && EVENT_TYPES[lang]) {
      const prev = eventSelect.value;
      eventSelect.innerHTML = EVENT_TYPES[lang].map(t => `<option>${t}</option>`).join('');
      if (prev) {
        const idx = EVENT_TYPES.ru.indexOf(prev);
        if (idx >= 0 && EVENT_TYPES[lang][idx]) eventSelect.value = EVENT_TYPES[lang][idx];
      }
    }
    requestAnimationFrame(() => {
      if (typeof reviewsSwiper !== 'undefined' && reviewsSwiper) reviewsSwiper.update();
      if (typeof portfolioSwiper !== 'undefined' && portfolioSwiper) portfolioSwiper.update();
    });
  }

  function initLangSwitcher(container) {
    if (!container) return;
    container.querySelectorAll('.lang-switcher__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        applyTranslations(btn.dataset.lang);
        closeMobileNav();
      });
    });
  }

  initLangSwitcher(document.getElementById('langSwitcher'));
  initLangSwitcher(document.getElementById('langSwitcherMobile'));

  /* ---------- MARQUEE & CLIENT LOGOS ---------- */
  function buildMarquee() {
    const track = document.getElementById('marqueeTrack');
    if (!track) return;
    const chips = CLIENT_NAMES.map(name => `<span class="logo-chip">${name}</span>`).join('');
    track.innerHTML = chips + chips;
  }

  function buildClientLogos() {
    const container = document.getElementById('clientsLogos');
    if (!container) return;
    container.innerHTML = CLIENT_NAMES.map(name => `<span class="logo-chip">${name}</span>`).join('');
  }

  buildMarquee();
  buildClientLogos();

  /* ---------- SWIPER & GLIGHTBOX ---------- */
  if (typeof Swiper !== 'undefined') {
    reviewsSwiper = new Swiper('.reviews-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      grabCursor: true,
      pagination: { el: '.reviews-swiper__pagination', clickable: true },
      breakpoints: {
        640: { slidesPerView: 1.2 },
        960: { slidesPerView: 2, spaceBetween: 24 },
        1200: { slidesPerView: 3, spaceBetween: 24 }
      }
    });

    portfolioSwiper = new Swiper('.portfolio-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 16,
      centeredSlides: true,
      grabCursor: true,
      loop: true,
      pagination: { el: '.portfolio-swiper__pagination', clickable: true },
      navigation: { nextEl: '.portfolio-swiper__next', prevEl: '.portfolio-swiper__prev' },
      breakpoints: {
        640: { slidesPerView: 2, centeredSlides: false },
        960: { slidesPerView: 3, spaceBetween: 20 },
        1200: { slidesPerView: 4, spaceBetween: 22 }
      }
    });
  }

  if (typeof GLightbox !== 'undefined') {
    GLightbox({ selector: '.glightbox', touchNavigation: true, loop: true });
  }

  applyTranslations(currentLang);

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  const hidePreloader = () => preloader && preloader.classList.add('is-hidden');
  window.addEventListener('load', () => setTimeout(hidePreloader, 200));
  setTimeout(hidePreloader, 900);

  /* ---------- STICKY HEADER ---------- */
  const header = document.getElementById('header');
  const onScrollHeader = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- MOBILE MENU ---------- */
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  const closeMobileNav = () => {
    burger.classList.remove('is-open');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileNav));

  /* ---------- MOBILE STICKY CTA ---------- */
  const mobileCta = document.getElementById('mobileCta');
  const toggleMobileCta = () => {
    if (!mobileCta || window.innerWidth > 960) return;
    mobileCta.classList.toggle('is-visible', window.scrollY > 400);
  };
  toggleMobileCta();
  window.addEventListener('scroll', toggleMobileCta, { passive: true });

  /* ---------- SMOOTH SCROLL ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileNav();
    });
  });

  /* ---------- SCROLL REVEAL — fast, always readable ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
  // Show anything already in viewport immediately
  requestAnimationFrame(() => {
    revealEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-visible');
    });
  });

  // Refresh carousels after images/fonts load
  window.addEventListener('load', () => {
    reviewsSwiper && reviewsSwiper.update();
    portfolioSwiper && portfolioSwiper.update();
  });

  /* ---------- ANIMATED COUNTERS ---------- */
  const counters = document.querySelectorAll('.stat__num');
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-item__q');
    const answer = item.querySelector('.faq-item__a');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('is-open');
          openItem.querySelector('.faq-item__a').style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove('is-open');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('is-open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------- VIDEO MODAL ---------- */
  const videoModal = document.getElementById('videoModal');
  const videoModalTitle = document.getElementById('videoModalTitle');
  const videoModalClose = document.getElementById('videoModalClose');
  document.querySelectorAll('[data-video-title]').forEach(btn => {
    btn.addEventListener('click', () => {
      videoModalTitle.textContent = btn.dataset.videoTitle || getNested(TRANSLATIONS[currentLang], 'modal.title');
      videoModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });
  const closeVideoModal = () => {
    videoModal.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  videoModalClose.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => { if (e.target === videoModal) closeVideoModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideoModal(); });

  /* ---------- SERVICE / PACKAGE QUICK-FILL ---------- */
  const eventTypeSelect = document.getElementById('eventType');
  const messageField = document.getElementById('message');
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const key = link.dataset.service;
      const serviceKey = SERVICE_KEYS[key];
      if (!serviceKey || !eventTypeSelect) return;
      const label = getNested(TRANSLATIONS[currentLang], serviceKey);
      const options = EVENT_TYPES[currentLang] || EVENT_TYPES.ru;
      const ruLabel = getNested(TRANSLATIONS.ru, serviceKey);
      const ruIdx = EVENT_TYPES.ru.indexOf(ruLabel);
      if (ruIdx >= 0 && options[ruIdx]) eventTypeSelect.value = options[ruIdx];
      else if (label) eventTypeSelect.value = label;
    });
  });
  document.querySelectorAll('[data-package]').forEach(link => {
    link.addEventListener('click', () => {
      const key = link.dataset.package;
      const pkgKey = PACKAGE_KEYS[key];
      if (!pkgKey || !messageField) return;
      const pkg = getNested(TRANSLATIONS[currentLang], pkgKey);
      if (pkg && !messageField.value) {
        const prefix = currentLang === 'en' ? `Interested in the "${pkg}" package. ` :
          currentLang === 'kk' ? `«${pkg}» пакеті қызықтырады. ` :
          `Интересует пакет «${pkg}». `;
        messageField.value = prefix;
      }
    });
  });

  /* ---------- PHONE MASK ---------- */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    let rawDigits = '';

    const formatPhone = (digits) => {
      if (!digits) return '';
      let formatted = '+7';
      formatted += ' (' + digits.substring(0, 3);
      if (digits.length >= 3) formatted += ')';
      if (digits.length >= 4) formatted += ' ' + digits.substring(3, 6);
      if (digits.length >= 7) formatted += '-' + digits.substring(6, 8);
      if (digits.length >= 9) formatted += '-' + digits.substring(8, 10);
      return formatted;
    };

    const navKeys = ['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Escape', 'Enter'];

    phoneInput.addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (navKeys.includes(e.key)) return;

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        rawDigits = rawDigits.slice(0, -1);
        phoneInput.value = formatPhone(rawDigits);
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        rawDigits = (rawDigits + e.key).substring(0, 10);
        phoneInput.value = formatPhone(rawDigits);
      } else {
        e.preventDefault();
      }
    });

    phoneInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      let digits = pasted.replace(/\D/g, '');
      if (digits.length > 10) digits = digits.replace(/^7|^8/, '');
      rawDigits = digits.substring(0, 10);
      phoneInput.value = formatPhone(rawDigits);
    });

    phoneInput._resetMask = () => { rawDigits = ''; };
  }

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const dict = TRANSLATIONS[currentLang].contact;

      const nameField = form.querySelector('#name').closest('.field');
      const nameInput = form.querySelector('#name');
      if (!nameInput.value.trim()) {
        nameField.classList.add('has-error');
        valid = false;
      } else {
        nameField.classList.remove('has-error');
      }

      const phoneField = form.querySelector('#phone').closest('.field');
      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (phoneDigits.length < 11) {
        phoneField.classList.add('has-error');
        valid = false;
      } else {
        phoneField.classList.remove('has-error');
      }

      if (!valid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = dict.sending;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        formSuccess.classList.add('is-visible');
        form.reset();
        if (phoneInput._resetMask) phoneInput._resetMask();
        setTimeout(() => formSuccess.classList.remove('is-visible'), 5000);
      }, 900);
    });
  }

  /* ---------- FLOATING TO-TOP ---------- */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
