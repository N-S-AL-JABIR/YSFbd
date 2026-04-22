/**
 * api.js
 * Centralized API layer.
 * Switch BASE_URL to DRF backend when ready.
 * Falls back to local JSON data files during development.
 */

'use strict';

/* ---- Configuration ---- */
const API_CONFIG = {
  // Toggle: 'local' uses /data/*.json | 'remote' uses DRF backend
  mode: 'local',

  // Production DRF base URL (update before going live)
  remoteBase: 'https://api.yourorg.org',

  // Local JSON fallback paths
  localBase: '/data',

  // Endpoints map
  endpoints: {
    events:    '/events/',
    committee: '/committee/',
    gallery:   '/gallery/',
    supporter: '/supporter/',
    notices:   '/notices/',
    stats:     '/stats/',
  },
};

/* ---- Core Fetch Wrapper ---- */
async function apiFetch(endpoint, options = {}) {
  let url;

  if (API_CONFIG.mode === 'local') {
    // Map endpoint name to JSON file
    const file = endpoint.replace(/\//g, '').replace('api', '') || 'events';
    url = `${API_CONFIG.localBase}/${file}.json`;
  } else {
    url = `${API_CONFIG.remoteBase}/api${endpoint}`;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${getToken()}`, // uncomment when auth is ready
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText} — ${url}`);
    }

    return await res.json();
  } catch (err) {
    console.error('[api.js]', err);
    throw err;
  }
}

/* ---- Public API Functions ---- */

/**
 * Fetch all events
 * DRF endpoint: GET /api/events/
 * Query params: ?type=upcoming|past&limit=N
 */
async function fetchEvents(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const endpoint = API_CONFIG.endpoints.events + (qs ? `?${qs}` : '');
  return apiFetch(endpoint);
}

/**
 * Fetch single event by ID
 * DRF endpoint: GET /api/events/:id/
 */
async function fetchEventById(id) {
  return apiFetch(`${API_CONFIG.endpoints.events}${id}/`);
}

/**
 * Fetch committee members
 * DRF endpoint: GET /api/committee/
 */
async function fetchCommittee() {
  return apiFetch(API_CONFIG.endpoints.committee);
}

/**
 * Fetch gallery items
 * DRF endpoint: GET /api/gallery/
 */
async function fetchGallery() {
  return apiFetch(API_CONFIG.endpoints.gallery);
}

/**
 * Submit supporter / join form
 * DRF endpoint: POST /api/supporter/
 */
async function submitSupporterForm(data) {
  if (API_CONFIG.mode === 'local') {
    // Simulate success in dev mode
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
  }
  return apiFetch(API_CONFIG.endpoints.supporter, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Submit contact form
 * DRF endpoint: POST /api/contact/
 */
async function submitContactForm(data) {
  if (API_CONFIG.mode === 'local') {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
  }
  return apiFetch('/contact/', { method: 'POST', body: JSON.stringify(data) });
}

/**
 * Fetch stats for homepage counter
 * DRF endpoint: GET /api/stats/
 */
async function fetchStats() {
  return apiFetch(API_CONFIG.endpoints.stats);
}

/**
 * Fetch notice ticker items
 * DRF endpoint: GET /api/notices/
 */
async function fetchNotices() {
  return apiFetch(API_CONFIG.endpoints.notices);
}

/* ---- Exports (global scope for browser use) ---- */
window.API = {
  fetchEvents,
  fetchEventById,
  fetchCommittee,
  fetchGallery,
  submitSupporterForm,
  submitContactForm,
  fetchStats,
  fetchNotices,
};
