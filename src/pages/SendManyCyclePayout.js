import React from 'react';
import { SendManyGroupTxs } from '../components/SendManyGroupTxs';
import { useStxAddresses } from '../lib/hooks';

const cycles = {
  3: ['0xb855ff8858f6942dbc80815b4b143bb5f880f8d293e0871be492cf2c2c506397'],
  4: [
    '0x267d42288692908ee4eb54b54534dfecf62c69b3d6863897d679920aba1369ab',
    '0x329b7709253e964828509995028f98c295e3524c82275e6220d94964e2cc751a',
  ],
  5: [
    '0xa0d55e253db024eefaa43abf940760e2b1a97dd16d3251fee24f27a6632716bf',
    '0x2d5a2e0256ea9d3cd536ab4c4cf7875a0c2e1031f80b2bb3fd37fa160aa293f0',
    '0x5a42ebdce2f7e8474c91d382eadaad3e8fee026c9360bfd5e3f57dc6a6255f7f',
  ],
  6: [
    '0x5a8aceb985db569edc5cee79eea254fb9b0b241f2ae29dd6d0b4772132a34448',
    '0xebc0c7cdd5b0719b8abd155e2666fca0f7477e5085991242e72e5996ab9da004',
    '0x728ddb8092dc249e0233e184354b07e2ba29d2bc1cdac3be624ea1e63487420f',
    '0xb568822115b4e20cea0de761a90afbb18aeabaa116b98922ff6bf8d821603ba5',
  ],
};
export default function SendManyDetails({ userSession, cycleId }) {
  const { ownerStxAddress } = useStxAddresses();
  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-8 mx-auto px-4">
          <h1 className="card-title">Send-Many Transaction</h1>
        </div>
        <div className="col-xs-10 col-md-8 mx-auto mb-4 px-4">
          {cycles[cycleId] ? (
            <SendManyGroupTxs
              txList={cycles[cycleId]}
              ownerStxAddress={ownerStxAddress}
              userSession={userSession}
            />
          ) : (
            <>
              Not found! Cycle #{cycleId} wasn't paid out will be only in the future.
              <br />
              Payout data available for cylces:{' '}
              {Object.keys(cycles).map(cycleId => (
                <>
                  <a href={`/cycle/${cycleId}`}>#{cycleId}</a>{' '}
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
