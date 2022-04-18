import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PostModel } from './models/post';
import mongoose from 'mongoose';

mongoose
  .connect('mongodb://localhost:27017/test')
  .then(() => console.log('Connected to database!'))
  .catch(() => console.log('DB connection failed yo!'));

export const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  const post = new PostModel({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((createdPost) => res.status(201).json({ message: 'Post added successfully', postId: createdPost._id }));
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new PostModel({ _id: req.body.id, title: req.body.title, content: req.body.content });
  PostModel.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: 'Update successful!' });
  });
});

app.get('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  PostModel.find().then((foundPosts) =>
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: foundPosts
    })
  );
});

app.get('/api/posts/:id', (req, res, next) => {
  PostModel.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  PostModel.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});
