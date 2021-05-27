import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
import { AmountMia } from './AmountMia';

export function Amount({ ustx, className }) {
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <>
      <span className={className}>
        <AmountStx ustx={ustx} /> (<AmountFiat ustx={ustx} />)
      </span>
      <hr />
      <span className={className}>
        <AmountMia />
      </span>
    </>
  );
}
