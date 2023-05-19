import { Router } from 'express';
import MenuRouter from './menu-router';
import AuthenticationRouter from './authentication-router';

function buildRouter(app: Router) {
  const router: Router = Router();

  // Authentication router
  router.use('/auth', AuthenticationRouter);
  // Menu router
  router.use('/menu', MenuRouter);

  // Root router
  app.use('/api', router);
}

export default buildRouter;
