import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { uintCV } from '@stacks/transactions';

export function CityCoinStacking() {
  const amountRefStacking = useRef();
  const amountRefRewardCycles = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  const stackingAction = async () => {
    setLoading(true);
    if (amountRefStacking.current.value === '' || amountRefRewardCycles.current.value === '') {
      console.log('positive numbers required to stack');
      setLoading(false);
    } else {
      const amountCityCoinCV = uintCV(amountRefStacking.current.value.trim());
      const amountRewardCyclesCV = uintCV(amountRefRewardCycles.current.value.trim());
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CITYCOIN_CONTRACT_NAME,
        functionName: 'stack-tokens',
        functionArgs: [amountCityCoinCV, amountRewardCyclesCV],
        network: NETWORK,
        onCancel: () => {
          setLoading(false);
        },
        onFinish: result => {
          setLoading(false);
          setTxId(result.txId);
        },
      });
    }
  };

  return (
    <>
      <h3>Stack CityCoins</h3>
      <p>
        Stacking CityCoin locks up the set amount in the contract for a number of reward cycles.
        Once these reward cycles pass, CityCoin owners are eligible to withdraw their CityCoins in
        addition to STX commited by miners during that reward cycle, proportionate to the amount
        Stacked within that cycle.
      </p>
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRefStacking}
            aria-label="Amount in CityCoin"
            placeholder="Amount in CityCoin"
            required
            minLength="1"
          />
          <div className="input-group-append">
            <span className="input-group-text">MIA</span>
          </div>
        </div>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRefRewardCycles}
            aria-label="Number of Reward Cycles"
            placeholder="Number of Reward Cycles"
            required
            minLength="1"
          />
        </div>
        <button className="btn btn-block btn-primary" type="button" onClick={stackingAction}>
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          Stack
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
