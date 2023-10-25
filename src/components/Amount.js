import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
import { AmountXbtc } from './AmountXbtc';
import { AmountSBtc } from './AmountSBtc';
export function Amount({ ustx, xsats, ssats, amount, asset, className }) {

  if (asset === 'stx') {
    ustx = amount;
  } else if (asset === 'xbtc') {
    xsats = amount;
  } else if (asset === 'sbtc') {
    ssats = amount;
  }

  console.log({ ustx, xsats, ssats });
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
  } else if (ssats || ssats === 0) {
    if (isNaN(ssats)) {
      return ssats;
    }
    return (
      <span className={className}>
        <AmountSBtc ssats={ssats} />
      </span>
    );
  } else {
    return null;
  }
}
