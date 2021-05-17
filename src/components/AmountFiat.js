import { useAtomValue } from 'jotai/utils';
import React from 'react';
import { STX_USD } from '../lib/price';

export function AmountFiat({ ustx, className }) {
  const rate = useAtomValue(STX_USD);
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <span className={className}>
      $
      {((ustx / 1000000) * rate.value).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}
