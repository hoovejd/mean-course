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
  const url = `${req.protocol}://${req.get('host')}`;
  const post = new PostModel({
    title: req.body.title,
    content: req.body.content,
    imagePath: `${url}/images/${req.file.filename}`
  });
  post.save().then(
    // using the spread operator (...) to copy all properties of createdPost object into new post object
    (createdPost) => res.status(201).json({ message: 'Post added successfully', post: { ...createdPost, id: createdPost._id } })
  );
});

postsRouter.put('/:id', multer({ storage: diskStorage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    imagePath = `${url}/images/${req.file.filename}`;
  }
  const post = new PostModel({ _id: req.body.id, title: req.body.title, content: req.body.content, imagePath: imagePath });
  PostModel.updateOne({ _id: req.params['id'] }, post).then((result) => {
    res.status(200).json({ message: 'Update successful!' });
  });
});

postsRouter.get('', (req: Request, res: Response, next: NextFunction) => {
  const pageSize: number = +req.query['pageSize']; // The + symbol converts to number
  const currentPage: number = +req.query['page'];
  const postQuery = PostModel.find(); // default to find everything
  let fetchedPosts: any;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((foundPosts) => {
      fetchedPosts = foundPosts;
      return PostModel.count();
    })
    .then((count) => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        postsCount: count
      });
    });
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
    res.status(200).json({ message: 'Post deleted!' });
  });
});
