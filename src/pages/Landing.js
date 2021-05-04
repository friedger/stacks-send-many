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
            <h1 className="landing-heading">Send Many</h1>
            <p className="lead">
              A UI to interact with the smart contract "send-many" and "send-many-memo"
            </p>

            <p className="alert alert-info  border-info">
              Send Many is an{' '}
              <a
                href="https://github.com/friedger/stacks-send-many"
                target="_blank"
                rel="noopener noreferrer"
              >
                open source
              </a>{' '}
              web app with the purpose of{' '}
              <strong>helping everybody to send and view bulk STX transfers.</strong>
            </p>

            <div className="card mt-4 border-info">
              <div className="card-header">
                <h5 className="card-title">About Stacks</h5>
              </div>
              <div className="row">
                <div className="col col-md-12 p-4">
                  <a href="https://explorer.stacks.co" target="_blank" rel="noopener noreferrer">
                    Stacks
                  </a>{' '}
                  is blockchain based on Proof of Transfer.
                </div>
              </div>
            </div>

            <div className="card mt-4 border-info">
              <div className="card-header">
                <h5 className="card-title">Send Many</h5>
              </div>
              <div className="card-body">
                <p className="card-text mb-3">Make and view bulk STX transfers.</p>
              </div>

              <p className="card-link mb-5">
                <button className="btn btn-outline-primary" type="button" onClick={handleOpenAuth}>
                  Start now
                </button>
              </p>

              <div className="card-footer text-info">
                <strong>With additional features for Friedger Pool payouts</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
