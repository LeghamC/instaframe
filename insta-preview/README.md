# 📱 InstaFrame – Instagram Profile Previewer

Preview your Instagram photo grid **before** posting. Upload photos, rearrange them via drag & drop, choose a phone frame, and compare two layout options side-by-side.

---

## ✨ Features

- **Upload photos** (drag & drop or click to browse) — up to 20MB per image
- **Reorder your grid** by dragging photos in the sidebar
- **Live Instagram-style preview** inside a realistic phone frame
- **Device picker**: iPhone 16 Pro, iPhone 16, Samsung S24 Ultra, Pixel 9 Pro
- **Layout modes**: Standard 3×3 grid or Feature layout (first photo 2×2)
- **Multiple sessions** — save different grid arrangements and come back later
- **History page** — browse all your saved sessions
- **Compare view** — put two sessions side-by-side on the same device frame
- **Captions** — add captions to each photo
- **Fully responsive** — works on desktop and mobile

---

## 🗂 Project Structure

```
insta-preview/
├── frontend/          # Vue 3 + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.vue
│   │   │   ├── DeviceFrame.vue   ← realistic phone shells
│   │   │   └── InstaProfile.vue  ← pixel-accurate Instagram UI
│   │   ├── views/
│   │   │   ├── HomeView.vue      ← session management
│   │   │   ├── PreviewView.vue   ← main preview + drag & drop
│   │   │   ├── HistoryView.vue   ← all sessions
│   │   │   └── CompareView.vue   ← side-by-side comparison
│   │   ├── store/index.js        ← Pinia state management
│   │   ├── router.js
│   │   └── assets/main.css
│   └── package.json
│
├── backend/           # Express.js REST API
│   ├── server.js      ← photo upload, session CRUD, reorder
│   └── package.json
│
├── data/
│   ├── images/        ← uploaded photos stored here
│   ├── favicon/
│   └── db.json        ← auto-created JSON database
│
└── package.json       ← root with concurrently scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or newer — https://nodejs.org

### 1. Install dependencies

```bash
# From the project root (installs both frontend & backend)
npm install
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start the app

```bash
# From the root — starts both servers
npm run dev
```

This starts:
- **Backend** on http://localhost:3001
- **Frontend** on http://localhost:5173

Open **http://localhost:5173** in your browser.

---

## 📖 How to Use

1. **Create a session** — give it a name, your Instagram handle, a bio, and a profile picture
2. **Open the session** — you land on the Preview page
3. **Upload photos** — drag & drop or click the upload zone in the left sidebar
4. **Reorder** — drag photos up/down in the sidebar list; the preview updates live
5. **Switch device** — pick iPhone 16 Pro, Samsung S24 Ultra, etc. from the sidebar
6. **Change layout** — try the Feature layout for a bold first-post highlight
7. **Save** — sessions auto-persist; click Save for a confirmation toast
8. **Compare** — go to History, tick 2 sessions, click "Compare side-by-side"

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vue 3, Vite, Vue Router, Pinia |
| Backend | Node.js, Express, Multer |
| Database | JSON flat file (zero setup) |
| Drag & Drop | SortableJS |
| Fonts | Playfair Display + DM Sans |

---

## 💡 Tips

- Upload photos in the order you want them to appear, then fine-tune with drag & drop
- The Feature layout makes the first photo span 2×2 — great for a hero shot
- Use the Compare view to test a "warm tones feed" vs a "moody dark feed"
- Sessions and photos persist between page reloads (stored in `data/`)
