import { Router, Request, Response } from 'express';
import Errors from '../errors/errors';
import AuthenticationService from '../services/authentication-service';
import RestaurantService from '../services/restaurant-service';

const router = Router();
const restaurantService = new RestaurantService();

router.get('/', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const { isAuthorized } = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const restaurants = await restaurantService.get();
    res.send({ success: true, restaurants });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(404).send({ success: false, message: error });
    }
    if (error === Errors.INVALID_TOKEN) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.NO_REVIEWS_FOUND) {
      return res.status(404).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: error });
  }
});

export default router;
