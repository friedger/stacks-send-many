import React from 'react';
import { SendManyTx } from '../components/SendManyTx';
import { useStxAddresses } from '../lib/hooks';
import { UserSession } from '@stacks/connect';
import { RouteComponentProps } from '@reach/router';

export default function SendManyDetails({
  userSession,
  txId,
}: {
  userSession: UserSession;
  txId?: string;
} & RouteComponentProps) {
  const { ownerStxAddress } = useStxAddresses();
  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">Send-Many Transaction</h1>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          <SendManyTx txId={txId!} ownerStxAddress={ownerStxAddress} userSession={userSession} />
        </div>
      </div>
    </main>
  );
}
