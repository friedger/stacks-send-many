import { getUserData } from '@stacks/connect-react';
import { Person } from '@stacks/profile';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { STACK_API_URL } from '../lib/constants';
import { TxStatus } from '../lib/transactions';

// Demonstrating BlockstackContext for legacy React Class Components.

export default function Profile({ stxAddresses, userSession }) {
  const [status, setStatus] = useState('');
  if (!userSession || !stxAddresses.ownerStxAddress) {
    return <div>Loading</div>;
  }
  console.log({ stxAddresses, userSession });
  const { userData } = getUserData(userSession);
  const person = userData && new Person(userData.profile);
  const username = userData && userData.username;

  const updateStatus = status => {
    setStatus(status);
    setTimeout(() => {
      setStatus(undefined);
    }, 2000);
  };

  const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
  const proxyUrl = url => '/proxy/' + url.replace(/^https?:\/\//i, '');

  return (
    <div className="Profile">
      <div className="row no-gutters">
        <div className="col-sm-12 col-md-4  text-center justify-content-center bg-secondary p-4">
          <img
            src={(person && person.avatarUrl() || avatarFallbackImage)}
            className="img-rounded avatar mb-2"
            id="avatar-image"
            alt="Avatar"
          />  
          <hr/>
          <h5 className="text-white">Hello, {' '}
            <span id="heading-name">{(person && person.name()) || username || 'Stacks User'}</span>!
          </h5>
          <span class="text-white">Welcome to Send Many!</span>
          {username && (
            <>
              Your Blockstack username is <span class="font-weight-bold">{username}</span> <br />
            </>
          )}
        </div>
        <div className="col-sm-12 col-md-8 bg-light p-4">
          <div>
            Your own Stacks address:
            <br />
            <StxProfile
              stxAddress={stxAddresses.ownerStxAddress}
              updateStatus={updateStatus}
              showAddress
            ></StxProfile>
          </div>
          <div className="pt-4">
            Your STX hodl address for Send Many app:
            <br />
            <StxProfile
              stxAddress={stxAddresses.appStxAddress}
              updateStatus={updateStatus}
              showAddress
            ></StxProfile>
          </div>

          {status && (
            <>
              <br />
              <div>{status}</div>
            </>
          )}
        </div>
      </div>


      <div className="avatar-section text-center">
        <img
          src={proxyUrl((person && person.avatarUrl()) || avatarFallbackImage)}
          className="img-rounded avatar"
          id="avatar-image"
          alt="Avatar"
        />
      </div>
      <div className="text-center mt-2">
        Hello,{' '}
        <span id="heading-name">{(person && person.name()) || username || 'Stacks User'}</span>!
      </div>
      {username && (
        <>
          Your Blockstack username is {username} <br />
        </>
      )}
      <div className="pt-4">
        Your own Stacks address:
        <br />
        <StxProfile
          stxAddress={stxAddresses.ownerStxAddress}
          updateStatus={updateStatus}
          showAddress
        ></StxProfile>
      </div>
      <div className="pt-4">
        Your STX hodl address for Send Many app:
        <br />
        <StxProfile
          stxAddress={stxAddresses.appStxAddress}
          updateStatus={updateStatus}
          showAddress
        ></StxProfile>
      </div>

      {status && (
        <>
          <br />
          <div>{status}</div>
        </>
      )}
    </div>
  );
}

function StxProfile({ stxAddress, updateStatus, showAddress }) {
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
      {stxAddress && showAddress && (
        <>
          {stxAddress} <br />
        </>
      )}
      {profileState.account && (
        <>
          You balance: {profileState.account.balance}uSTX.
          <br />
        </>
      )}
      <button
        className="btn btn-primary mr-1 mt-1"
        onClick={e => {
          onRefreshBalance(stxAddress);
        }}
      >
        <div
          ref={spinner}
          role="status"
          className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
        />
        Refresh balance
      </button>
      {showAddress && (
        <>
          <button
            className="btn btn-info mt-1"
            onClick={() => {
              claimTestTokens(stxAddress);
            }}
          >
            <div
              ref={faucetSpinner}
              role="status"
              className="d-none spinner-border spinner-border-sm text-info align-text-top mr-2"
            />
            Claim test tokens from faucet
          </button>
          <br />
          <TxStatus txId={txId} resultPrefix="Tokens transferred? " />
        </>
      )}
    </>
  );
}
