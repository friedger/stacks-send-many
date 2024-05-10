import React from 'react';

export function AmountWmno({ wmno, className }: { wmno: number; className?: string }) {
  if (isNaN(wmno)) {
    return wmno;
  }
  return (
    <span className={className}>
      {(wmno / 1).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true,
      })}{' '}
      WMNO
    </span>
  );
}
