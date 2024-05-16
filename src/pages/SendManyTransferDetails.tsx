import React from 'react';
import { SendManyTransfer } from '../components/SendManyTransfer';

import { useConnect } from '../lib/auth';

export default function SendManyTransferDetails({
  txId,
  eventIndex,
}: {
  txId?: string;
  eventIndex?: number;
}) {
  const { userSession } = useConnect();

  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">STX Transfer</h1>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          <SendManyTransfer
            txId={txId!}
            eventIndex={eventIndex!}
            // ownerStxAddress={ownerStxAddress}
            userSession={userSession}
          />
        </div>
      </div>
    </main>
  );
}
