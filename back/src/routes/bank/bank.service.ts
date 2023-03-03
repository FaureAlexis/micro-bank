import { BadRequestException, NotFoundException, UnauthorizedException } from "../../utils/exceptions";
import db  from "../../database/db";
import { NextFunction, Request, Response } from 'express';
import { QueryResult } from "pg";
import config from '../../env/envParser';
import { Logger } from "node-colorful-logger";
import { TransactionService } from "./transaction.service";

const log = new Logger();
const transaction = new TransactionService();

interface BankBody {
  amount?: number;
  user_id?: string;
};

export class BankService {
  async getBalanceOfUser(id: string, res: Response) {
    const balance: QueryResult = await db.query("SELECT balance FROM bank_accounts WHERE user_id = $1", [id]);
    if (balance.rowCount < 1) {
      return res.status(404).json(new NotFoundException('User not found'));
    }
    return res.status(200).json({balance: balance.rows[0].balance});
  }
  async deposit(body: BankBody, res: Response) {
    if (!body.amount || !body.user_id) {
      return res.status(400).json(new BadRequestException('Missing amount or user_id'));
    }
    const balance: QueryResult = await db.query("SELECT balance, id FROM bank_accounts WHERE user_id = $1", [body.user_id]);
    if (balance.rowCount < 1) {
      const createBalance: QueryResult = await db.query("INSERT INTO bank_accounts (user_id, balance) VALUES ($1, $2)", [body.user_id, body.amount]);
      if (createBalance.rowCount === 1) {
        transaction.registerTransaction({ amount: body.amount, bank_account_id: createBalance.rows[0].id, reason: 'deposit', status: 'pending'});
        return res.status(200).json({message: 'Balance created'});
      }
      return res.status(400).json(new BadRequestException('Something went wrong'));
    }
    const newBalance: number = parseFloat(balance.rows[0].balance) + body.amount;
    const updatedBalance: QueryResult = await db.query("UPDATE bank_accounts SET balance = $1 WHERE user_id = $2", [newBalance, body.user_id]);
    if (updatedBalance.rowCount === 1) {
      transaction.registerTransaction({ amount: body.amount, bank_account_id: balance.rows[0].id, reason: 'deposit', status: 'pending'});
      return res.status(200).json({message: 'Balance updated'});
    }
    return res.status(400).json(new BadRequestException('Something went wrong'));
  }
  async withdraw(body: BankBody, res: Response) {
    if (!body.amount || !body.user_id) {
      return res.status(400).json(new BadRequestException('Missing amount or user_id'));
    }
    const balance: QueryResult = await db.query("SELECT balance, id FROM bank_accounts WHERE user_id = $1", [body.user_id]);
    if (balance.rowCount < 1) {
      return res.status(404).json(new NotFoundException('User not found'));
    }
    if (balance.rows[0].balance < body.amount) {
      return res.status(400).json(new BadRequestException('Not enough money'));
    }
    const newBalance: number = balance.rows[0].balance - body.amount;
    const updatedBalance: QueryResult = await db.query("UPDATE bank_accounts SET balance = $1 WHERE user_id = $2", [newBalance, body.user_id]);
    if (updatedBalance.rowCount === 1) {
      transaction.registerTransaction({ amount: body.amount, bank_account_id: balance.rows[0].id, reason: 'withdraw', status: 'pending'});
      return res.status(200).json({message: 'Balance updated'});
    }
    return res.status(400).json(new BadRequestException('Something went wrong'));
  }
  async getAllTransactionsOfBank(id: string, res: Response) {
    return res.status(200).json((await transaction.getTransactionsByBankAccountId(parseInt(id))).rows);
  }
};
