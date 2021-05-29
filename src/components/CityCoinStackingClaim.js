import React, { useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { uintCV } from '@stacks/transactions';

// TODO: how to know reward cycle to claim?
// get from a getter?

export async function CityCoinStackingClaim() {
  const amountRefStackingReward = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  setLoading(true);
  if (amountRefStackingReward.current.value === '') {
    console.log('positive number required to claim stacking rewards');
    setLoading(false);
  } else {
    const rewardCycleClaim = uintCV(amountRefStackingReward.current.value.trim());
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'claim-stacking-reward',
      functionArgs: [rewardCycleClaim],
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

  return (
    <>
      <h3>Claim Stacking Rewards</h3>
      <p>Reward Cycle #1</p>
      <ul>
        <li>250 STX</li>
        <li>250,000 MIA</li>
      </ul>
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRefStackingReward}
            aria-label="Reward Cycle"
            placeholder="Reward Cycle"
            required
            minlength="1"
          />
        </div>
        <button className="btn btn-block btn-primary" type="button" onClick={CityCoinStackingClaim}>
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          Claim Stacking Rewards
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
