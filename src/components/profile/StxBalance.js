export default function StxBalance({ balance, symbol }) {
  return (
    <div className="row align-items-center">
      <div className="col-4 text-nowrap text-right">{balance}</div>
      <div className="col-4 text-center">{symbol.toUpperCase()}</div>
      <div className="w-100"></div>
    </div>
  );
}
