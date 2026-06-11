import { Request, Response } from 'express';
import { calculateParlay, ParlayLeg, ValidationError } from '../services/parlay.service';

export function calculateParlayHandler(req: Request, res: Response): void {
  try {
    const { legs } = req.body as { legs: ParlayLeg[] };
    const result = calculateParlay(legs);
    res.json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
