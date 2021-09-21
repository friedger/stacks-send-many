import { useConnect } from '@stacks/connect-react';
import {
  createAssetInfo,
  FungibleConditionCode,
  makeContractFungiblePostCondition,
  makeContractSTXPostCondition,
  PostConditionMode,
  uintCV,
} from '@stacks/transactions';
import { useEffect, useState } from 'react';
import { getStackingRewards } from '../lib/citycoin';
import {
  CITYCOIN_CORE,
  CITYCOIN_NAME,
  CITYCOIN_TOKEN,
  CONTRACT_DEPLOYER,
  NETWORK,
} from '../lib/constants';
import { TxStatus } from './TxStatus';

export function CityCoinStackingReward({ ownerStxAddress, rewardCycle }) {
  const [loading, setLoading] = useState();
  const [txId, setTxId] = useState();
  const [stackingRewards, setStackingRewards] = useState();
  const { doContractCall } = useConnect();

  useEffect(() => {
    ownerStxAddress &&
      getStackingRewards(ownerStxAddress, rewardCycle).then(result => {
        setStackingRewards(result);
      });
  }, [ownerStxAddress, rewardCycle]);

  const claimAction = async () => {
    const targetRewardCycleCV = uintCV(rewardCycle);
    const amountUstxCV = uintCV(stackingRewards.amountStx);
    const amountCityCoinCV = uintCV(stackingRewards.amountCityCoin);
    setLoading(true);
    let postConditions = [];
    amountUstxCV.value > 0 &&
      postConditions.push(
        makeContractSTXPostCondition(
          CONTRACT_DEPLOYER,
          CITYCOIN_CORE,
          FungibleConditionCode.Equal,
          amountUstxCV.value
        )
      );
    amountCityCoinCV.value > 0 &&
      postConditions.push(
        makeContractFungiblePostCondition(
          CONTRACT_DEPLOYER,
          CITYCOIN_CORE,
          FungibleConditionCode.Equal,
          amountCityCoinCV.value,
          createAssetInfo(CONTRACT_DEPLOYER, CITYCOIN_TOKEN, CITYCOIN_NAME)
        )
      );
    await doContractCall({
      contractAddress: CONTRACT_DEPLOYER,
      contractName: CITYCOIN_CORE,
      functionName: 'claim-stacking-reward',
      functionArgs: [targetRewardCycleCV],
      postConditionMode: PostConditionMode.Deny,
      postConditions: postConditions,
      network: NETWORK,
      onCancel: () => {
        setLoading(false);
      },
      onFinish: result => {
        setLoading(false);
        setTxId(result.txId);
      },
    });
  };

  return (
    <>
      {stackingRewards ? (
        <div className="card m-2 col-lg-4">
          <div className="card-header">
            <h4>Cycle {stackingRewards.cycleId} Results</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-6">Amount Stacked</div>
              <div className="col-lg-6">{stackingRewards.amountStacked.toLocaleString()} MIA</div>
            </div>
            <div className="row">
              <div className="col-lg-6">STX Rewards</div>
              <div className="col-lg-6">
                {(stackingRewards.amountStx / 1000000).toLocaleString()} STX
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">CityCoins to Claim</div>
              <div className="col-lg-6">{stackingRewards.amountCityCoin.toLocaleString()} MIA</div>
            </div>

            {stackingRewards.amountStx > 0 || stackingRewards.amountCityCoin > 0 ? (
              <>
                <button
                  className="btn btn-block btn-primary my-3"
                  type="button"
                  onClick={claimAction}
                >
                  <div
                    role="status"
                    className={`${
                      loading ? '' : 'd-none'
                    } spinner-border spinner-border-sm text-info align-text-top ms-1 me-2`}
                  />
                  Claim Rewards
                </button>
                <br />
                {txId && <TxStatus txId={txId} />}
              </>
            ) : (
              <>
                <p className="mt-3">Nothing to claim.</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-3">Loading...</div>
      )}
    </>
  );
}
