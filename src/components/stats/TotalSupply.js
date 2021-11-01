export default function TotalSupply(props) {
  return (
    <div className="col-md-6 border">
      <p className="fw-bold">{props.token.symbol} Supply</p>
      <p>Max Supply (?)</p>
      <p>Total Supply</p>
      <p>Unclaimed</p>
    </div>
  );
}
