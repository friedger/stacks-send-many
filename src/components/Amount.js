import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
import { AmountXbtc } from './AmountXbtc';
import { AmountSBtc } from './AmountSBtc';
import {AmountWmno} from "./AmountWmno";

export function Amount({ ustx, xsats, ssats, wmno, amount, asset, className }) {

  if (asset === 'stx') {
    ustx = amount;
  } else if (asset === 'xbtc') {
    xsats = amount;
  } else if (asset === 'sbtc') {
    ssats = amount;
  } else if (asset === 'wmno') {
    wmno = amount;
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
  } else if (wmno || wmno === 0) {
    if (isNaN(wmno)) {
      return wmno;
    }
    return (
      <span className={className}>
        <AmountWmno wmno={wmno} />
      </span>
    )
  } else {
    return null;
  }
}
