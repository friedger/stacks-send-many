import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { userSessionState } from '../../lib/auth';
import { getRewardCycle, getUserId } from '../../lib/citycoins';
import { useStxAddresses } from '../../lib/hooks';
import { currentBlockHeight, currentRewardCycle, userId } from '../../store/common';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import LoadingSpinner from '../common/LoadingSpinner';
import StackingReward from './StackingReward';

export default function ClaimStackingRewards(props) {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [, setUserId] = useAtom(userId);
  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);
  const [rewardCycle, setRewardCycle] = useAtom(currentRewardCycle);
  const [rewardCycleList, setRewardCycleList] = useState([]);

  useEffect(() => {
    if (blockHeight > 0) {
      getRewardCycle(props.contracts.deployer, props.contracts.coreContract, blockHeight)
        .then(result => {
          setRewardCycle(result.value.value);
          let newCycleList = [];
          for (let i = 1; i < result.value.value; i++) {
            newCycleList = [...newCycleList, i];
          }
          setRewardCycleList(newCycleList);
        })
        .catch(err => {
          setRewardCycle(0);
          console.log(err);
        });
    }
  }, [blockHeight, props.contracts.coreContract, props.contracts.deployer, setRewardCycle]);

  useEffect(() => {
    ownerStxAddress &&
      getUserId(props.contracts.deployer, props.contracts.coreContract, ownerStxAddress)
        .then(result => setUserId(result.value.value))
        .catch(err => {
          console.log(err);
        });
  }, [
    ownerStxAddress,
    props.contracts.coreContract,
    props.contracts.deployer,
    props.contracts.tokenContract,
    props.token.symbol,
    setUserId,
  ]);

  return (
    <div className="container-fluid p-6">
      <h3>
        Claim Stacking Rewards{' '}
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/claiming-stacking-rewards"
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </h3>
      <CurrentStacksBlock />
      <p>
        Current {props.token.symbol} Reward Cycle: {rewardCycle ? rewardCycle : <LoadingSpinner />}
      </p>
      <p>
        When a reward cycle is complete, Stackers can claim their portion of the STX committed by
        miners.
      </p>
      <p>
        When the last selected cycle is complete, Stackers can claim their {props.token.symbol} back
        in the same transaction.
      </p>
      {rewardCycle && rewardCycleList.length > 0 ? (
        <div className="row g-4 flex-column flex-lg-row row-cols-lg-3 align-items-center justify-content-start">
          {rewardCycleList.map((value, idx) => (
            <div key={idx} className={`col order-${rewardCycleList.length - value + 1}`}>
              <StackingReward
                contracts={props.contracts}
                token={props.token}
                config={props.config}
                cycle={value}
              />
            </div>
          ))}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
