import Database from '../db/Database';
import { Request } from 'tedious';

class UserService {
  constructor() {}

  // Connection to database
  databaseInstance = Database.getInstance();

  /**
   * TODO: Check if user is valid
   */
  isUserValid(username: string, password: string): boolean {
    return true;
  }
}

export default UserService;
