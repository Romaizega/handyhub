const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
const AVATAR_DIR = path.join(UPLOADS_ROOT, 'avatars');

fs.mkdirSync(AVATAR_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, AVATAR_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const uploadAvatar = multer({ storage });

module.exports = { uploadAvatar };