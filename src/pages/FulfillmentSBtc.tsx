import React from 'react';
import { DepositBtc } from '../components/DepositBtc';
import { FulfillRequestSBtc } from '../components/FulfillRequestSBtc';
import { InstructionsFulfillmentSBtc } from '../components/InstructionsFulfillmentSBtc';
import { Profile } from '../components/Profile';
import { WithdrawSBtc } from '../components/WithdrawSBtc';
import { SBTC_CONTRACT, mocknet, testnet } from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';

export default function FulfillmentSBtc({
  assetContract,
  sendManyContract,
}: {
  assetContract?: string;
  sendManyContract?: string;
}) {
  const { ownerStxAddress } = useStxAddresses();
  if (!ownerStxAddress) {
    return <div>Loading</div>;
  }

  const [assetContractAddress] = assetContract
    ? assetContract.split('.')
    : SBTC_CONTRACT.split('.');
  const assetId = `${assetContract || SBTC_CONTRACT}::sbtc`;
  const defaultSendManyContract = `${assetContractAddress}.sbtc-send-many`;

  return (
    <main className="panel-welcome mt-2 container">
      <div className="lead row mt-2">
        <div className="col-xs-10 col-md-12 mx-auto px-1 mb-4">
          <div className="Profile">
            <div className="row">
              <div className="col-sm-12 col-md-4 ">
                <div className="p-4 m-4 mx-auto bg-light">
                  <Profile stxAddress={ownerStxAddress} asset={'sbtc'} assetId={assetId} />
                </div>
                <div className="p-4 m-4 mx-auto bg-light">
                  <InstructionsFulfillmentSBtc />
                </div>
              </div>

              <div className="col-sm-12 col-md-8 p-4 container">
                <div className="col-xs-10 col-md-12 bg-light p-4">
                  <h3 className="font-weight-bold mb-4">
                    Deposit {testnet || mocknet ? 'Test' : ''} BTC
                  </h3>
                  <DepositBtc
                    assetContract={assetContract || SBTC_CONTRACT}
                    ownerStxAddress={ownerStxAddress}
                    sendManyContract={sendManyContract || defaultSendManyContract}
                  />
                </div>
                <div className="col-xs-10 col-md-12 bg-light p-4">
                  <h3 className="font-weight-bold mb-4">
                    Fulfill request using {testnet || mocknet ? 'Test' : ''} sBTC
                  </h3>
                  <FulfillRequestSBtc
                    assetContract={assetContract || SBTC_CONTRACT}
                    ownerStxAddress={ownerStxAddress}
                    sendManyContract={sendManyContract || defaultSendManyContract}
                  />
                </div>
                <div className="col-xs-10 col-md-12 bg-light p-4">
                  <h3 className="font-weight-bold mb-4">
                    Withdraw {testnet || mocknet ? 'Test' : ''} sBTC
                  </h3>
                  <WithdrawSBtc assetContract={assetContract || SBTC_CONTRACT} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
