import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
import { AmountXbtc } from './AmountXbtc';
export function Amount({ ustx, xsats, className }) {
  console.log({ ustx, xsats });
  if (ustx || ustx === 0) {
    if (isNaN(ustx)) {
      return ustx;
    }
    return (
      <span className={className}>
        <AmountStx ustx={ustx} /> (<AmountFiat ustx={ustx} />)
      </span>
    );
  } else if (xsats || xsats === 0) {
    if (isNaN(xsats)) {
      return xsats;
    }
    return (
      <span className={className}>
        <AmountXbtc xsats={xsats} />
      </span>
    );
  } else {
    return null;
  }
}
