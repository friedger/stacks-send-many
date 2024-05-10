import React from 'react';
import { STX_USD } from '../lib/price';
import { useAtomValue } from 'jotai';

export function AmountFiat({ ustx, className }: { ustx: number; className?: string }) {
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
