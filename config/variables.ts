import * as dotenv from 'dotenv';

interface VariablesInterface {
  environment: string;
  port: string;
  db: {
    nonPooling: string;
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
    nonPooling: process.env.POSTGRES_URL_NON_POOLING || '',
  },
  auth: {
    cipherSecret: process.env.CIPHER_SECRET || '',
  }
};

export default Variables;
