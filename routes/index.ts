import { Router } from 'express';
import MenuRouter from './menu-router';
import AuthenticationRouter from './authentication-router';
import PostRouter from './post-router';
import ReviewRouter from './review-router';
import RestaurantRouter from './restaurant-router';

function buildRouter(app: Router) {
  const router: Router = Router();

  // Authentication router
  router.use('/auth', AuthenticationRouter);
  // Menu router
  router.use('/menu', MenuRouter);
  // Post router
  router.use('/post', PostRouter);
  // Review router
  router.use('/review', ReviewRouter);
  // Restaurant router
  router.use('/restaurant', RestaurantRouter);

  // Root router
  app.use('/api', router);
}

export default buildRouter;
