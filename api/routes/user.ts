import { UserModel } from '../models/user';
import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

userRouter.post('/login', (req: Request, res: Response, next: NextFunction): any => {
  let fetchedUser: any;
  UserModel.findOne({ email: req.body.email })
    .then((user): any => {
      if (!user) {
        return res.status(401).json({
          message: 'Authentication failed yo!'
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result): any => {
      if (!result) {
        return res.status(401).json({
          message: 'Authentication failed yo!'
        });
      }
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret_this_should_be_really_long', { expiresIn: '1h' });
      console.log('api just generated a fresh new token: ' + token);
      res.status(200).json({ token: token, expiresIn: 3600 }); //send 3600 second duration (1 hour)
    })
    .catch((err) => {
      return res.status(401).json({
        message: 'Authentication failed yo!'
      });
    });
});
