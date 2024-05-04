import React from 'react';

export function AmountStx({ ustx, className }) {
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <span className={className}>
      {(ustx / 1000000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      })}
      Ӿ
    </span>
  );
}
