// ==========================================================================
// PENDEKIN — FRONTEND INTERACTIONS
// (Vanilla JS only — siap dikembangkan ke Laravel Blade / real API nanti)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initNavbar();
  initMobileMenu();
  initFadeUp();
  initRipple();
  initHeroShortener();
  initDemoShortener();
  initStatsCounter();
  initPricingToggle();
});

/* ---------- Lucide icons ---------- */
function initIcons() {
  if (window.lucide) {
    lucide.createIcons();
  }
}

/* ---------- Sticky navbar transparency ---------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const toggleScrolled = () => {
    if (window.scrollY > 12) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  toggleScrolled();
  window.addEventListener('scroll', toggleScrolled, { passive: true });
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!toggle || !mobile) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobile.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.innerHTML = isOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';
    initIcons();
  });

  mobile.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobile.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i data-lucide="menu"></i>';
      initIcons();
    });
  });
}

/* ---------- Fade up on scroll (IntersectionObserver) ---------- */
function initFadeUp() {
  const items = document.querySelectorAll('.fade-up');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- Light button ripple ---------- */
function initRipple() {
  document.querySelectorAll('.btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ---------- Helpers ---------- */
function randomSlug(length = 6) {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let slug = '';
  for (let i = 0; i < length; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return slug;
}

function isLikelyUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  // Terima dengan atau tanpa protokol, cukup permisif untuk simulasi frontend
  return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+.*$/i.test(trimmed);
}

function showToast(message = 'Copied!') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const span = toast.querySelector('span');
  if (span) span.textContent = message;

  toast.classList.add('show');
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  temp.style.position = 'fixed';
  temp.style.opacity = '0';
  document.body.appendChild(temp);
  temp.select();
  try { document.execCommand('copy'); } catch (err) { /* no-op */ }
  document.body.removeChild(temp);
}

/* ---------- Hero shortener (simulasi) ---------- */
function initHeroShortener() {
  const form = document.getElementById('heroForm');
  const input = document.getElementById('heroUrlInput');
  const resultBox = document.getElementById('heroResult');
  const resultLink = document.getElementById('heroResultLink');
  const copyBtn = document.getElementById('heroCopyBtn');
  if (!form || !input || !resultBox || !resultLink) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (!isLikelyUrl(value)) {
      input.focus();
      return;
    }

    const shortLink = `pdk.id/${randomSlug()}`;
    resultLink.textContent = shortLink;
    resultBox.classList.remove('show');
    // retrigger animasi
    void resultBox.offsetWidth;
    resultBox.classList.add('show');
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(`https://${resultLink.textContent}`);
      showToast('Copied!');
    });
  }
}

/* ---------- Interactive demo shortener ---------- */
function initDemoShortener() {
  const input = document.getElementById('demoUrlInput');
  const btn = document.getElementById('demoShortenBtn');
  const resultBox = document.getElementById('demoResult');
  const resultLink = document.getElementById('demoResultLink');
  const copyBtn = document.getElementById('demoCopyBtn');
  if (!input || !btn || !resultBox || !resultLink) return;

  const generate = () => {
    const value = input.value.trim();
    const slug = value ? randomSlug() : 'demo123';
    resultLink.textContent = `pdk.id/${slug}`;
    resultBox.classList.remove('show');
    void resultBox.offsetWidth;
    resultBox.classList.add('show');
  };

  btn.addEventListener('click', generate);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      generate();
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      copyToClipboard(`https://${resultLink.textContent}`);
      showToast('Copied!');
    });
  }
}

/* ---------- Stats counter animation ---------- */
function initStatsCounter() {
  const numbers = document.querySelectorAll('.stat-number');
  if (!numbers.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimal = parseInt(el.dataset.decimal || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;
      el.textContent = current.toFixed(decimal) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toFixed(decimal) + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  numbers.forEach((el) => observer.observe(el));
}

/* ---------- Pricing monthly/yearly toggle ---------- */
function initPricingToggle() {
  const switchEl = document.getElementById('billingSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelYearly = document.getElementById('labelYearly');
  const prices = document.querySelectorAll('.price-amount[data-monthly]');
  if (!switchEl || !prices.length) return;

  switchEl.addEventListener('click', () => {
    const isYearly = switchEl.getAttribute('aria-checked') === 'true';
    const next = !isYearly;
    switchEl.setAttribute('aria-checked', String(next));

    prices.forEach(price => {
      price.textContent = next ? price.dataset.yearly : price.dataset.monthly;
    });
    
    labelMonthly.classList.toggle('active', !next);
    labelYearly.classList.toggle('active', next);
  });
}