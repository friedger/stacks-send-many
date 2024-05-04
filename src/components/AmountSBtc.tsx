import React from 'react';

export function AmountSBtc({ ssats, className }) {
  if (isNaN(ssats)) {
    return ssats;
  }
  return (
    <span className={className}>
      {(ssats / 100000000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      })}{' '}
      sBTC
    </span>
  );
}
