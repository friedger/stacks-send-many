import React from 'react';
import { AlertMobile } from '../components/AlertMobile';
import { useConnect } from '../lib/auth';

// Landing page with Stacks Connect for authentication

export default function Landing(props) {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="Landing">
      <AlertMobile />
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container pt-3">
          <h1>Introducing CityCoins</h1>
          <p className="h5">
            CityCoins gives communities the power to improve their cities, while providing crypto
            rewards to individual contributors and city governments alike.
          </p>
          <p className="h5">
            Each city has their own coin, starting with Miami and MiamiCoin ($MIA).
          </p>
          <h2 className="mt-4">Activation</h2>
          <p className="h5">
            CityCoins only exist through mining, which requires 20 independent wallets to signal
            activation once the contract is deployed.
          </p>
          <p className="h5">No ICO, no pre-sale, no pre-mine.</p>
          <h2 className="mt-4">Mining</h2>
          <p className="h5">
            Anyone can mine CityCoins by forwarding STX into a CityCoins smart contract on the
            Stacks blockchain.
          </p>
          <p className="h5">
            30% of the STX that miners forward is sent directly to a reserved wallet for the city.
          </p>
          <h2 className="mt-4">Stacking</h2>
          <p className="h5">
            The remaining 70% of the STX that miners forward is distributed to CityCoin holders who
            Stack their tokens.
          </p>
          <p className="h5">
            Stacking requires holders to lock their CityCoins for determined “reward cycles”, where
            they are transferred to the smart contract and can be reclaimed after the cycles are
            complete.
          </p>
          <p className="h5">
            Stacking CityCoins earns STX rewards from CityCoin miners. STX rewards can further be
            stacked on Stacks to earn BTC rewards.
          </p>
          <button
            className="btn btn-lg btn-outline-primary mt-4"
            type="button"
            onClick={handleOpenAuth}
          >
            Read the Docs
          </button>
          <button
            className="btn btn-lg btn-outline-primary mt-4 ms-3"
            type="button"
            onClick={handleOpenAuth}
          >
            Get Started!
          </button>
        </div>
      </div>
    </div>
  );
}
