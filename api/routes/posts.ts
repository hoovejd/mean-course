import express, { NextFunction, Request, Response } from 'express';
import { PostModel } from '../models/post';
import multer, { StorageEngine } from 'multer';

export const postsRouter = express.Router();

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

postsRouter.post('', multer({ storage: diskStorage }).single('image'), (req: Request, res: Response, next: NextFunction) => {
  const post = new PostModel({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((createdPost) => res.status(201).json({ message: 'Post added successfully', postId: createdPost._id }));
});

postsRouter.put('/:id', (req, res, next) => {
  const post = new PostModel({ _id: req.body.id, title: req.body.title, content: req.body.content });
  PostModel.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: 'Update successful!' });
  });
});

postsRouter.get('', (req: Request, res: Response, next: NextFunction) => {
  PostModel.find().then((foundPosts) =>
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: foundPosts
    })
  );
});

postsRouter.get('/:id', (req, res, next) => {
  PostModel.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

postsRouter.delete('/:id', (req, res, next) => {
  PostModel.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});
