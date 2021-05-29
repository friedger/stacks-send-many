import React, { useEffect, useRef, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { uintCV } from '@stacks/transactions';
import { getMiningTx as getMiningState } from '../lib/citycoin';

// TODO: how to know block height to claim?
// get from a getter?

export function CityCoinMiningClaim({ ownerStxAddress }) {
  const amountRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const [miningState, setMiningState] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    if (ownerStxAddress) {
      getMiningState(ownerStxAddress).then(state => setMiningState(state));
    }
  }, [ownerStxAddress]);

  const mineClaimAction = async () => {
    setLoading(true);
    if (amountRef.current.value === '') {
      console.log('positive number required to claim mining rewards');
      setLoading(false);
    } else {
      const amountUstxCV = uintCV(amountRef.current.value.trim());
      await doContractCall({
        contractAddress: CONTRACT_ADDRESS,
        contractName: CITYCOIN_CONTRACT_NAME,
        functionName: 'claim-token-reward',
        functionArgs: [amountUstxCV],
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
      <h3>Claim Mining Rewards</h3>
      <p>Available CityCoins to claim:</p>
      {miningState && miningState.txs.length > 0 ? (
        <ul>
          {miningState.txs.map(tx => (
            <li>250,000 MIA in Block #5</li>
          ))}
        </ul>
      ) : loading ? null : (
        <div className="my-2">No rewards yet</div>
      )}
      <form>
        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            ref={amountRef}
            aria-label="Block Number"
            placeholder="Block Number"
            required
            minLength="1"
          />
        </div>
        <button className="btn btn-block btn-primary" type="button" onClick={mineClaimAction}>
          <div
            role="status"
            className={`${
              loading ? '' : 'd-none'
            } spinner-border spinner-border-sm text-info align-text-top mr-2`}
          />
          Claim Mining Rewards
        </button>
      </form>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
