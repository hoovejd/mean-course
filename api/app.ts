import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { postsRouter } from './routes/posts';
import { userRouter } from './routes/user';
var path = require('path');

mongoose
  .connect(process.env['MONGO_CONNECTION_STRING'])
  .then(() => console.log('Connected to database!'))
  .catch(() => console.log('DB connection failed yo!'));

declare global {
  namespace Express {
    interface Request {
      userData?: { email: string; userId: string };
    }
  }
}

export const app = express();
app.use(express.json());
app.use('/images', express.static(path.join('api/images')));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRouter);
app.use('/api/user', userRouter);
