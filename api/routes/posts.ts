import express, { NextFunction, Request, Response } from 'express';
import { PostModel } from '../models/post';

export const postsRouter = express.Router();

postsRouter.post('', (req: Request, res: Response, next: NextFunction) => {
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
