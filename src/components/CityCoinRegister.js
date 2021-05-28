import React, { useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { getRegisteredMinerId, getRegisteredMinerCount } from '../lib/citycoin';

export function CityCoinRegister({ ownerStxAddress }) {
  const styles = {
    width: '10%',
  };

  const [minerCount, setMinerCount] = useState();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    getRegisteredMinerCount()
      .then(result => {
        setMinerCount(result);
      })
      .catch(e => {
        setMinerCount('unavailable');
        console.log(e);
      });
  }, []);

  useEffect(() => {
    console.log(ownerStxAddress);
    ownerStxAddress &&
      getRegisteredMinerId(ownerStxAddress)
        .then(result => {
          console.log(result);
        })
        .catch(e => {
          console.log(e);
        });
  }, [ownerStxAddress]);

  const registerAction = async () => {
    setLoading(true);

    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'register-miner',
      functionArgs: [],
      network: NETWORK,
      onFinish: result => {
        setLoading(false);
        setTxId(result.txId);
      },
    });
  };

  // TODO: update disable button styles

  return (
    <>
      <h3>Activate CityCoin Mining</h3>
      <p>
        Before mining can begin, at least 20 miners must register with the contract to signal
        activation.
      </p>
      <ul>
        <li>Miners Registered: {minerCount}</li>
        <li>Threshold: 20 Miners</li>
      </ul>
      <div className="progress mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={styles}
          aria-valuenow="10"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          10%
        </div>
      </div>
      <p>Countdown goes here once active</p>
      <button
        className="btn btn-block btn-primary"
        type="button"
        disabled={txId}
        onClick={registerAction}
      >
        <div
          role="status"
          className={`${
            loading ? '' : 'd-none'
          } spinner-border spinner-border-sm text-info align-text-top mr-2`}
        />
        Register
      </button>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
