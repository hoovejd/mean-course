import express, { NextFunction, Request, Response } from 'express';

export const userRouter = express.Router();

userRouter.post('/signup', (req, res, next) => {
  //create new user
});
