import * as dotenv from 'dotenv';

// Loads .env file content into process.env
dotenv.config();

// Global project's config object
const Variables = {
  environment: process.env.ENVIRONMENT || 'development',
  port: process.env.PORT,
  db: {
    server: process.env.DB_SERVER,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

export default Variables;
