import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
import { AmountCityCoin } from './AmountCityCoin';

export function Amount({ ustx, stxAddress }) {
  if (isNaN(ustx)) {
    return ustx;
  }
  return (
    <>
      <div>
        <AmountStx ustx={ustx} /> (<AmountFiat ustx={ustx} />)
      </div>
      <hr />
      <div>
        <AmountCityCoin stxAddress={stxAddress} />
      </div>
    </>
  );
}
