export default function RewardCycleList(props) {
  const startBlock = props.config.startBlock;
  const cycleLength = props.config.rewardCycleLength;
  const numCycles = 7;

  // 0, 24497, 26596
  // 1, 26597, 28696
  // 2, 28697, 30796
  // 3, 30797, 32996
  // 4, 32997, 35197
  // 5, 35198, 37396
  // 6, 37397, 39596

  return (
    <div className="col-lg-6">
      <div className="border rounded p-3 text-nowrap">
        <p className="fs-5 text-center">Reward Cycles</p>
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">Cycle ID</div>
          <div className="col-sm-4">Start Block</div>
          <div className="col-sm-4">End Block</div>
        </div>

        <hr className="d-sm-none" />
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">0</div>
          <div className="col-sm-4">{props.config.startBlock.toLocaleString()}</div>
          <div className="col-sm-4">{(startBlock + cycleLength - 1).toLocaleString()}</div>
        </div>
        <hr className="d-sm-none" />
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">1</div>
          <div className="col-sm-4">24,497</div>
          <div className="col-sm-4">34,497</div>
        </div>
        <hr className="d-sm-none" />
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">2</div>
          <div className="col-sm-4">24,497</div>
          <div className="col-sm-4">34,497</div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">3</div>
          <div className="col-sm-4">24,497</div>
          <div className="col-sm-4">34,497</div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">4</div>
          <div className="col-sm-4">24,497</div>
          <div className="col-sm-4">34,497</div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">5</div>
          <div className="col-sm-4">24,497</div>
          <div className="col-sm-4">34,497</div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-4">6</div>
          <div className="col-sm-4">24,497</div>
          <div className="col-sm-4">34,497</div>
        </div>
      </div>
    </div>
  );
}
