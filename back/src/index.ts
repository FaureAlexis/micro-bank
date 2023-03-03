import app from './app';
import { Logger } from 'node-colorful-logger';
import Config from './env/envParser';
import db from './database/db';
const logger = new Logger();

const port: number = Config.APP_PORT ? Config.APP_PORT : 3000;

app.listen(port, () => logger.info(`Server started on port ${port}`));

