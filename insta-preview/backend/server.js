const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/data', express.static(path.join(__dirname, '../data')));

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '../data/images');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// DB file for persistence
const DB_FILE = path.join(__dirname, '../data/db.json');
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) return { sessions: [], photos: [] };
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
};
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// ─── ROUTES ───────────────────────────────────────────────

// Upload photo(s)
app.post('/api/upload', upload.array('photos', 20), (req, res) => {
  const db = readDB();
  const sessionId = req.body.sessionId || 'default';
  const newPhotos = req.files.map((f, i) => ({
    id: `photo_${Date.now()}_${i}`,
    filename: f.filename,
    url: `/data/images/${f.filename}`,
    originalName: f.originalname,
    sessionId,
    uploadedAt: new Date().toISOString(),
    caption: req.body.caption || '',
    position: db.photos.filter(p => p.sessionId === sessionId).length + i
  }));
  db.photos.push(...newPhotos);
  writeDB(db);
  res.json({ success: true, photos: newPhotos });
});

// Get all photos for a session
app.get('/api/photos/:sessionId', (req, res) => {
  const db = readDB();
  const photos = db.photos
    .filter(p => p.sessionId === req.params.sessionId)
    .sort((a, b) => a.position - b.position);
  res.json(photos);
});

// Reorder photos (drag & drop)
app.put('/api/photos/reorder', (req, res) => {
  const { sessionId, orderedIds } = req.body;
  const db = readDB();
  orderedIds.forEach((id, idx) => {
    const photo = db.photos.find(p => p.id === id && p.sessionId === sessionId);
    if (photo) photo.position = idx;
  });
  writeDB(db);
  res.json({ success: true });
});

// Delete all photos for a session
app.delete('/api/photos/session/:sessionId', (req, res) => {
  const db = readDB()
  const toDelete = db.photos.filter(p => p.sessionId === req.params.sessionId)
  toDelete.forEach(photo => {
    const filepath = path.join(uploadsDir, photo.filename)
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath)
  })
  db.photos = db.photos.filter(p => p.sessionId !== req.params.sessionId)
  writeDB(db)
  res.json({ success: true })
})

// Delete photo
app.delete('/api/photos/:id', (req, res) => {
  const db = readDB();
  const photo = db.photos.find(p => p.id === req.params.id);
  if (photo) {
    // Delete file
    const filepath = path.join(uploadsDir, photo.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    db.photos = db.photos.filter(p => p.id !== req.params.id);
    writeDB(db);
  }
  res.json({ success: true });
});

// Update caption
app.put('/api/photos/:id/caption', (req, res) => {
  const db = readDB();
  const photo = db.photos.find(p => p.id === req.params.id);
  if (photo) {
    photo.caption = req.body.caption;
    writeDB(db);
  }
  res.json({ success: true });
});

// ─── SESSION (history) ROUTES ──────────────────────────────

// Create session
app.post('/api/sessions', (req, res) => {
  const db = readDB();
  const session = {
    id: `session_${Date.now()}`,
    name: req.body.name || `Session ${db.sessions.length + 1}`,
    username: req.body.username || 'yourhandle',
    bio: req.body.bio || '',
    profilePic: req.body.profilePic || '',
    createdAt: new Date().toISOString()
  };
  db.sessions.push(session);
  writeDB(db);
  res.json(session);
});

// Get all sessions
app.get('/api/sessions', (req, res) => {
  const db = readDB();
  res.json(db.sessions);
});

// Update session
app.put('/api/sessions/:id', (req, res) => {
  const db = readDB();
  const session = db.sessions.find(s => s.id === req.params.id);
  if (session) {
    Object.assign(session, req.body);
    writeDB(db);
  }
  res.json({ success: true, session });
});

// Delete session + its photos
app.delete('/api/sessions/:id', (req, res) => {
  const db = readDB();
  const photos = db.photos.filter(p => p.sessionId === req.params.id);
  photos.forEach(photo => {
    const filepath = path.join(uploadsDir, photo.filename);
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  });
  db.photos = db.photos.filter(p => p.sessionId !== req.params.id);
  db.sessions = db.sessions.filter(s => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Upload profile picture
app.post('/api/profile-pic', upload.single('profilePic'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ url: `/data/images/${req.file.filename}` });
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
