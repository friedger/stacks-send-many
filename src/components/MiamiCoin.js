import React from 'react';
import { Link } from '@reach/router';

export function MiamiCoin() {
  return (
    <div className="container pt-3">
      <h3>MiamiCoin</h3>
      <p>
        Max Supply: <code>(Block Height - Start Block Height) * 250,000 for first 10k blocks</code>
      </p>
      <p>
        Total Supply: <code>getMiaTotalSupply()</code>
      </p>
      <p>
        MIA Wallet: <code>getBalance()</code>
      </p>
      <Link to="/" className="btn btn-outline-primary">
        Back Home
      </Link>
    </div>
  );
}
