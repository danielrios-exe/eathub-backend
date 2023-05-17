import { Router } from 'express';
import quantityRouter from './menu-router';

function buildRouter(app: Router) {
  const router: Router = Router();

  // Menu router
  router.use('/menu', quantityRouter);

  // Root router
  app.use('/api', router);
}

export default buildRouter;
