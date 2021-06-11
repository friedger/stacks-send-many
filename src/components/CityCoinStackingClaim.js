import React, { useEffect, useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { uintCV } from '@stacks/transactions';
import { getStackingState } from '../lib/citycoin';

// TODO: how to know reward cycle to claim?
// get from a getter?

export function CityCoinStackingClaim({ ownerStxAddress }) {
  const rewardCycleRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [stackingState, setStackingState] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    getStackingState(ownerStxAddress).then(state => setStackingState(state));
  }, [ownerStxAddress]);

  const claimAction = async () => {
    if (rewardCycleRef.current.value === '') {
      console.log('positive number required to claim stacking rewards');
    } else {
      setLoading(true);
      const targetRewardCycleCV = uintCV(rewardCycleRef.current.value.trim());
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CITYCOIN_CONTRACT_NAME,
        functionName: 'claim-stacking-reward',
        functionArgs: [targetRewardCycleCV],
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
      <h3>Claim Stacking Rewards</h3>
      <p>Available STX to claim:</p>
      {stackingState && stackingState.length > 0 ? (
        <ul>
          {stackingState.map((details, key) => (
            <li key={key}>
              {details.winner ? (
                details.claimed ? (
                  <>
                    {details.coinbase} CC in Block {details.blockHeight} claimed.
                  </>
                ) : (
                  <>
                    {details.coinbase} CC in Block {details.blockHeight}
                    <button onClick={() => claimAction(uintCV(details.blockHeight))}>Claim</button>
                  </>
                )
              ) : details.lost ? null : details.e ? (
                <>
                  Error for Cylce {details.blockHeight} {details.e.toString()}
                </>
              ) : (
                <>Pending tx for Cycle {details.blockHeight}</>
              )}
            </li>
          ))}
        </ul>
      ) : loading ? null : (
        <div className="my-2">Nothing to claim</div>
      )}
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={rewardCycleRef}
            aria-label="Reward Cycle"
            placeholder="Reward Cycle"
            required
            minLength="1"
          />
        </div>
        <button className="btn btn-block btn-primary" type="button" onClick={claimAction}>
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
