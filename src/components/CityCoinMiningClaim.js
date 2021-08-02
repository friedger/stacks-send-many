import React, { useEffect, useState } from 'react';
import { useConnect } from '@stacks/connect-react';
import { CONTRACT_DEPLOYER, CITYCOIN_CORE, CITYCOIN_SYMBOL, NETWORK } from '../lib/constants';
import { uintCV } from '@stacks/transactions';
import { getMiningDetails } from '../lib/citycoin';

// TODO: how to know block height to claim?
// get from a getter?

export function CityCoinMiningClaim({ ownerStxAddress }) {
  const [loading, setLoading] = useState();
  const [miningState, setMiningState] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    if (ownerStxAddress) {
      getMiningDetails(ownerStxAddress).then(state => setMiningState(state));
    }
  }, [ownerStxAddress]);

  const claimAction = async blockHeight => {
    await doContractCall({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'claim-mining-reward',
      functionArgs: [blockHeight],
      network: NETWORK,
      onCancel: () => {
        setLoading(false);
      },
      onFinish: result => {
        setLoading(false);
      },
    });
  };

  return (
    <>
      <h3>Claim Mining Rewards</h3>
      <p>Available CityCoins to claim:</p>
      {miningState && miningState.winningDetails.length > 0 ? (
        <div className="row">
          {miningState.winningDetails.map((details, key) =>
            details.lost ? null : (
              <div className="col-3 card" key={key}>
                <div className="card-header">Block {details.blockHeight}</div>
                <div className="card-body">
                  {details.winner && details.canClaim ? (
                    <>
                      <p>
                        {details.coinbase.toLocaleString()} {CITYCOIN_SYMBOL} claimed.
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        {details.coinbase.toLocaleString()} {CITYCOIN_SYMBOL}
                      </p>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => claimAction(uintCV(details.blockHeight))}
                      >
                        Claim
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : loading ? null : (
        <div className="my-2">No rewards yet, or still loading.</div>
      )}
    </>
  );
}
