/**
 * main.js
 * Global scripts: navbar, scroll effects, theme, language, component loader
 */

'use strict';

/* ============================================
   COMPONENT LOADER
   Dynamically injects navbar, footer, loader
   ============================================ */
async function loadComponent(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Cannot load ${url}`);
    el.innerHTML = await res.text();
    // After injection: run component-specific inits
    if (selector === '#navbar-placeholder') initNavbar();
    if (selector === '#footer-placeholder') initFooter();
  } catch (err) {
    console.warn('Component load failed:', err);
  }
}

/* ============================================
   THEME (Dark / Light)
   ============================================ */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'light';
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Toggle icon visibility
  const sun  = document.getElementById('theme-icon-sun');
  const moon = document.getElementById('theme-icon-moon');
  if (sun && moon) {
    sun.style.display  = theme === 'dark' ? 'none'  : 'block';
    moon.style.display = theme === 'dark' ? 'block' : 'none';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

/* ============================================
   LANGUAGE (EN / BN)
   ============================================ */
function initLang() {
  const saved = localStorage.getItem('lang') || 'en';
  applyLang(saved);
}

function applyLang(lang) {
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang === 'bn' ? 'bn' : 'en');

  // Swap all data-en / data-bn text
  document.querySelectorAll('[data-en][data-bn]').forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`) || el.textContent;
  });

  // Update placeholder attrs on inputs
  document.querySelectorAll('[data-en-placeholder][data-bn-placeholder]').forEach(el => {
    el.placeholder = el.getAttribute(`data-${lang}-placeholder`) || el.placeholder;
  });

  // Update toggle button label
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'bn' ? 'EN' : 'বাংলা';
}

function toggleLang() {
  const current = localStorage.getItem('lang') || 'en';
  applyLang(current === 'en' ? 'bn' : 'en');
}

/* ============================================
   NAVBAR BEHAVIOUR
   ============================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const themeBtn  = document.getElementById('theme-toggle');
  const langBtn   = document.getElementById('lang-toggle');

  // Apply saved theme & lang after navbar is injected
  initTheme();
  initLang();

  // Scroll: shrink navbar + show back-to-top
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY > 60;
    navbar?.classList.toggle('scrolled', scrolled);
    document.getElementById('back-to-top')?.classList.toggle('show', window.scrollY > 300);
  });

  // Hamburger toggle
  hamburger?.addEventListener('click', () => {
    const open = mobileNav?.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close mobile nav on link click
  mobileNav?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger?.classList.remove('open');
    });
  });

  // Theme toggle
  themeBtn?.addEventListener('click', toggleTheme);

  // Lang toggle
  langBtn?.addEventListener('click', toggleLang);

  // Highlight active nav link
  setActiveNavLink();
}

function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    // Match exact or partial path
    const isActive = href !== '#' && (
      path.endsWith(href) ||
      (href !== '/index.html' && href !== '/' && path.includes(href.replace('/pages/', '')))
    );
    link.classList.toggle('active', isActive);
  });
}

/* ============================================
   FOOTER INIT
   ============================================ */
function initFooter() {
  // Year is set inline in footer.html
  // Re-apply lang in case footer loaded after lang was set
  const lang = localStorage.getItem('lang') || 'en';
  applyLang(lang);
}

/* ============================================
   SCROLL REVEAL
   Adds .visible to .reveal elements on scroll
   ============================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ============================================
   PAGE LOADER
   ============================================ */
function hideLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 500);
  }
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   TICKER (notice bar)
   ============================================ */
function initTicker(notices = []) {
  const track = document.getElementById('ticker-items');
  if (!track || !notices.length) return;
  // Duplicate items for seamless loop
  const items = [...notices, ...notices];
  track.innerHTML = items.map(n => `<span class="ticker-item">📢 ${n}</span>`).join('');
}

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(40px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

/* ============================================
   SMOOTH ANCHOR SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 10;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ============================================
   INIT ON DOM READY
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  // Determine base path for components (works from root or /pages/)
  const isSubpage = window.location.pathname.includes('/pages/');
  const base = isSubpage ? '../' : './';

  // Load page loader first (hide it after components load)
  const loaderSlot = document.getElementById('loader-placeholder');
  if (loaderSlot) {
    const res = await fetch(`${base}components/loader.html`);
    loaderSlot.innerHTML = await res.text().catch(() => '');
  }

  // Load navbar & footer in parallel
  await Promise.all([
    loadComponent('#navbar-placeholder', `${base}components/navbar.html`),
    loadComponent('#footer-placeholder', `${base}components/footer.html`),
  ]);

  // Global inits
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  hideLoader();
});

// Expose helpers globally
window.showToast = showToast;
window.initTicker = initTicker;
window.applyLang  = applyLang;
