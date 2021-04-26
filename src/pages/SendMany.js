import React from 'react';
import { SendManyButton } from '../components/SendManyButton';
import { SendManyTxList } from '../components/SendManyTxList';
import { useStxAddresses } from '../lib/hooks';

export default function SendMany({ userSession }) {
  const { ownerStxAddress } = useStxAddresses();
  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">Send Many</h1>
          Send STX to many addresses in one transaction.
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          <SendManyButton ownerStxAddress={ownerStxAddress} />
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          <SendManyTxList ownerStxAddress={ownerStxAddress} userSession={userSession} />
        </div>
        <div className="card col-md-8 mx-auto mt-5 mb-5 text-center px-0 border-warning">
          <div className="card-header">
            <h5 className="card-title">Instructions</h5>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              Enter recipients and amounts one per line, separate both with semicolon
            </li>
            <li className="list-group-item">Review the data</li>
            <li className="list-group-item">Click send</li>
            <li className="list-group-item">
              Follow the instructions on your wallet to complete the transaction.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
