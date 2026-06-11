import React from 'react';
import { OddsFormat } from '../services/api';

interface LegInputProps {
  index: number;
  value: string;
  format: OddsFormat;
  onChange: (value: string, format: OddsFormat) => void;
  onRemove: () => void;
  canRemove: boolean;
  impliedProbability?: number;
}

const FORMAT_LABELS: Record<OddsFormat, string> = {
  american: 'American',
  decimal: 'Decimal',
  probability: 'Prob %',
};

const FORMAT_PLACEHOLDERS: Record<OddsFormat, string> = {
  american: '-110',
  decimal: '1.91',
  probability: '52.4',
};

export default function LegInput({
  index,
  value,
  format,
  onChange,
  onRemove,
  canRemove,
  impliedProbability,
}: LegInputProps) {
  const formats: OddsFormat[] = ['american', 'decimal', 'probability'];

  return (
    <div className="leg-row">
      <span className="leg-label">Leg {index + 1}</span>

      <div className="format-tabs">
        {formats.map(f => (
          <button
            key={f}
            className={`format-tab ${format === f ? 'active' : ''}`}
            onClick={() => onChange(f !== format ? '' : value, f)}
          >
            {FORMAT_LABELS[f]}
          </button>
        ))}
      </div>

      <input
        type="number"
        className="odds-input"
        value={value}
        placeholder={FORMAT_PLACEHOLDERS[format]}
        onChange={e => onChange(e.target.value, format)}
      />

      {impliedProbability !== undefined && (
        <span className="leg-prob">{(impliedProbability * 100).toFixed(1)}%</span>
      )}

      <button
        className="remove-btn"
        onClick={onRemove}
        disabled={!canRemove}
        title="Remove leg"
      >
        ✕
      </button>
    </div>
  );
}
