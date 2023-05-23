import express from 'express';
import AuthenticationService from '../services/authentication-service';
import UserService from '../services/user-service';
import Errors from '../errors/errors';

const router = express.Router();
const authService = new AuthenticationService();
const userService = new UserService();

router.post('/token', async (req, res) => {
  try {
    const authHeader: string = req.headers.authorization || '';
    const decodedString: string = authService.getDecodedString(authHeader);
    const { username, password } = authService.getCredentials(decodedString);
    const isUserValid = await userService.isUserValid(username, password);

    if (isUserValid) {
      const token = authService.createToken({ username, password });
      return res.send(token);
    } else {
      return res
        .status(401)
        .send({ success: false, message: 'Invalid credentials.' });
    }
  } catch (error) {
    if (error === Errors.NO_USER_FOUND) {
      return res.status(401).send({ success: false, message: error });
    }

    res.status(400).send({ success: false, message: error });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const isUserInDB = await userService.isUserInDB(username);

    if (isUserInDB) {
      res.status(409).send(Errors.USER_ALRADY_IN_DB);
    } else {
      await userService.createUser(req.body);
      return res.status(201).send({ success: true, message: 'User created.' });
    }
  } catch (error) {
    if (error === Errors.NO_USER_FOUND) {
      return res.status(401).send({ success: false, message: error });
    }

    res.status(400).send({ success: false, message: error });
  }
});

export default router;
