import express from 'express';

export const userRouter = express.Router();

const UserController = require('../controllers/user');

userRouter.post('/signup', UserController.createUser);

userRouter.post('/login', UserController.userLogin);
