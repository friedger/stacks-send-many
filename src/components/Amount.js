import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
export function Amount({ ustx, className }) {
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <span className={className}>
      <AmountStx ustx={ustx} /> (<AmountFiat ustx={ustx} />)
    </span>
  );
}
