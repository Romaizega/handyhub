const fs = require('fs');
const path = require('path');
const multer = require('multer');


const COMMENT_DIR = path.join(process.cwd(), 'uploads/comments');

fs.mkdirSync(COMMENT_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, COMMENT_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname || '');
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const uploadCommentPhotos = multer({ storage });

module.exports = { uploadCommentPhotos };
