import express from 'express';
import multer, { StorageEngine } from 'multer';
import AuthMiddleware from '../middleware/check-auth';

export const postsRouter = express.Router();

const PostController = require('../controllers/posts');

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

postsRouter.post('', AuthMiddleware.checkAuthMiddlewareFunction, multer({ storage: diskStorage }).single('image'), PostController.createPost);

postsRouter.put('/:id', AuthMiddleware.checkAuthMiddlewareFunction, multer({ storage: diskStorage }).single('image'), PostController.updatePost);

postsRouter.get('', PostController.getPosts);

postsRouter.get('/:id', PostController.getPost);

postsRouter.delete('/:id', AuthMiddleware.checkAuthMiddlewareFunction, PostController.deletePost);
