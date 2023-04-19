import express from 'express';
import QuantityService from '../services/menuDetailQuantity-service';

const router = express.Router();
const service = new QuantityService();

router.get('/', (req, res) => {
  const menuDetailQuantities = service.get();
  res.json(menuDetailQuantities);
});

export default router;
