import { Router, Request, Response } from 'express';
import Errors from '../errors/errors';
import AuthenticationService from '../services/authentication-service';
import ReviewService from '../services/review-service';

const router = Router();
const reviewService = new ReviewService();

router.post('/', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const isAuthorized = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const post = await reviewService.create(req.body);
    res.send({ success: true, data: post });
  } catch (error) {
    if (error === Errors.INVALID_AUTH_HEADER) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.INVALID_TOKEN) {
      return res.status(401).send({ success: false, message: error });
    }
    if (error === Errors.FAILED_TO_CREATE_REVIEW) {
      return res.status(500).send({ success: false, message: error });
    }

    res.status(500).send({ success: false, error: error });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const requestHeader: string = req.headers['authorization'] || '';
    const isAuthorized = await AuthenticationService.isAuthorized(
      requestHeader
    );

    if (!isAuthorized) {
      return res.status(401).send({ success: false, message: 'Unauthorized.' });
    }

    const user_id = req.query.user_id as string;
    const type = req.query.type as string;
    const posts = await reviewService.get(user_id, type);
    res.send({ success: true, data: posts });
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
