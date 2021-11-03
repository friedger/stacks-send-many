import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getRewardCycle } from '../../lib/citycoins';
import { currentBlockHeight, currentRewardCycle } from '../../store/common';
import LoadingSpinner from '../common/LoadingSpinner';
import StackingStats from './StackingStats';

export default function StackingActivity(props) {
  const [blockHeight] = useAtom(currentBlockHeight);
  const [rewardCycle, setRewardCycle] = useAtom(currentRewardCycle);

  useEffect(() => {
    if (blockHeight > 0) {
      getRewardCycle(props.contracts.deployer, props.contracts.coreContract, blockHeight)
        .then(result => {
          setRewardCycle(result.value.value);
        })
        .catch(err => {
          setRewardCycle(0);
          console.log(err);
        });
    }
  });

  return (
    <div className="container-fluid p-6">
      <h3>{props.token.symbol} Stacking Activity</h3>
      <p>
        Current {props.token.symbol} Reward Cycle: {rewardCycle ? rewardCycle : <LoadingSpinner />}
      </p>
      {rewardCycle ? (
        <div className="row g-4 flex-column flex-lg-row row-cols-lg-3 align-items-center justify-content-center">
          <div className="col">
            <StackingStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              cycle={rewardCycle - 1}
            />
          </div>
          <div className="col">
            <StackingStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              cycle={rewardCycle}
            />
          </div>
          <div className="col">
            <StackingStats
              contracts={props.contracts}
              token={props.token}
              config={props.config}
              cycle={rewardCycle + 1}
            />
          </div>
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
}
