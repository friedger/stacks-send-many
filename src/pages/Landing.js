import React from 'react';
import { AlertMobile } from '../components/AlertMobile';
import { useConnect } from '../lib/auth';

// Landing page with Stacks Connect for authentication

export default function Landing({ userSession }) {
  const { handleOpenAuth } = useConnect();

  if (userSession?.isUserSignedIn()) {
    return (
      <div>
        <p>Logged in!</p>
      </div>
    );
  } else {
    return (
      <div className="Landing">
        <AlertMobile />
        <div className="jumbotron jumbotron-fluid pt-3 mb-0">
          <div className="container">
            <h1>Introducing CityCoins</h1>
            <p className="h5">
              CityCoins gives communities the power to improve their cities, while providing crypto
              rewards to individual contributors and city governments alike. Each city has their own
              coin, starting with{' '}
              <a
                href="https://www.citycoins.co/miamicoin"
                className="text-decoration-none"
                target="_blank"
                rel="noreferrer"
              >
                Miami and MiamiCoin (MIA)
              </a>
              .
            </p>
            <div className="row">
              <div className="col-md">
                <h2 className="mt-4">
                  <i className="bi bi-activity"></i> Activation
                </h2>
                <p className="h5">
                  CityCoins only exist through mining, which does not begin until 20 independent
                  wallets signal activation after the contract is deployed. No ICO, no pre-sale, no
                  pre-mine.
                </p>
              </div>
              <div className="col-md">
                <h2 className="mt-4">Mining</h2>
                <p className="h5">
                  Anyone can mine CityCoins by forwarding STX into a CityCoins smart contract on the
                  Stacks blockchain. 30% of the STX that miners forward is sent directly to a
                  reserved wallet for the city.
                </p>
              </div>
              <div className="col-md">
                <h2 className="mt-4">Stacking</h2>
                <p className="h5">
                  Anyone can Stack CityCoins by locking them in a CityCoins smart contract for
                  determined "reward cycles", and recieve a portion of the remaining 70% of the STX
                  sent by miners.
                </p>
              </div>
            </div>
            <div className="text-center mt-3">
              <a
                href="https://docs.citycoins.co"
                target="_blank"
                rel="noreferrer"
                className="btn btn-lg btn-outline-primary mt-4"
              >
                Read the Docs
              </a>
              <button
                className="btn btn-lg btn-outline-primary mt-4 ms-3"
                type="button"
                onClick={handleOpenAuth}
              >
                Get Started!
              </button>
              <p className="mt-3 fs-6 fst-italic">
                * Requires the{' '}
                <a href="https://www.hiro.so/wallet/install-web" target="_blank" rel="noreferrer">
                  Hiro Wallet Browser Extension
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
