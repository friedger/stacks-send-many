import React, { useRef, useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CITYCOIN_CONTRACT_NAME, CONTRACT_ADDRESS, NETWORK } from '../lib/constants';
import { TxStatus } from './TxStatus';
import { uintCV } from '@stacks/transactions';

// TODO: how to know block height to claim?
// get from a getter?

export function CityCoinMiningClaim() {
  const amountRef = useRef();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();
  const { doContractCall } = useConnect();

  const mineClaimAction = async () => {
    setLoading(true);
    const amountUstxCV = uintCV(amountRef.current.value.trim());
    await doContractCall({
      contractAddress: CONTRACT_ADDRESS,
      contractName: CITYCOIN_CONTRACT_NAME,
      functionName: 'claim-token-reward',
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
      <h3>Claim Mining Rewards</h3>
      <p>Available CityCoins to claim:</p>
      <ul>
        <li>250,000 MIA in Block #5</li>
      </ul>
      <button className="btn btn-block btn-primary" type="button" onClick={mineClaimAction}>
        <div
          role="status"
          className={`${
            loading ? '' : 'd-none'
          } spinner-border spinner-border-sm text-info align-text-top mr-2`}
        />
        Claim Mining Rewards
      </button>
      {txId && <TxStatus txId={txId} />}
    </>
  );
}
