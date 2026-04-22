/**
 * gallery.js
 * Handles gallery grid rendering and lightbox.
 */

'use strict';

let galleryItems = [];

async function initGalleryPage() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  UI.renderSkeletons(grid, 8, 'gallery');

  try {
    const data   = await API.fetchGallery();
    galleryItems = Array.isArray(data) ? data : (data.results || []);

    if (!galleryItems.length) {
      UI.renderEmptyState(grid, 'No gallery items.', 'কোনো গ্যালারি নেই।');
      return;
    }

    grid.innerHTML = galleryItems.map((item, i) => UI.renderGalleryItem(item, i)).join('');

    // Scroll reveal
    grid.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.08 });
      obs.observe(el);
    });

    // Click to open lightbox
    grid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => openLightbox(parseInt(item.dataset.index)));
    });

  } catch (err) {
    UI.renderEmptyState(grid, 'Failed to load gallery.', 'গ্যালারি লোড করা যায়নি।');
    console.error(err);
  }
}

/* ---- Lightbox ---- */
let currentLightboxIndex = 0;

function openLightbox(index) {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  currentLightboxIndex = index;
  showLightboxItem(index);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden'; 
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb?.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxItem(index) {
  const img     = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const item    = galleryItems[index];
  if (!item || !img) return;

  img.src        = item.image;
  img.alt        = item.caption || '';
  if (caption) caption.textContent = item.caption || '';
}

function lightboxNext() {
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
  showLightboxItem(currentLightboxIndex);
}

function lightboxPrev() {
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
  showLightboxItem(currentLightboxIndex);
}

/* ---- Event listeners ---- */
document.addEventListener('DOMContentLoaded', () => {
  initGalleryPage();

  const lb      = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  const nextBtn  = document.getElementById('lightbox-next');
  const prevBtn  = document.getElementById('lightbox-prev');

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', lightboxNext);
  prevBtn?.addEventListener('click', lightboxPrev);

  // Click backdrop to close
  lb?.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') lightboxNext();
    if (e.key === 'ArrowLeft')  lightboxPrev();
  });
});
