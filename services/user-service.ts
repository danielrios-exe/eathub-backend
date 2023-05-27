import pool from '../db/Database';
import Errors from '../errors/errors';
import AuthenticationService from './authentication-service';

interface User {
  id?: number;
  username: string;
  password: string;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
  roleId: number;
}

interface TokenResponse {
  isUserValid: boolean;
  user: User;
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
  async isUserValid(
    username: string,
    password: string
  ): Promise<TokenResponse> {
    const authService = new AuthenticationService();
    const request = await pool.query(
      `select * from "user" u where u.username = '${username}'`
    );

    if (request.rowCount === 0) {
      throw Errors.NO_USER_FOUND;
    }

    const user = request.rows[0];
    const decryptedPassword = authService.decryptor(user.password);
    const isUserValid = password === decryptedPassword;

    return { isUserValid, user };
  }

  async createUser(userObj: User) {
    const authService = new AuthenticationService();
    const request = await pool.query(
      `INSERT INTO "user" ` +
        `(username, password, name, last_name, email, is_active, role_id) ` +
        `VALUES ('${userObj.username}', ` +
        `'${authService.encryptor(userObj.password)}', ` +
        `'${userObj.name}', '${userObj.lastName}', '${userObj.email}', ` +
        `true, ${userObj.roleId}) returning id`
    );
    const rowCount = request.rowCount;

    if (rowCount === 0) {
      throw Errors.USER_NOT_CREATED;
    }

    const userId = request.rows[0].id;
    userObj.id = userId;

    const token = authService.createToken({
      username: userObj.username,
      password: userObj.password,
    });

    return { token, user: userObj };
  }
}

export default UserService;
