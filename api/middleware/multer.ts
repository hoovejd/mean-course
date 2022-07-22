import multer, { StorageEngine } from 'multer';

const MIME_TYPE_MAP: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

// Multer disk storage configuration
const diskStorage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb): void => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('API:Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'api/images');
  },
  filename: (req, file, cb): void => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, `${name}-${Date.now()}.${ext}`);
  }
});

module.exports = multer({ storage: diskStorage }).single('image');
