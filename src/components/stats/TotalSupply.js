export default function TotalSupply(props) {
  return (
    <div className="col-lg-6">
      <div className="border rounded p-3 text-nowrap">
        <p className="fs-5 text-center">{props.token.symbol} Supply</p>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">Max Supply</div>
          <div className="col-sm-6">Loading...</div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">Total Supply</div>
          <div className="col-sm-6">Loading...</div>
        </div>
        <div className="row text-center text-sm-start">
          <div className="col-sm-6">Unclaimed</div>
          <div className="col-sm-6">Loading...</div>
        </div>
      </div>
    </div>
  );
}
