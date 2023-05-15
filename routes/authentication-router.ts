import express from 'express';
import AuthenticationService from '../services/authentication-service';
import UserService from '../services/user-service';

const router = express.Router();
const authService = new AuthenticationService();
const userService = new UserService();

router.get('/', (req, res) => {
  // Get raw authorization header
  const authHeader: string = req.headers.authorization || '';
  const type: string = authHeader.split(' ')[0];
  const encodedString: string = authHeader.split(' ')[1];

  // Handle correct type and content
  if (type !== 'Basic' || !encodedString) {
    // Bad request
    return res.status(400);
  }

  // Decode base64 --> string
  const decodedString: string = Buffer.from(encodedString, 'base64').toString();

  // Get username and password
  const username: string = decodedString.split(':')[0];
  const password: string = decodedString.split(':')[1];

  // Check that username and password are present
  if (!username || !password) {
    // Bad request
    return res.status(400);
  }

  userService.isUserValid(username, password);
  res.send('Done');
});

export default router;
