import express from 'express';
import quantityRouter from './menuDetailQuantity-router';
import authenticationRouter from './authentication-router';

function buildRouter(app: express.Express) {
  const router = express.Router();

  // Authentication
  router.use('/token', authenticationRouter);

  // Private routes
  router.use('/quantities', quantityRouter);

  // Root route
  app.use('/api', router);
}

export default buildRouter;
