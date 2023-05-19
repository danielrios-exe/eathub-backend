import { Router, Request, Response } from 'express';
import MealTypeService from '../services/mealType-service';
import Errors from '../errors/errors';

const router = Router();
const mealTypeService = new MealTypeService();

router.get('/mealTypes', async (_req: Request, res: Response) => {
  console.log('GET /api/menu/mealTypes');
  try {
    const mealTypes = await mealTypeService.get();
    res.send({ success: true, data: mealTypes });
  } catch (error) {
    if (error === Errors.NO_MEAL_TYPES_FOUND) {
      return res.status(404).send({ success: false, message: error });
    }
    res.status(500).send({ success: false, error: Errors.INTERNAL_ERROR });
  }
});

export default router;
