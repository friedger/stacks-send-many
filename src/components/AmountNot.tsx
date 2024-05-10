import React from 'react';

export function AmountNot({ not, className }: { not: number; className?: string }) {
  if (isNaN(not)) {
    return not;
  }
  return (
    <span className={className}>
      {(not / 1).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: true,
      })}{' '}
      $NOT
    </span>
  );
}
