import dotenv from 'dotenv';

dotenv.config();

interface ENV {
  APP_PORT : number | undefined;
  DB_IP : string | undefined;
  DB_PORT : number | undefined;
  DB_USER : string | undefined;
  DB_PASSWORD : string | undefined;
  DB_NAME : string | undefined;
  JWT_SECRET : string | undefined;
}

interface Config {
  APP_PORT : number;
  DB_IP : string;
  DB_PORT : number;
  DB_USER : string;
  DB_PASSWORD : string;
  DB_NAME : string;
  JWT_SECRET : string;
}

const getConfig = (): ENV => {
  return {
    APP_PORT: parseInt(process.env.APP_PORT as string),
    DB_IP: process.env.DB_IP,
    DB_PORT: parseInt(process.env.DB_PORT as string),
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    JWT_SECRET: process.env.JWT_SECRET,
  };
}

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config: ENV = getConfig();
const sanitizedConfig: Config = getSanitzedConfig(config);
export default sanitizedConfig;
