/**
 * events.js
 * Handles events listing page and event detail page.
 */

'use strict';

let allEvents      = [];
let filteredEvents = [];
let currentPage    = 1;
const PAGE_SIZE    = 6;

/* ---- Events Listing Page ---- */
async function initEventsPage() {
  const grid       = document.getElementById('events-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const paginationEl = document.getElementById('events-pagination');
  if (!grid) return;

  // Show skeletons
  UI.renderSkeletons(grid, PAGE_SIZE, 'card');

  try {
    const data  = await API.fetchEvents();
    allEvents   = Array.isArray(data) ? data : (data.results || []);
    filteredEvents = [...allEvents];
    renderPage(1);

    // Filter buttons
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.dataset.filter;
        filteredEvents = type === 'all'
          ? [...allEvents]
          : allEvents.filter(e => {
              const isPast = new Date(e.date) < new Date();
              return type === 'past' ? isPast : !isPast;
            });
        renderPage(1);
      });
    });

  } catch (err) {
    UI.renderEmptyState(grid, 'Failed to load events.', 'ইভেন্ট লোড করা যায়নি।');
    console.error(err);
  }
}

function renderPage(page) {
  const grid       = document.getElementById('events-grid');
  const paginationEl = document.getElementById('events-pagination');
  if (!grid) return;

  currentPage      = page;
  const start      = (page - 1) * PAGE_SIZE;
  const pageItems  = filteredEvents.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);

  if (!pageItems.length) {
    UI.renderEmptyState(grid, 'No events found.', 'কোনো ইভেন্ট পাওয়া যায়নি।');
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }

  grid.innerHTML = pageItems.map(e => UI.renderEventCard(e)).join('');

  // Re-observe scroll reveals
  grid.querySelectorAll('.reveal').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); } });
    }, { threshold: 0.1 });
    obs.observe(el);
  });

  // Re-apply language
  const lang = localStorage.getItem('lang') || 'en';
  window.applyLang && applyLang(lang);

  UI.renderPagination(paginationEl, currentPage, totalPages, renderPage);
}

/* ---- Event Detail Page ---- */
async function initEventDetailPage() {
  const container = document.getElementById('event-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');
  if (!id) { container.innerHTML = '<p>Event not found.</p>'; return; }

  container.innerHTML = `<div style="text-align:center;padding:3rem 0;"><div class="spinner" style="margin:0 auto;"></div></div>`;

  try {
    const event = await API.fetchEventById(id);
    const lang  = localStorage.getItem('lang') || 'en';
    const title = lang === 'bn' ? (event.title_bn || event.title) : event.title;
    const body  = lang === 'bn' ? (event.body_bn  || event.body)  : event.body;

    container.innerHTML = `
      <div style="max-width:800px;margin:0 auto;">
        <img src="${event.image || 'assets/images/placeholder-event.jpg'}"
             alt="${title}" style="width:100%;border-radius:var(--radius-md);margin-bottom:2rem;" loading="lazy">
        <div class="card-meta" style="margin-bottom:1rem;">
          <span>📅 ${UI.formatDate(event.date)}</span>
          ${event.location ? `<span>📍 ${event.location}</span>` : ''}
        </div>
        <h1 style="margin-bottom:1rem;">${title}</h1>
        <div style="color:var(--text-secondary);line-height:1.9;">${body || ''}</div>
        <div style="margin-top:2rem;">
          <a href="events.html" class="btn btn-outline" data-en="← Back to Events" data-bn="← ইভেন্টে ফিরুন">← Back to Events</a>
        </div>
      </div>`;
  } catch (err) {
    container.innerHTML = '<p>Event not found or failed to load.</p>';
  }
}

/* ---- Auto-init based on page ---- */
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('events-grid'))   initEventsPage();
  if (document.getElementById('event-detail'))  initEventDetailPage();
});
