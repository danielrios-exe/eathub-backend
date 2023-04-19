import express from 'express';
import quantityRouter from './menuDetailQuantity-router';

function buildRouter(app: express.Express) {
  const router = express.Router();

  // Quantiy catalogue route
  router.use('/quantities', quantityRouter);

  // Root route
  app.use('/api', router);
}

export default buildRouter;
