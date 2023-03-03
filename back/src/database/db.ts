import {Client as PostgresClient} from 'pg';
import config from '../env/envParser';
import {Logger} from 'node-colorful-logger';
const logger = new Logger();

const client = new PostgresClient({
  host: config.DB_IP,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  port: config.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect((err) => {
  if (err) {
    logger.error('Erreur lors de la connexion à la base de données:' + err.stack);
  } else {
    logger.success('Connexion à la base de données réussie.');
  }
});

export default client;
