import { Pool } from 'pg';
import Variables from '../config/variables';

const pool = new Pool({
  connectionString: Variables.db.nonPooling + '?sslmode=require',
});

export default pool;
