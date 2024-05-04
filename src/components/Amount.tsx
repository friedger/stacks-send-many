import React from 'react';
import { AmountFiat } from './AmountFiat';
import { AmountStx } from './AmountStx';
import { AmountXbtc } from './AmountXbtc';
import { AmountSBtc } from './AmountSBtc';
import { AmountWmno } from './AmountWmno';
import { AmountNot } from './AmountNot';

export function Amount({
  ustx,
  xsats,
  ssats,
  not,
  wmno,
  amount,
  asset,
  className,
}: {
  ustx?: number;
  xsats?: number;
  ssats?: number;
  not?: number;
  wmno?: number;
  amount: number;
  asset: string;
  className?: string;
}) {
  if (asset === 'stx') {
    ustx = amount;
  } else if (asset === 'xbtc') {
    xsats = amount;
  } else if (asset === 'sbtc') {
    ssats = amount;
  } else if (asset === 'wmno') {
    wmno = amount;
  } else if (asset === 'not') {
    not = amount;
  }

  console.log({ ustx, xsats, ssats, wmno, not });
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
    );
  } else if (not || not === 0) {
    if (isNaN(not)) {
      return not;
    }
    return (
      <span className={className}>
        <AmountNot not={not} />
      </span>
    );
  } else {
    return null;
  }
}
