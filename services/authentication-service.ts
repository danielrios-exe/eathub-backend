import CryptoJS from 'crypto-js';
import Database from '../db/Database';
import Variables from '../config/variables';

class AuthenticationService {
  constructor() {}

  // Connection to database
  databaseInstance = Database.getInstance();

  private encryptor(password: string) {
    const encryptedString = CryptoJS.AES.encrypt(
      password,
      Variables.auth.cipherSecret
    ).toString();
    return encryptedString;
  }

  private decryptor(password: string) {
    const decryptedWordArray = CryptoJS.AES.decrypt(
      password,
      Variables.auth.cipherSecret
    );
    const decryptedString = decryptedWordArray.toString(CryptoJS.enc.Utf8);
    return decryptedString;
  }
}

export default AuthenticationService;
