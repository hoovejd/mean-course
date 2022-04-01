import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { PostModel } from './models/post';

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
  console.log(post);
  res.status(201).json({ message: 'Post added successfully' });
});

app.get('/api/posts', (req: Request, res: Response, next: NextFunction) => {
  const posts = [
    {
      id: 'fadf12421l',
      title: 'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id: 'ksajflaj132',
      title: 'Second server-side post',
      content: 'This is coming from the server!'
    }
  ];
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});
