import { BadRequestException, NotFoundException, UnauthorizedException } from "../../utils/exceptions";
import db  from "../../database/db";
import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { QueryResult } from "pg";
import jwt from 'jsonwebtoken';
import config from '../../env/envParser';
import { Logger } from "node-colorful-logger";

const log = new Logger();

interface AuthBody {
  email?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  role?: string;
}

export class AuthService {
  async register(body: AuthBody, res: Response) {
    if (!body.email || !body.password || !body.firstname || !body.lastname || !body.role) {
      return res.status(400).json(new BadRequestException('Email and password are required'));
    }
    const isUser: QueryResult = await db.query("SELECT * FROM users WHERE email = $1", [body.email]);
    if (isUser.rowCount > 0) {
      return res.status(401).json(new BadRequestException('Email already exists'));
    }
    const pwd: string = body.password as string;
    const hash: string = await bcrypt.hash(pwd, 10);
    const registredUser: QueryResult = await db.query("INSERT INTO users (first_name, last_name, email, password, role)  VALUES ($1, $2, $3, $4, $5)", [body.firstname, body.lastname, body.email, hash, body.role]);
    if (registredUser.rowCount === 1) {
      log.info(`User ${body.email} registered`);
      return res.status(200).json({ message: 'User registered' });
    }
    return res.status(400).json(new BadRequestException('Something went wrong'));
  }
  async login(body: AuthBody, res: Response, req: Request) {
    if (!body.email || !body.password) {
      return res.status(400).json(new BadRequestException('Email and password are required'));
    }
    const User: QueryResult = await db.query("SELECT id, password FROM users WHERE email = $1", [body.email]);
    if (User.rowCount < 1) {
      return res.status(404).json(new NotFoundException('User not found'));
    }
    const pwd: string = body.password as string;
    const hash: string = User.rows[0].password;
    const match: boolean = await bcrypt.compare(pwd, hash);
    if (match) {
      const token = jwt.sign({id: User.rows[0].id}, config.JWT_SECRET as string, {expiresIn: '24h'});
      return res.status(200).json({token: token, userId: User.rows[0].id});
    } else {
      return res.status(401).json(new UnauthorizedException('Wrong password'));
    }
  }
};
