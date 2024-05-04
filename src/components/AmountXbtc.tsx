import React from 'react';

export function AmountXbtc({ xsats, className }) {
  if (isNaN(xsats)) {
    return xsats;
  }
  return (
    <span className={className}>
      {(xsats / 100000000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 8,
        maximumFractionDigits: 8,
      })}
      ₿
    </span>
  );
}
