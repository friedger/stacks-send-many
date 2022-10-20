import React, { useState, useEffect, useRef } from 'react';
import { fetchAccount } from '../lib/account';
import { Address } from './Address';
import { Amount } from './Amount';
import { WRAPPED_BITCOIN_ASSET } from '../lib/constants';
import * as jdenticon from 'jdenticon';

function Jdenticon({ value, size }) {
  const icon = useRef(null);
  useEffect(() => {
    if (value) {
      jdenticon.update(icon.current, value);
    }
  }, [value]);

  return <svg width={size} height={size} data-jdenticon-value={value} ref={icon} />;
}
export function Profile({ stxAddress, asset }) {
  const [profileState, setProfileState] = useState({
    account: undefined,
  });

  useEffect(() => {
    fetchAccount(stxAddress).then(acc => {
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
                ustx={profileState.account.stx.balance}
              />
              <br />
              <Amount
                className="font-weight-light balance"
                ustx={profileState.account.stx.locked}
              />{' '}
              (locked)
            </>
          ) : (
            <Amount
              className="font-weight-bold balance"
              xsats={profileState.account.fungible_tokens[WRAPPED_BITCOIN_ASSET].balance}
            />
          )}
          <br />
          <a
            href={'https://explorer.stacks.co/address/' + stxAddress}
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
