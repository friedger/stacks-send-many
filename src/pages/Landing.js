import React from 'react';
import { useConnect } from '../lib/auth';

// Landing page demonstrating Blockstack connect for registration

export default function Landing(props) {
  const { handleOpenAuth } = useConnect();

  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container">
          <div className="panel-landing text-center mt-3">
            <p className="lead">
              A UI to interact with the CityCoins smart contract.
            </p>

            <p className="alert alert-info  border-info">
              CityCoins are a way to support a city by mining, buying, or holding their citycoin, all while generating yield in STX and BTC.
            </p>

            <div className="card mt-4 border-info">
              <div className="card-header">
                <h5 className="card-title">Proof of Transfer with Purpose</h5>
              </div>
              <div className="card-body">
                <p className="card-text mb-3 text-left">
                  The CityCoin will leverage the properties of the Proof of Transfer (PoX) consensus 
                  mechanism of the Stacks blockchain, programmed through a smart contract in Clarity, 
                  as a way to generate new funding and wealth building opportunities for the city, its 
                  inhabitants, and its supporters.
                </p>
                <p className="card-text mb-3 text-left">
                  The CityCoin will not have its own blockchain, but rather will exist on the Stacks 
                  blockchain as a fungible token adhering to the SIP-010 standard. The Stacks blockchain 
                  is a layer one blockchain that settles on top of the Bitcoin blockchain, inheriting its 
                  security.
                </p>
                <p className="cart-text mb-3 text-left">
                  The CityCoin will not have an initial coin offering (ICO), but instead will be fairly mined 
                  in competition with anyone who wishes to interact with the contract, and following a diminishing 
                  issuance schedule similar to that of Bitcoin and Stacks.
                </p>
                <p className="cart-text mb-3 text-left">
                  When miners submit a transaction to the contract, 30% of the STX spent will be sent to the 
                  designated city's wallet overseen by a trusted third party custodian. The remaining 70% of 
                  the spent STX will be distributed to the city's coin holders who lock their tokens in support 
                  of the initiative.
                </p>
              </div>

              <p className="card-link mb-5">
                <button className="btn btn-outline-primary" type="button" onClick={handleOpenAuth}>
                  Get Started!
                </button>
              </p>

              <div className="card-footer text-info">
                <strong>Alpha version - for testing only!</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
