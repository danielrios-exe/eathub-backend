import CryptoJS from 'crypto-js';
import pool from '../db/Database';
import Variables from '../config/variables';
import Errors from '../errors/errors';
import { sign, verify } from 'jsonwebtoken';

class AuthenticationService {
  /**
   * Checks if the request token is valid
   */
  static async isAuthorized(authHeader: string): Promise<boolean> {
    const token: string = this.getBearerToken(authHeader);
    const verifiedToken = verify(token, Variables.auth.authSecret);

    if (!verifiedToken) {
      throw Errors.INVALID_TOKEN;
    }

    return true;
  }

  /**
   * Creates a token
   * @param payload
   * @returns
   */
  createToken(payload: { username: string; password: string }) {
    //create token
    const token = sign(payload, Variables.auth.authSecret);
    return token;
  }

  /**
   * Takes an authorization header and
   * returns the token value
   * @param authHeader raw authorization header
   * @returns token
   */
  static getBearerToken(authHeader: string): string {
    const type: string = authHeader.split(' ')[0];
    const token: string = authHeader.split(' ')[1];

    // Handle correct type and content
    if (type !== 'Bearer' || !token) {
      // Bad request
      throw Errors.INVALID_AUTH_HEADER;
    }

    return token;
  }

  /**
   * Takes an authorization header and
   * returns a decoded string containing username and password
   * @param authHeader raw authorization header
   * @returns decoded string or throws an Errors.INVALID_AUTH_HEADER
   */
  getDecodedString(authHeader: string): string {
    const type: string = authHeader.split(' ')[0];
    const encodedString: string = authHeader.split(' ')[1];

    // Handle correct type and content
    if (type !== 'Basic' || !encodedString) {
      // Bad request
      throw Errors.INVALID_AUTH_HEADER;
    }

    // Decode base64 --> string
    const decodedString: string = Buffer.from(
      encodedString,
      'base64'
    ).toString();
    return decodedString;
  }

  /**
   * Takes a decoded string and
   * returns username and password or
   * throws an Errors.INVALID_AUTH_HEADER
   * @param decodedString decoded authorization header
   * @returns username and password or throws an Errors.INVALID_AUTH_HEADER
   */
  getCredentials(decodedString: string): {
    username: string;
    password: string;
  } {
    const username: string = decodedString.split(':')[0];
    const password: string = decodedString.split(':')[1];

    // Check that username and password are present
    if (!username || !password) {
      // Bad request
      throw Errors.INVALID_AUTH_HEADER;
    }

    return { username, password };
  }

  encryptor(password: string) {
    const encryptedString = CryptoJS.AES.encrypt(
      password,
      Variables.auth.cipherSecret
    ).toString();
    return encryptedString;
  }

  decryptor(password: string) {
    const decryptedWordArray = CryptoJS.AES.decrypt(
      password,
      Variables.auth.cipherSecret
    );
    const decryptedString = decryptedWordArray.toString(CryptoJS.enc.Utf8);
    return decryptedString;
  }
}

export default AuthenticationService;
