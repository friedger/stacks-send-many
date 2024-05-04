import React, { useState, useEffect, useRef } from 'react';
import { fetchAccount } from '../lib/account';
import { Address } from './Address';
import { Amount } from './Amount';
import * as jdenticon from 'jdenticon';
import { AddressBalanceResponse } from '@stacks/blockchain-api-client';

function Jdenticon({ value, size }: { value: string; size: number }) {
  const icon = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (icon.current && value) {
      jdenticon.update(icon.current, value);
    }
  }, [value]);

  return <svg width={size} height={size} data-jdenticon-value={value} ref={icon} />;
}
export function Profile({
  stxAddress,
  asset,
  assetId,
}: {
  stxAddress: string;
  asset?: string;
  assetId?: string;
}) {
  const [profileState, setProfileState] = useState<{
    account?: AddressBalanceResponse;
  }>({
    account: undefined,
  });

  useEffect(() => {
    fetchAccount(stxAddress).then(acc => {
      console.log({ acc });
      setProfileState({ account: acc });
    });
  }, [stxAddress]);

  return (
    <>
      <a className="navbar-brand" href="/">
        {stxAddress ? (
          <Jdenticon value={stxAddress} size={50} />
        ) : (
          <img src="/stacks.png" width="50" alt="Logo" />
        )}
      </a>
      <span className="font-weight-bold">
        {stxAddress ? <Address addr={stxAddress} /> : 'Account'}
      </span>{' '}
      <br />
      {profileState.account && (
        <>
          <span className="small">Total balance:</span>
          <br />
          {asset === 'stx' ? (
            <>
              <Amount
                className="font-weight-bold balance"
                asset="stx"
                amount={+profileState.account.stx.balance}
                // ustx={+profileState.account.stx.balance}
              />
              <br />
              <Amount
                className="font-weight-light balance"
                amount={+profileState.account.stx.locked}
                asset="stx"

                // ustx={profileState.account.stx.locked}
              />{' '}
              (locked)
            </>
          ) : asset === 'sbtc' ? (
            <Amount
              className="font-weight-bold balance"
              // ssats={profileState.account.fungible_tokens?.[assetId]?.balance || 0}
              asset="sbtc"
              amount={profileState.account.fungible_tokens?.[assetId!]?.balance || 0}
            />
          ) : asset === 'wmno' ? (
            <Amount
              asset="wmno"
              className="font-weight-bold balance"
              amount={profileState.account.fungible_tokens?.[assetId!]?.balance || 0}
            />
          ) : asset === 'not' ? (
            <Amount
              className="font-weight-bold balance"
              asset="not"
              amount={profileState.account.fungible_tokens?.[assetId!]?.balance || 0}
            />
          ) : (
            <Amount
              className="font-weight-bold balance"
              asset="xbtc"
              amount={profileState.account.fungible_tokens?.[assetId!]?.balance || 0}
            />
          )}
          <br />
          <a
            href={'https://explorer.hiro.so/address/' + stxAddress}
            className="small"
            target="_blank"
            rel="noreferrer"
          >
            View on Explorer ↗
          </a>
        </>
      )}
    </>
  );
}
