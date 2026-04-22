/**
 * ui.js
 * Reusable UI helpers: render cards, skeletons, empty states, pagination
 */

'use strict';

/* ============================================
   SKELETON LOADER - shows while data is fetching
   ============================================ */
function renderSkeletons(container, count = 6, type = 'card') {
  if (!container) return;
  container.innerHTML = Array(count).fill('').map(() => {
    if (type === 'card') return `
      <div class="card" aria-hidden="true">
        <div class="skeleton" style="height:200px;border-radius:0;"></div>
        <div class="card-body">
          <div class="skeleton" style="height:12px;width:40%;margin-bottom:10px;"></div>
          <div class="skeleton" style="height:18px;margin-bottom:8px;"></div>
          <div class="skeleton" style="height:14px;width:80%;margin-bottom:6px;"></div>
          <div class="skeleton" style="height:14px;width:60%;"></div>
        </div>
      </div>`;
    if (type === 'member') return `
      <div class="member-card" aria-hidden="true" style="text-align:center;">
        <div class="skeleton" style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;"></div>
        <div class="skeleton" style="height:16px;width:60%;margin:0 auto 8px;"></div>
        <div class="skeleton" style="height:13px;width:45%;margin:0 auto;"></div>
      </div>`;
    if (type === 'gallery') return `
      <div class="skeleton" style="aspect-ratio:1;border-radius:var(--radius-sm);" aria-hidden="true"></div>`;
    return `<div class="skeleton" style="height:80px;" aria-hidden="true"></div>`;
  }).join('');
}

/* ============================================
   EMPTY STATE
   ============================================ */
function renderEmptyState(container, message = 'No items found.', messageBn = 'কোনো তথ্য পাওয়া যায়নি।') {
  if (!container) return;
  const lang = localStorage.getItem('lang') || 'en';
  container.innerHTML = `
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <h3>${lang === 'bn' ? messageBn : message}</h3>
      <p style="font-size:0.875rem;color:var(--text-muted);" data-en="Try again later." data-bn="পরে আবার চেষ্টা করুন।">
        ${lang === 'bn' ? 'পরে আবার চেষ্টা করুন।' : 'Try again later.'}
      </p>
    </div>`;
}

/* ============================================
   EVENT CARD RENDERER
   ============================================ */
function renderEventCard(event) {
  const lang    = localStorage.getItem('lang') || 'en';
  const title   = lang === 'bn' ? (event.title_bn || event.title) : event.title;
  const desc    = lang === 'bn' ? (event.description_bn || event.description) : event.description;
  const dateStr = formatDate(event.date);
  const isPast  = new Date(event.date) < new Date();
  const badge   = isPast
    ? `<span class="badge badge-yellow" data-en="Past" data-bn="বিগত">Past</span>`
    : `<span class="badge badge-green" data-en="Upcoming" data-bn="আসছে">Upcoming</span>`;

  return `
    <article class="card card-hover reveal" data-id="${event.id}" data-type="${isPast ? 'past' : 'upcoming'}">
      <img class="card-img" src="${event.image || '/assets/images/placeholder-event.jpg'}"
           alt="${title}" loading="lazy" onerror="this.src='/assets/images/placeholder-event.jpg'">
      <div class="card-body">
        <div class="card-meta">
          ${badge}
          <span>📅 ${dateStr}</span>
          ${event.location ? `<span>📍 ${lang === 'bn' ? (event.location_bn || event.location) : event.location}</span>` : ''}
        </div>
        <h3 class="card-title">${title}</h3>
        <p class="card-desc">${truncate(desc, 100)}</p>
        <a href="pages/event-details.html?id=${event.id}" class="btn btn-outline btn-sm"
           data-en="Read More" data-bn="আরো পড়ুন">Read More</a>
      </div>
    </article>`;
}

/* ============================================
   COMMITTEE MEMBER CARD RENDERER
   ============================================ */
function renderMemberCard(member) {
  const lang = localStorage.getItem('lang') || 'en';
  const name = lang === 'bn' ? (member.name_bn || member.name) : member.name;
  const role = lang === 'bn' ? (member.role_bn || member.role) : member.role;
  const dept = lang === 'bn' ? (member.dept_bn || member.department) : member.department;

  return `
    <div class="member-card reveal card-hover">
      <img class="member-avatar"
           src="${member.photo || 'assets/images/placeholder-avatar.png'}"
           alt="${name}"
           loading="lazy"
           onerror="this.src='/assets/images/placeholder-avatar.png'">
      <div class="member-name">${name}</div>
      <div class="member-role">${role}</div>
      ${dept ? `<div class="member-dept">${dept}</div>` : ''}
      ${member.email ? `<a href="mailto:${member.email}" style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;display:block;">${member.email}</a>` : ''}
    </div>`;
}

/* ============================================
   GALLERY ITEM RENDERER
   ============================================ */
function renderGalleryItem(item, index) {
  const lang    = localStorage.getItem('lang') || 'en';
  const caption = lang === 'bn' ? (item.caption_bn || item.caption) : item.caption;

  return `
    <div class="gallery-item reveal" data-index="${index}" data-src="${item.image}" title="${caption}">
      <img src="${item.thumbnail || item.image}"
           alt="${caption}" loading="lazy"
           onerror="this.src='/assets/images/placeholder-gallery.jpg'">
      <div class="gallery-overlay">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1.5 1h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm0 3h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zm9-9h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm0 3h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm0 3h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zm0 3h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1z"/>
        </svg>
      </div>
    </div>`;
}

/* ============================================
   PAGINATION RENDERER
   ============================================ */
function renderPagination(container, currentPage, totalPages, onPageChange) {
  if (!container || totalPages <= 1) { if (container) container.innerHTML = ''; return; }

  let html = '<div class="pagination">';
  // Prev
  html += `<button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">‹</button>`;
  // Pages
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<span style="color:var(--text-muted);padding:0 4px;">…</span>`;
    }
  }
  // Next
  html += `<button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">›</button>`;
  html += '</div>';

  container.innerHTML = html;
  container.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => onPageChange(parseInt(btn.dataset.page)));
  });
}

/* ============================================
   HELPERS
   ============================================ */
function truncate(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const lang = localStorage.getItem('lang') || 'en';
  const d    = new Date(dateStr);
  return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-GB', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

/* ---- Exports ---- */
window.UI = {
  renderSkeletons,
  renderEmptyState,
  renderEventCard,
  renderMemberCard,
  renderGalleryItem,
  renderPagination,
  truncate,
  formatDate,
};
