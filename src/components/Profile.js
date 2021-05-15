import React, { useRef, useState, useCallback, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { STACK_API_URL, testnet } from '../lib/constants';
import { TxStatus } from '../lib/transactions';
import { Address } from './Address';
import { Amount } from './Amount';

export function Profile({ stxAddress, updateStatus, showAddress }) {
  const [txId, setTxId] = useState();
  const spinner = useRef();
  const faucetSpinner = useRef();

  const [profileState, setProfileState] = useState({
    account: undefined,
  });

  const onRefreshBalance = useCallback(
    async stxAddress => {
      updateStatus(undefined);
      spinner.current.classList.remove('d-none');

      fetchAccount(stxAddress)
        .then(acc => {
          setProfileState({ account: acc });
          spinner.current.classList.add('d-none');
        })
        .catch(e => {
          updateStatus('Refresh failed');
          console.log(e);
          spinner.current.classList.add('d-none');
        });
    },
    [updateStatus]
  );

  useEffect(() => {
    fetchAccount(stxAddress).then(acc => {
      setProfileState({ account: acc });
    });
  }, [stxAddress]);

  const claimTestTokens = async stxAddr => {
    updateStatus(undefined);
    faucetSpinner.current.classList.remove('d-none');

    fetch(`${STACK_API_URL}/extended/v1/faucets/stx?address=${stxAddr}`, {
      method: 'POST',
    })
      .then(r => {
        if (r.status === 200) {
          r.json().then(faucetResponse => {
            setTxId(faucetResponse.txId.substr(2));
          });

          updateStatus('Tokens will arrive soon.');
        } else {
          updateStatus('Claiming tokens failed.');
        }
        console.log(r);
        faucetSpinner.current.classList.add('d-none');
      })
      .catch(e => {
        updateStatus('Claiming tokens failed.');
        console.log(e);
        faucetSpinner.current.classList.add('d-none');
      });
  };

  return (
    <>
      <a className="navbar-brand" href="/">
        <img src="/stacks.png" width="50" alt="Logo" />
      </a>
      <span className="font-weight-bold">
        {stxAddress ? <Address addr={stxAddress} /> : 'Account'}
      </span>{' '}
      <br />
      {stxAddress && showAddress && (
        <>
          <span className="small">Total balance:</span>{' '}
          <a href={'https://explorer.stacks.co/address/' + stxAddress} className="small">
            View on Explorer ↗
          </a>
          <br />
        </>
      )}
      {profileState.account && (
        <>
          <Amount className="font-weight-bold balance" ustx={profileState.account.balance} />
          <br />
        </>
      )} 
      {testnet && (
        <>
          <br />
          <TxStatus txId={txId} resultPrefix="Tokens transferred? " />
        </>
      )}
    </>
  );
}
