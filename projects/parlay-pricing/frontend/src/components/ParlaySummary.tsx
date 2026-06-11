import React from 'react';
import { ParlayResult } from '../services/api';

interface ParlaySummaryProps {
  result: ParlayResult;
  legCount: number;
}

function formatAmerican(odds: number): string {
  return odds > 0 ? `+${Math.round(odds)}` : `${Math.round(odds)}`;
}

export default function ParlaySummary({ result, legCount }: ParlaySummaryProps) {
  const { fairProbability, decimalOdds, americanOdds, payoutPer100 } = result;

  return (
    <div className="summary-card">
      <div className="summary-header">
        <span className="summary-title">{legCount}-Leg Parlay Result</span>
        <span className="summary-badge">Fair Value</span>
      </div>

      <div className="summary-grid">
        <div className="summary-stat primary">
          <span className="stat-label">American Odds</span>
          <span className="stat-value american">{formatAmerican(americanOdds)}</span>
        </div>

        <div className="summary-stat">
          <span className="stat-label">Decimal Odds</span>
          <span className="stat-value">{decimalOdds.toFixed(3)}</span>
        </div>

        <div className="summary-stat">
          <span className="stat-label">Fair Probability</span>
          <span className="stat-value">{(fairProbability * 100).toFixed(2)}%</span>
        </div>

        <div className="summary-stat highlight">
          <span className="stat-label">Payout on $100</span>
          <span className="stat-value payout">${payoutPer100.toFixed(2)}</span>
        </div>
      </div>

      <div className="summary-footer">
        <span className="footer-note">
          These are <strong>fair/no-vig odds</strong> based on the implied probabilities you entered.
          Actual sportsbook payouts will be lower.
        </span>
      </div>
    </div>
  );
}
