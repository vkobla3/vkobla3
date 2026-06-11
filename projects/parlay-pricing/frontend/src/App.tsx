import React, { useState } from 'react';
import LegInput from './components/LegInput';
import ParlaySummary from './components/ParlaySummary';
import { calculateParlay, OddsFormat, ParlayResult } from './services/api';

interface Leg {
  value: string;
  format: OddsFormat;
}

const DEFAULT_LEGS: Leg[] = [
  { value: '', format: 'american' },
  { value: '', format: 'american' },
];

export default function App() {
  const [legs, setLegs] = useState<Leg[]>(DEFAULT_LEGS);
  const [result, setResult] = useState<ParlayResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function updateLeg(index: number, value: string, format: OddsFormat) {
    setLegs(prev => prev.map((leg, i) => (i === index ? { value, format } : leg)));
    setResult(null);
    setError(null);
  }

  function addLeg() {
    setLegs(prev => [...prev, { value: '', format: prev[prev.length - 1].format }]);
    setResult(null);
  }

  function removeLeg(index: number) {
    setLegs(prev => prev.filter((_, i) => i !== index));
    setResult(null);
    setError(null);
  }

  async function handleCalculate() {
    setError(null);
    setResult(null);

    const parsed = legs.map((leg, i) => {
      const num = parseFloat(leg.value);
      if (isNaN(num)) throw new Error(`Leg ${i + 1}: please enter a valid number`);
      return { odds: num, format: leg.format };
    });

    setLoading(true);
    try {
      const res = await calculateParlay(parsed);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  function handleCalculateClick() {
    try {
      handleCalculate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  }

  const allFilled = legs.every(l => l.value.trim() !== '');

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Parlay Pricer</h1>
          <p className="app-subtitle">Calculate fair-value parlay odds from any leg format</p>
        </div>
      </header>

      <main className="app-main">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Parlay Legs</h2>
            <span className="leg-count">{legs.length} legs</span>
          </div>

          <div className="column-labels">
            <span />
            <span>Odds Format</span>
            <span>Odds</span>
            <span>Implied Prob</span>
            <span />
          </div>

          <div className="legs-list">
            {legs.map((leg, i) => (
              <LegInput
                key={i}
                index={i}
                value={leg.value}
                format={leg.format}
                onChange={(v, f) => updateLeg(i, v, f)}
                onRemove={() => removeLeg(i)}
                canRemove={legs.length > 2}
                impliedProbability={
                  result ? result.legProbabilities[i] : undefined
                }
              />
            ))}
          </div>

          <div className="card-actions">
            <button className="btn-secondary" onClick={addLeg}>
              + Add Leg
            </button>
            <button
              className="btn-primary"
              onClick={handleCalculateClick}
              disabled={loading || !allFilled}
            >
              {loading ? 'Calculating…' : 'Calculate Parlay'}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <span className="error-icon">⚠</span> {error}
            </div>
          )}
        </div>

        {result && <ParlaySummary result={result} legCount={legs.length} />}

        <div className="info-card">
          <h3 className="info-title">How it works</h3>
          <ul className="info-list">
            <li>Enter odds for each leg in any format (American, Decimal, or Implied Probability %)</li>
            <li>The calculator converts each leg to its implied probability and multiplies them together</li>
            <li>The resulting combined probability is displayed as fair-value parlay odds</li>
            <li>No vig is removed — these are the mathematically fair odds given your inputs</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
