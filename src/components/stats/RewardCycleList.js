export default function RewardCycleList(props) {
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
          <div className="col-sm-4">24,497</div>
          <div className="col-sm-4">34,497</div>
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
      </div>
    </div>
  );
}
