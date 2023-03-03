import cors from 'cors';
import express from 'express';
import { UnknownRoutesHandler } from './middlewares/unknowRoute.handler';
import { ExceptionsHandler } from './middlewares/exceptions.handler';
import { Logger } from 'node-colorful-logger';
import Config from './env/envParser';

import { AuthController } from './routes/auth/auth.controller';
import { BankController } from './routes/bank/bank.controller';
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('🏠')) // Home route
app.use('/auth', AuthController) // Auth routes
app.use('/bank', BankController) // Bank routes
app.all('*', UnknownRoutesHandler) // Unknow routes
app.use(ExceptionsHandler) // Exceptions handler

export default app;

