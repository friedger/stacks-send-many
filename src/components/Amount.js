import { useAtomValue } from 'jotai/utils';
import React from 'react';
import { STX_USD } from '../lib/price';

export function Amount({ ustx }) {
  const rate = useAtomValue(STX_USD)
  if(isNaN(ustx)) {
    return ustx
  }
  return (
    <>
      {' '}
      {(ustx / 1000000).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 6,
        maximumFractionDigits: 6,
      })}
      Ӿ  (${(ustx / 1000000 * rate.value).toLocaleString(undefined, {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })})
    </>
  );
}
