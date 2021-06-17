import React from 'react';
import { useConnect } from '../lib/auth';

// Landing page with Stacks Connect for authentication

export default function Landing(props) {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container">
          <div className="panel-landing text-center mt-3">
            <p className="alert alert-info  border-info">
              Support your favorite cities while earning yield in Bitcoin.
            </p>

            <div className="card mt-4 border-info">
              <div className="card-header">
                <h5 className="card-title">CityCoins on the Stacks Blockchain</h5>
              </div>
              <div className="card-body">
                <p className="card-text mb-3 text-left">
                  With CityCoins, you can earn Bitcoin (BTC) and Stacks (STX) yield for yourself
                  while the city accumulates crypto in a reserved treasury wallet as a result. Each
                  city has their own coin, starting with Miami and MiamiCoin ($MIA).
                </p>
                <p className="card-text mb-3 text-left">
                  <span className="font-weight-bold">Registration: </span>
                  CityCoins only exist through mining, which requires 20 independent wallets to
                  signal activation once the contract is deployed. No ICO, no pre-mine.
                  <br />
                  <br />
                  <span className="font-weight-bold">Mining: </span>
                  Anyone can mine CityCoins by forwarding STX into a CityCoins smart contract on the
                  Stacks blockchain. 30% of the STX that miners forward is sent directly to a
                  reserved wallet for the city.
                  <br />
                  <br />
                  <span className="font-weight-bold">Stacking: </span>
                  The remaining 70% of the STX that miners forward is distributed to CityCoin
                  holders who stack their tokens. Stacking CityCoins yields STX rewards, which can
                  further be stacked to yield BTC rewards.
                </p>
              </div>

              <p className="card-link mb-5">
                <button className="btn btn-outline-primary" type="button" onClick={handleOpenAuth}>
                  Get Started!
                </button>
              </p>

              <div className="card-footer text-info">
                <strong>
                  View{' '}
                  <a href="https://docs.citycoins.co" rel="noopener" target="_blank">
                    our documentation
                  </a>{' '}
                  for more info!
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
