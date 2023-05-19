import pool from '../db/Database';
import Errors from '../errors/errors';
import AuthenticationService from './authentication-service';

interface User {
  username: string;
  password: string;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roleId: number;
}

class UserService {
  /**
   * Checks if a user exists in the database
   * Used to create users
   * @param username
   * @param password
   * @returns boolean
   */
  async isUserInDB(username: string): Promise<boolean> {
    const request = await pool.query(
      `select * from "user" u where u.username = '${username}'`
    );

    return request.rowCount !== 0;
  }

  /**
   * Checks if a user is in the database
   * Used to authenticate users
   * @param username
   * @param password
   * @returns boolean
   */
  async isUserValid(username: string, password: string): Promise<boolean> {
    const authService = new AuthenticationService();
    const request = await pool.query(
      `select * from "user" u where u.username = '${username}'`
    );

    if (request.rowCount === 0) {
      throw Errors.NO_USER_FOUND;
    }

    const user = request.rows[0];
    const decryptedPassword = authService.decryptor(user.password);

    return password === decryptedPassword;
  }

  async createUser(userObj: User) {
    const authService = new AuthenticationService();
    const request = await pool.query(
      `INSERT INTO "user" ` +
        `(username, password, name, last_name, email, is_active, role_id) ` +
        `VALUES ('${userObj.username}', ` +
        `'${authService.encryptor(userObj.password)}', ` +
        `'${userObj.name}', '${userObj.lastName}', '${userObj.email}', ` +
        `${userObj.isActive}, ${userObj.roleId})`
    );
    const rowCount = request.rowCount;

    if (rowCount === 0) {
      throw Errors.USER_NOT_CREATED;
    }
  }
}

export default UserService;
