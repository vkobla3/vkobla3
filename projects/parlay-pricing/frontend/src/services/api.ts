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

export interface ApiError {
  error: string;
}

export async function calculateParlay(legs: ParlayLeg[]): Promise<ParlayResult> {
  const res = await fetch('/api/parlay/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ legs }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as ApiError).error ?? 'Unknown error');
  }
  return data as ParlayResult;
}
