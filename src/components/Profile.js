import React, { useState, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { Address } from './Address';
import { Amount } from './Amount';
import {} from 'react-jdenticon';

export function Profile({ stxAddress, updateStatus, showAddress }) {
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
          <svg
            className="rounded-circle bg-white"
            width="50"
            height="50"
            data-jdenticon-value={stxAddress}
          />
        ) : (
          <img src="/stacks.png" width="50" height="50" alt="Logo" />
        )}
      </a>
      <span className="font-weight-bold">
        {stxAddress ? <Address addr={stxAddress} /> : 'Account'}
      </span>{' '}
      <br />
      <a href={'https://explorer.stacks.co/address/' + stxAddress} className="small">
        View on Explorer ↗
      </a>
      <hr />
      {profileState.account && (
        <>
          <Amount
            className="font-weight-bold balance"
            ustx={profileState.account.balance}
            stxAddress={stxAddress}
          />
        </>
      )}
    </>
  );
}
