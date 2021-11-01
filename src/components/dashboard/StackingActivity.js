import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getRewardCycle } from '../../lib/citycoins';
import { currentBlockHeight, currentRewardCycle } from '../../store/common';
import StackingStats from '../stacking/StackingStats';

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
      <h3>{props.token.symbol} Stacking Stats</h3>
      <p>
        Current Stacks Block Height: {blockHeight ? blockHeight.toLocaleString() : 'Loading...'}
      </p>
      <p>
        Current {props.token.symbol} Reward Cycle: {rewardCycle ? rewardCycle : 'Loading...'}
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
        'Loading...'
      )}
    </div>
  );
}
