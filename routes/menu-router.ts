import { Router, Request, Response } from 'express';
import MealTypeService from '../services/mealType-service';
import Errors from '../errors/errors';
import AuthenticationService from '../services/authentication-service';
import MenuService from '../services/menu-service';
const router = Router();
const mealTypeService = new MealTypeService();
const menuService = new MenuService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const isAuthorized = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const post = await menuService.create(req.body);
    res.send({ success: true, data: post });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.INVALID_TOKEN) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.FAILED_TO_CREATE_MENU) {
      return res.status(500).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('get menu');
    const requestHeader: string = req.headers['authorization'] || '';
    const { isAuthorized } = await AuthenticationService.isAuthorized(
      requestHeader
    );

    console.log(isAuthorized);

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const restaurant_id = req.query.restaurant_id as string;
    const menu = await menuService.get(restaurant_id);
    res.send({ success: true, menu: menu });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.NO_MENU_DETAILS_FOUND) {
      return res.status(404).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: Errors.INTERNAL_ERROR });
  }
});

router.get('/mealTypes', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const { isAuthorized } = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const mealTypes = await mealTypeService.get();
    res.send({ success: true, mealTypes: mealTypes });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(400).send({ success: false, message: error });
    }
    if (error === Errors.NO_MEAL_TYPES_FOUND) {
      return res.status(404).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: Errors.INTERNAL_ERROR });
  }
});

export default router;
