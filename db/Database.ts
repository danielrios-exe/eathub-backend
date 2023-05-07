import { Connection } from 'tedious';
import Variables from '../config/variables';

class Database {
  private static connection: Connection;

  private constructor() {}

  public static getInstance() {
    if (!Database.connection) {
      const config = {
        server: Variables.db.server,
        authentication: {
          type: 'default',
          options: {
            userName: Variables.db.username,
            password: Variables.db.password,
          },
        },
        options: {
          encrypt: true,
          database: Variables.db.database,
        },
      };

      Database.connection = new Connection(config);
      Database.connection.connect((err) => {
        if (err) {
          console.error('Error connecting to database: ', err);
        } else {
          console.log('Database connected');
        }
      });
    }
    return Database.connection;
  }
}

export default Database;
