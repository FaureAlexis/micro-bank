import db  from "../../database/db";
import { QueryResult } from "pg";
import config from '../../env/envParser';
import { Logger } from "node-colorful-logger";

const log = new Logger();

interface Transaction {
  amount?: number;
  status?: string;
  reason?: string;
  bank_account_id?: number;
}

export class TransactionService {
  async registerTransaction(tx: Transaction): Promise<boolean> {
    const newTransaction: QueryResult = await db.query("INSERT INTO transactions (amount, status, reason, bank_account_id) VALUES ($1, $2, $3, $4)", [tx.amount, tx.status, tx.reason, tx.bank_account_id]);
    if (newTransaction.rowCount === 1) {
      return true;
    }
    return false;
  }
  async validateTransaction(txId: number): Promise<boolean> {
    const transaction: QueryResult = await db.query("UPDATE transactions SET status = $1 WHERE id = $2", ['success', txId]);
    if (transaction.rowCount === 1) {
      return true;
    }
    return false;
  }
  async declineTransaction(txId: number): Promise<boolean> {
    const transaction: QueryResult = await db.query("UPDATE transactions SET status = $1 WHERE id = $2", ['declined', txId]);
    if (transaction.rowCount === 1) {
      return true;
    }
    return false;
  }
  async getTransactionsByBankAccountId(bankAccountId: number): Promise<QueryResult> {
    const transactions: QueryResult = await db.query("SELECT * FROM transactions WHERE bank_account_id = $1", [bankAccountId]);
    return transactions;
  }
};
