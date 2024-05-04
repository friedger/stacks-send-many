import React from 'react';

export function AmountNot({ not, className }) {
  if (isNaN(not)) {
    return not;
  }
  return (
    <span className={className}>
      {(not / 1).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        useGrouping: 'always',
      })}{' '}
      $NOT
    </span>
  );
}
