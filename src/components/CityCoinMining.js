import React, { useRef, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { uintCV } from '@stacks/transactions';

export function CityCoinMining() {
  const amountRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  // TODO: add onCancel state

  const mineAction = async () => {
    setLoading(true);
    const amountUstxCV = uintCV(amountRef.current.value.trim());
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'mine-tokens',
      functionArgs: [amountUstxCV],
      network: NETWORK,
      onFinish: result => {
        setLoading(false);
        setTxId(result.txId);
      },
    });
  };

  return (
    <>
      <h3>Mine CityCoins</h3>
      <p>
        Mining CityCoins is done by spending STX in a given Stacks block. A winner is selected by a
        VRF weighted by the miners' proportion of contributions that block. Rewards can be withdrawn
        after a 100 block maturity window.
      </p>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          ref={amountRef}
          aria-label="Amount in STX"
          placeholder="Amount in STX"
        />
        <div className="input-group-append">
          <span className="input-group-text">STX</span>
        </div>
      </div>
      <div className="input-group mb-3">
        <input
          disabled
          type="text"
          className="form-control"
          aria-label="Number of Blocks"
          placeholder="Number of Blocks"
        />
      </div>
      <button
        className="btn btn-block btn-primary"
        type="button"
        disabled={txId}
        onClick={mineAction}
      >
        <div
          role="status"
          className={`${
            loading ? '' : 'd-none'
          } spinner-border spinner-border-sm text-info align-text-top mr-2`}
        />
        Mine
      </button>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
