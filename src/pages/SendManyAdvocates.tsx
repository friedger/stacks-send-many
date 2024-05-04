import React from 'react';
import { SendManyGroupTxs } from '../components/SendManyGroupTxs';
import { chainSuffix } from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';

const payouts = {
  1: [
    '0x5fd15fb5904f11eeac944a1e4a03a2843234a9b5eff5438c55d29483a5eac328',
    '0xe4765db3c6e923d93b026b3f4ef13b6b96aa5f9bd8f3e5ae0d29a935b66f7ad9',
    '0x07754658869f3a8f55ef9f3a6d8b4539fd507ea25ff69bde75ec321809b74b95',
    '0x6c61e7eb2d4ae820759609c8f98a6eaf92bf1b651cbd5a8a203df4f0231bd812',
  ],
  2: [
    '0x03aa24c49ffe17820c874bc9d7da89cced57bf6c8dbc373adb21957936fd6959',
  ],
};
export default function SendManyDetails({ userSession, payoutId }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">Send-Many Transaction</h1>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          {payouts[payoutId] ? (
            <SendManyGroupTxs
              txList={payouts[payoutId]}
              ownerStxAddress={ownerStxAddress}
              userSession={userSession}
            />
          ) : (
            <>
              Not found! Payout #{payoutId} wasn't paid out.
              <br />
              Payout data available for cylces:{' '}
              {Object.keys(payouts).map(payoutId => (
                <>
                  <a href={`/advocates/${payoutId}${chainSuffix}`}>#{payoutId}</a>{' '}
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
