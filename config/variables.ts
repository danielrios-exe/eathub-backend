import * as dotenv from 'dotenv';

// Loads .env file content into process.env
dotenv.config();

// Global project's config object
const Variables = {
  environment: process.env.ENVIRONMENT || 'development',
  port: process.env.PORT,
  db: {
    nonPooling: process.env.POSTGRES_URL_NON_POOLING,
  },
};

export default Variables;
