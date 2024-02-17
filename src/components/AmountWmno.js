import React from 'react';

export function AmountWmno({ wmno, className }) {
  if (isNaN(wmno)) {
    return wmno;
  }
  return (
    <span className={className}>
      {(wmno / 1).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: 'always',
      })}{' '}
      WMNO
    </span>
  );
}
