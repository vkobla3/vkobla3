export type OddsFormat = 'american' | 'decimal' | 'probability';

export interface ParlayLeg {
  odds: number;
  format: OddsFormat;
}

export interface ParlayResult {
  fairProbability: number;
  decimalOdds: number;
  americanOdds: number;
  payoutPer100: number;
  legProbabilities: number[];
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

const VALID_FORMATS: string[] = ['american', 'decimal', 'probability'];

function validateLeg(odds: number, format: OddsFormat, index: number): void {
  const label = `Leg ${index + 1}`;

  if (!VALID_FORMATS.includes(format)) {
    throw new ValidationError(`${label}: format must be "american", "decimal", or "probability"`);
  }

  if (!isFinite(odds)) throw new ValidationError(`${label}: odds must be a finite number`);

  if (format === 'american') {
    // ±100 are valid even-money lines; only reject the undefined interior (-100, 100)
    if (odds === 0 || (odds > -100 && odds < 100)) {
      throw new ValidationError(`${label}: American odds must be ≤ -100 or ≥ +100`);
    }
  } else if (format === 'decimal') {
    // odds = 1.0 would imply certainty (probability = 1), causing division by zero downstream
    if (odds <= 1.0) throw new ValidationError(`${label}: decimal odds must be > 1.0`);
  } else if (format === 'probability') {
    if (odds <= 0 || odds >= 100) {
      throw new ValidationError(`${label}: implied probability must be between 0 and 100 (exclusive)`);
    }
  }
}

function toImpliedProbability(odds: number, format: OddsFormat): number {
  switch (format) {
    case 'american':
      return odds > 0 ? 100 / (odds + 100) : Math.abs(odds) / (Math.abs(odds) + 100);
    case 'decimal':
      return 1 / odds;
    case 'probability':
      return odds / 100;
  }
}

function toAmericanOdds(prob: number): number {
  if (prob <= 0 || prob >= 1) {
    throw new ValidationError('Combined parlay probability is outside the valid range (0, 1)');
  }
  if (prob >= 0.5) {
    return -Math.round((prob / (1 - prob)) * 100);
  }
  return Math.round(((1 - prob) / prob) * 100);
}

export function calculateParlay(legs: ParlayLeg[]): ParlayResult {
  if (!Array.isArray(legs) || legs.length < 2) {
    throw new ValidationError('A parlay requires at least 2 legs');
  }

  legs.forEach((leg, i) => validateLeg(leg.odds, leg.format, i));

  const legProbabilities = legs.map(leg => toImpliedProbability(leg.odds, leg.format));
  const fairProbability = legProbabilities.reduce((acc, p) => acc * p, 1);
  const decimalOdds = 1 / fairProbability;
  const americanOdds = toAmericanOdds(fairProbability);
  const payoutPer100 = (decimalOdds - 1) * 100;

  return {
    fairProbability,
    decimalOdds,
    americanOdds,
    payoutPer100,
    legProbabilities,
  };
}
