import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { BadRequestException, UnauthorizedException, NotFoundException } from '../../utils/exceptions';
import { AuthService } from './auth.service';

const AuthController: Router = Router();
const auth = new AuthService();

AuthController.post('/register', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    throw new BadRequestException('Missing body');
  }
  return auth.register(req.body, res);
});

AuthController.post('/login', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    throw new BadRequestException('Missing body');
  }
  return auth.login(req.body, res, req);
});

export { AuthController };
