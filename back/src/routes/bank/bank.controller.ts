import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import { BadRequestException, UnauthorizedException, NotFoundException } from '../../utils/exceptions';
import { BankService } from './bank.service';

const BankController: Router = Router();
const bank = new BankService();

BankController.get('/balance/:id', (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id || req.params.id === '' || req.params.id === 'undefined') {
    throw new BadRequestException('Missing id');
  }
  return bank.getBalanceOfUser(req.params.id, res);
});

BankController.post('/deposit', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    throw new BadRequestException('Missing body');
  }
  return bank.deposit(req.body, res);
});

BankController.post('/withdraw', (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) {
    throw new BadRequestException('Missing body');
  }
  return bank.withdraw(req.body, res);
});

BankController.get('/transactions/:id', (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id || req.params.id === '' || req.params.id === 'undefined') {
    throw new BadRequestException('Missing id');
  }
  return bank.getAllTransactionsOfBank(req.params.id, res);
});

export { BankController };
