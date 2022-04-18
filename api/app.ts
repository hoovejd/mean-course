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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  const post = new PostModel({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  console.log(post);
  res.status(201).json({ message: 'Post added successfully' });
});

app.get('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  PostModel.find().then((foundPosts) =>
    res.status(200).json({
      message: 'Posts fetched successfully!',
      posts: foundPosts
    })
  );
});

app.delete('/api/posts/:id', (req, res, next) => {
  PostModel.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: 'Post deleted!' });
  });
});
