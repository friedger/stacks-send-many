export default function CityCoinBalance({ balance, symbol, version }) {
  return (
    <div className="row align-items-center">
      <div className="col-4 text-nowrap text-right">{balance}</div>
      <div className="col-4 text-center">
        {symbol.toUpperCase()} ({version})
      </div>
      <div className="col-4 text-center">
        {version === 'v1' && (
          <button
            className="btn btn-sm btn-outline-primary"
            title={`Convert V1 ${symbol.toUpperCase()} to V2 ${symbol.toUpperCase()}`}
          >
            Convert
          </button>
        )}
      </div>
    </div>
  );
}
