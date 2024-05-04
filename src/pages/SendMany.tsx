import React from 'react';
import { Instructions } from '../components/Instructions';
import { Profile } from '../components/Profile';
import { SendManyInputContainer } from '../components/SendManyInputContainer';
import { SendManyTxList } from '../components/SendManyTxList';
import {
  NOT_ASSET,
  SBTC_CONTRACT,
  WMNO_ASSET,
  WRAPPED_BITCOIN_ASSET,
  mocknet,
  testnet,
} from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';

export default function SendMany({
  asset,
  assetContract,
  sendManyContract,
}: {
  asset?: string;
  assetContract?: string;
  sendManyContract: string;
}) {
  const { ownerStxAddress } = useStxAddresses();
  console.log({ assetContract });
  if (!ownerStxAddress) {
    return <div>Loading</div>;
  }

  let assetId;
  if (asset === 'xbtc') {
    assetId = WRAPPED_BITCOIN_ASSET;
  } else if (asset === 'sbtc') {
    assetId = `${assetContract || SBTC_CONTRACT}::sbtc`;
  } else if (asset === 'wmno') {
    assetId = WMNO_ASSET;
  } else if (asset === 'not') {
    assetId = NOT_ASSET;
  } else {
    // for stx, assetId is ignored
    assetId = undefined;
  }

  return (
    <main className="panel-welcome mt-2 container">
      <div className="lead row mt-2">
        <div className="col-xs-10 col-md-12 mx-auto px-1 mb-4">
          <div className="Profile">
            <div className="row">
              <div className="col-sm-12 col-md-4 ">
                <div className="p-4 m-4 mx-auto bg-light">
                  <Profile stxAddress={ownerStxAddress} asset={asset} assetId={assetId} />
                </div>
                <div className="p-4 m-4 mx-auto bg-light">
                  <Instructions />
                </div>
              </div>

              <div className="col-sm-12 col-md-8 p-4 container">
                <div className="col-xs-10 col-md-12 bg-light p-4">
                  <div className="text-right">
                    {asset !== 'stx' && (
                      <a href="/" className="small">
                        Send {testnet || mocknet ? 'Test' : ''} STX <div></div>
                      </a>
                    )}
                    {asset !== 'sbtc' && (
                      <a href="/sbtc" className="small">
                        Send {testnet || mocknet ? 'Test' : ''} sBTC <div></div>
                      </a>
                    )}
                    {asset !== 'xbtc' && (
                      <a href="/xbtc" className="small">
                        Send {testnet || mocknet ? 'Test' : ''} xBTC <div></div>
                      </a>
                    )}
                    {asset !== 'not' && (
                      <a href="/not" className="small">
                        Send {testnet || mocknet ? 'Test' : ''} $NOT{' '}
                      </a>
                    )}
                  </div>
                  <h3 className="font-weight-bold mb-4">
                    Send {testnet || mocknet ? 'Test' : ''} {asset === 'stx' && 'Stacks (STX)'}
                    {asset === 'sbtc' && 'Wrapped Bitcoin (sBTC DR 0.1)'}
                    {asset === 'xbtc' && 'Wrapped Bitcoin (xBTC)'}
                    {asset === 'wmno' && 'Wrapped Nothing (WMNO)'}
                    {asset === 'not' && 'Nothing (NOT)'}
                  </h3>
                  {asset === 'sbtc' && (
                    <>
                      <p>
                        <b>
                          SBTC Send Many Contract is only experimental on testnet and not safe to
                          use. You are sharing the escrow contract with other users.
                        </b>
                      </p>
                      <p>
                        Using asset{' '}
                        <a
                          href={`https://explorer.hiro.so/address/${
                            assetContract || SBTC_CONTRACT
                          }?chain=testnet`}
                        >
                          {assetId}
                        </a>
                        .
                      </p>
                    </>
                  )}
                  <SendManyInputContainer
                    ownerStxAddress={ownerStxAddress}
                    asset={asset}
                    assetId={assetId}
                    sendManyContract={sendManyContract}
                  />
                </div>
                {asset === 'stx' && (
                  <div className="col-xs-10 col-md-12 mx-auto my-4 py-4 bg-light">
                    <SendManyTxList ownerStxAddress={ownerStxAddress} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
