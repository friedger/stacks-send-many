import React from 'react';
import { SendManyGroupTxs } from '../components/SendManyGroupTxs';
import { chainSuffix } from '../lib/constants';
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
  7: [
    '0x31249d6f68a341f0d4a214c2cdb837ca03248614631be33403a3687117d4c893',
    '0xdbde04abacc322a7bacbb91c421998c844c1238f3ca42102ecdcf70b177e82b9',
    '0x6c24ba278eb14cf271588bf9e98b2855bc14b0263988c3ef479c41c2d581dbaa',
    '0xd14c641281eeb11da1329d9b9e488710f20959c15d276b7400ceb10e1b3c0a14',
    '0x6c0029aa859d719d65b635eadfae28b2e941c91000df0a49e5d7034268eab755',
  ],
  8: [
    '0x273fc0b873c4ec7b78064b33251de8b1f358bfcb260ca0691541b2dd5b36a9a2',
    '0xb4e9ce8ade0dd0f1539c6b55b175e530a499f963793a240a12c856a105341710',
    '0x3f51493034a6962430cb8f728612bb8ef221342fc6658633705c2e756a426cd7',
    '0x7dd6e079036232a5e832a0516f2bf87c9edbd97683f4ac16649f9d0e41aeca03',
    '0xa81402d4cf2d8e3d42b42066c5cd7c30eb642d24c1799c2d5f37449fb38bc343',
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
                  <a href={`/cycle/${cycleId}${chainSuffix}`}>#{cycleId}</a>{' '}
                </>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
