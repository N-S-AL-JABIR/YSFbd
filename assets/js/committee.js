/**
 * committee.js
 * Renders committee members, grouped by role category.
 */

'use strict';

async function initCommitteePage() {
  const container = document.getElementById('committee-container');
  if (!container) return;

  // Skeleton placeholder
  container.innerHTML = `
    <div class="grid grid-4" id="committee-skeleton">
      ${Array(8).fill('<div class="member-card"><div class="skeleton" style="width:90px;height:90px;border-radius:50%;margin:0 auto 1rem;"></div><div class="skeleton" style="height:16px;width:60%;margin:0 auto 8px;"></div><div class="skeleton" style="height:13px;width:45%;margin:0 auto;"></div></div>').join('')}
    </div>`;

  try {
    const data    = await API.fetchCommittee();
    const members = Array.isArray(data) ? data : (data.results || []);

    if (!members.length) {
      UI.renderEmptyState(container, 'No committee members.', 'কমিটির তথ্য নেই।');
      return;
    }

    // Group by category
    const groups = {};
    members.forEach(m => {
      const cat = m.category || 'General';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(m);
    });

    let html = '';
    for (const [category, list] of Object.entries(groups)) {
      const lang = localStorage.getItem('lang') || 'en';
      const catLabel = lang === 'bn' ? (list[0]?.category_bn || category) : category;
      html += `
        <div class="committee-group" style="margin-bottom:3rem;">
          <h3 class="reveal" style="margin-bottom:1.5rem;padding-bottom:0.75rem;border-bottom:2px solid var(--color-primary);color:var(--color-primary);">${catLabel}</h3>
          <div class="grid grid-4">${list.map(m => UI.renderMemberCard(m)).join('')}</div>
        </div>`;
    }

    container.innerHTML = html;

    // Scroll reveal
    container.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.1 });
      obs.observe(el);
    });

  } catch (err) {
    UI.renderEmptyState(container, 'Failed to load committee.', 'কমিটি লোড করা যায়নি।');
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', initCommitteePage);
