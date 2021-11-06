import { Fragment } from 'react';

export default function RewardCycleList(props) {
  const startBlock = props.config.startBlock;
  const cycleLength = props.config.rewardCycleLength;
  const numCycles = 7;
  const cycleLengths = [];
  for (let i = 0; i < numCycles; i++) {
    cycleLengths.push(cycleLength * i);
  }

  return (
    <div className="col-lg-6">
      <div className="border rounded p-3 text-nowrap">
        <p className="fs-5 text-center">Reward Cycles</p>
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">Cycle ID</div>
          <div className="col-sm-4">Start Block</div>
          <div className="col-sm-4">End Block</div>
        </div>
        {cycleLengths.map((value, idx) => {
          return (
            <Fragment key={idx}>
              <hr className="d-sm-none" />
              <div className="row text-center text-sm-start">
                <div className="col-sm-4">{idx}</div>
                <div className="col-sm-4">{(startBlock + value).toLocaleString()}</div>
                <div className="col-sm-4">
                  {(startBlock + value + cycleLength - 1).toLocaleString()}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
