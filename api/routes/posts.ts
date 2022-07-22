import express from 'express';
import AuthMiddleware from '../middleware/check-auth';

const multerExtractFile = require('../middleware/multer');
const PostController = require('../controllers/posts');

export const postsRouter = express.Router();

postsRouter.post('', AuthMiddleware.checkAuthMiddlewareFunction, multerExtractFile, PostController.createPost);

postsRouter.put('/:id', AuthMiddleware.checkAuthMiddlewareFunction, multerExtractFile, PostController.updatePost);

postsRouter.get('', PostController.getPosts);

postsRouter.get('/:id', PostController.getPost);

postsRouter.delete('/:id', AuthMiddleware.checkAuthMiddlewareFunction, PostController.deletePost);
