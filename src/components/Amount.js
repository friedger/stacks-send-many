import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
import { AmountCityCoin } from './AmountCityCoin';

export function Amount({ ustx, className, stxAddress }) {
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
        <AmountCityCoin stxAddress={stxAddress} />
      </span>
    </>
  );
}
