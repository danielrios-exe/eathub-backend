import { Router, Request, Response } from 'express';
import MealTypeService from '../services/mealType-service';
import Errors from '../errors/errors';
import AuthenticationService from '../services/authentication-service';

const router = Router();
const mealTypeService = new MealTypeService();

router.get('/mealTypes', async (req: Request, res: Response) => {
  console.log('GET /api/menu/mealTypes');
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const isAuthorized = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const mealTypes = await mealTypeService.get();
    res.send({ success: true, data: mealTypes });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(404).send({ success: false, message: error });
    }
    if (error === Errors.NO_MEAL_TYPES_FOUND) {
      return res.status(404).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: Errors.INTERNAL_ERROR });
  }
});

export default router;
