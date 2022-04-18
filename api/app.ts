import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { postsRouter } from './routes/posts';

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

app.use('/api/posts', postsRouter);
