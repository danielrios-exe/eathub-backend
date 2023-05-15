import * as dotenv from 'dotenv';

interface VariablesInterface {
  environment: string;
  port: string;
  db: {
    server: string;
    username: string;
    password: string;
    database: string;
  };
  auth: {
    cipherSecret: string;
  };
}

// Loads .env file content into process.env
dotenv.config();

// Global project's config object
const Variables: VariablesInterface = {
  environment: process.env.ENVIRONMENT || 'development',
  port: process.env.PORT || '3000',
  db: {
    server: process.env.DB_SERVER || '',
    username: process.env.DB_USERNAME || '',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
  },
  auth: {
    cipherSecret: process.env.AUTH_CIPHER_KEY || '',
  },
};

export default Variables;
