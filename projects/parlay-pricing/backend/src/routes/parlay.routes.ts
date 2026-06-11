import { Router } from 'express';
import { calculateParlayHandler } from '../controllers/parlay.controller';

const router = Router();

router.post('/calculate', calculateParlayHandler);

export default router;
