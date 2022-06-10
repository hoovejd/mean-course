import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

class AuthMiddleware {
  async checkAuthMiddlewareFunction(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const token = req.headers.authorization.split(' ')[1]; // we are making the token come in on the authorization keyword in the form of "Bearer aflkj43kjh2kl3jh4l234h"
      jwt.verify(token, 'secret_this_should_be_really_long');
    } catch (error) {
      res.status(401).json({ message: 'Auth failed!' });
    }
    next();
  }
}

export default new AuthMiddleware();
