const fs = require('fs');
const path = require('path');
const multer = require('multer');

const UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
const JOB_PHOTOS_DIR = path.join(UPLOADS_ROOT, 'jobs');

fs.mkdirSync(JOB_PHOTOS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, JOB_PHOTOS_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const uploadJobPhotos = multer({ storage });

module.exports = { uploadJobPhotos };