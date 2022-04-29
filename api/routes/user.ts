import { UserModel } from '../models/user';
import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

export const userRouter = express.Router();

userRouter.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new UserModel({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err
        });
      });
  });
});
