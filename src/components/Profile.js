import { getUserData } from '@stacks/connect-react';
import { Person } from '@stacks/profile';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { STACK_API_URL } from '../lib/constants';
import { SendManyInputContainer } from '../components/SendManyInputContainer';
import { SendManyTxList } from '../components/SendManyTxList';
import { TxStatus } from '../lib/transactions';
import { testnet } from '../lib/constants';

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

  return (
    <div className="Profile">
      <div className="row">
      
        <div className="col-sm-12 col-md-4 bg-light p-4 mt-2">
          <StxProfile
              stxAddress={stxAddresses.ownerStxAddress}
              updateStatus={updateStatus}
              addressType="ownAddress"
              showAddress
            ></StxProfile>

            <hr/>
            <StxProfile
              stxAddress={stxAddresses.appStxAddress}
              updateStatus={updateStatus}
              addressType="appAddress"
              showAddress
            ></StxProfile>

            <hr/>
          </div>
        
        <div className="offset-md-1 col-sm-12 col-md-7 bg-light p-4 mr-n4 mt-2">
            
          <div className="col-xs-10 col-md-12 mx-auto px-4 mb-4">
            <h3 className="font-weight-bold">Send {testnet ? 'Test' : ''} Stacks (STX)</h3>
          </div>
          <div className="col-xs-10 col-md-12 mx-auto mb-4 px-4">
            <SendManyInputContainer ownerStxAddress={stxAddresses.ownerStxAddress} />
          </div>
        </div> 
        <div className="col-sm-12 col-md-4 bg-light p-4 mt-2">
            <h4>Instructions</h4>
            <ol class="list-group small">
              <li>Enter recipients and amounts one per line, separate both with semicolon. If all memo
              field are empty "send-many" contract is used. Otherwise, "send-many-memo" is used.</li>
              <li>Review the data</li>
              <li>Click send</li>
              <li>
                Follow the instructions on your wallet to complete the transaction.
              </li>
            </ol>
        </div>
        <div className="offset-md-1 col-sm-12 col-md-6 bg-light p-4 mt-4">
          <div className="col-xs-10 col-md-12 mx-auto mb-4 px-4">
            
            <SendManyTxList ownerStxAddress={stxAddresses.ownerStxAddress} userSession={userSession} />
          </div>
        </div>  
      </div>
    </div>
  );
}

function StxProfile({ stxAddress, updateStatus, showAddress, addressType }) {
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
          <span className="font-weight-bold">Account 1#</span> <span className="small">{addressType == "appAddress" ? "(app wallet)" : "(your own wallet)"}</span><br/>
          
      {stxAddress && showAddress && (
        <>
          <span class="small">Total balance:</span> <a href={"https://explorer.stacks.co/address/"+stxAddress} class="small">View on Explorer ↗</a><br/>
        </>
      )}
      {profileState.account && (
        <>
          <span class="font-weight-bold balance">{profileState.account.balance} STX</span>
          <br />
        </>
      )}
      <button
        className="btn btn-sm btn-primary mr-1 mt-1"
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
            className="btn btn-sm btn-info mt-1"
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
