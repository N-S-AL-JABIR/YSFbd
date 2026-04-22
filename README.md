# YourOrg – Student Organization Website Frontend

A modern, responsive, animated frontend for a Bangladesh-based student organization.  
Built with **pure HTML, CSS, and JavaScript** — no frameworks required.

---

## 📁 Folder Structure

```
frontend/
├── index.html                  # Homepage
├── pages/
│   ├── about.html              # About page
│   ├── committee.html          # Committee members
│   ├── events.html             # Events listing with filter
│   ├── event-details.html      # Single event detail (URL param: ?id=N)
│   ├── gallery.html            # Photo gallery with lightbox
│   ├── contact.html            # Contact form
│   └── supporter.html          # Join/membership form
│
├── components/
│   ├── navbar.html             # Injected navbar (dark mode, lang toggle)
│   ├── footer.html             # Injected footer
│   └── loader.html             # Page loader overlay
│
├── assets/
│   ├── css/
│   │   ├── variables.css       # CSS custom properties (light + dark)
│   │   ├── animations.css      # Keyframes + scroll reveal
│   │   ├── style.css           # Main stylesheet
│   │   └── responsive.css      # Mobile-first breakpoints
│   │
│   ├── js/
│   │   ├── main.js             # Global init, theme, lang, component loader
│   │   ├── api.js              # All fetch() calls (switch local ↔ DRF)
│   │   ├── ui.js               # Card renderers, skeletons, pagination
│   │   ├── events.js           # Events list + filter + detail
│   │   ├── gallery.js          # Gallery grid + lightbox
│   │   ├── committee.js        # Committee grouped render
│   │   └── form.js             # Validation + submission
│   │
│   ├── images/                 # Place hero-bg.jpg, logo.png etc. here
│   ├── videos/
│   └── icons/                  # favicon.ico
│
├── data/                       # Temporary JSON (replace with DRF later)
│   ├── events.json
│   ├── committee.json
│   ├── gallery.json
│   ├── notices.json
│   └── stats.json
│
└── README.md
```

---

## 🚀 Quick Start

### Option 1 – VS Code Live Server
1. Open folder in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option 2 – Python
```bash
cd frontend
python -m http.server 8080
# Visit http://localhost:8080
```

### Option 3 – Node
```bash
npx serve frontend
```

> **Important:** Must be served via HTTP (not `file://`) for `fetch()` to work.

---

## 🌙 Dark Mode
Stored in `localStorage` as `theme`. Toggle via the 🌙 button in the navbar.

## 🇧🇩 Language Toggle (EN / বাংলা)
All UI text uses `data-en` / `data-bn` attributes.  
Stored in `localStorage` as `lang`. Toggle via the **EN / বাংলা** button.

---

## 🔌 Switching to DRF Backend

In `assets/js/api.js`, change:
```js
mode: 'local'   →   mode: 'remote'
remoteBase: 'https://api.yourorg.org'  // ← your Django domain
```

Expected DRF endpoints:
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/events/` | List events |
| GET | `/api/events/:id/` | Event detail |
| GET | `/api/committee/` | Committee members |
| GET | `/api/gallery/` | Gallery items |
| GET | `/api/notices/` | Notice ticker |
| GET | `/api/stats/` | Stat counters |
| POST | `/api/supporter/` | Membership form |
| POST | `/api/contact/` | Contact form |

---

## 📦 Required Images (add to `assets/images/`)
| File | Used In |
|------|---------|
| `logo.png` | Navbar |
| `logo-white.png` | Footer |
| `hero-bg.jpg` | Homepage hero |
| `placeholder-event.jpg` | Event cards |
| `placeholder-avatar.png` | Committee cards |
| `placeholder-gallery.jpg` | Gallery items |

---

## 🎨 Customization

Edit `assets/css/variables.css` to change brand colors:
```css
--color-primary: #1a7a4a;      /* Main green */
--color-secondary: #f4a800;    /* Accent yellow */
```

---

## 📱 Responsive Breakpoints
| Breakpoint | Screen |
|------------|--------|
| Base | Mobile (< 576px) |
| SM | 576px+ |
| MD | 768px+ |
| LG | 992px+ |
| XL | 1200px+ |

---

## ✅ Browser Support
Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
