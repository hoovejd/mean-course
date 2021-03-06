import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../models/user';
import jwt from 'jsonwebtoken';

exports.createUser = (req: Request, res: Response, next: NextFunction) => {
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
        res.status(500).json({ message: `Invalid authentication credentials: ${err}` });
      });
  });
};

exports.userLogin = (req: Request, res: Response, next: NextFunction): any => {
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
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, process.env['JWT_KEY'], { expiresIn: '1h' });
      console.log('api just generated a fresh new token: ' + token);
      res.status(200).json({ token: token, expiresIn: 3600, userId: fetchedUser._id }); //send 3600 second duration (1 hour)
    })
    .catch((err) => {
      return res.status(401).json({ message: `Invalid authentication credentials: ${err}` });
    });
};
