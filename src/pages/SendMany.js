import React from 'react';
import { Instructions } from '../components/Instructions';
import { Profile } from '../components/Profile';
import { SendManyInputContainer } from '../components/SendManyInputContainer';
import { SendManyTxList } from '../components/SendManyTxList';
import { mocknet, testnet } from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';

export default function SendMany({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="panel-welcome mt-2 container">
      <div className="lead row mt-2">
        <div className="col-xs-10 col-md-12 mx-auto px-1 mb-4">
          <div className="Profile">
            <div className="row">
              <div className="col-sm-12 col-md-4 ">
                <div className="p-4 m-4 mx-auto bg-light">
                  <Profile
                    stxAddress={ownerStxAddress}
                    updateStatus={s => {
                      console.log(s);
                    }}
                    showAddress
                  />
                </div>
                <div className="p-4 m-4 mx-auto bg-light">
                  <Instructions />
                </div>
              </div>

              <div className="col-sm-12 col-md-8 p-4 container">
                <div className="col-xs-10 col-md-12 p-2 bg-light">
                  <h3 className="font-weight-bold">
                    Send {testnet || mocknet ? 'Test' : ''} Stacks (STX)
                  </h3>
                  <SendManyInputContainer ownerStxAddress={ownerStxAddress} />
                </div>
                <div className="col-xs-10 col-md-12 mx-auto my-4 py-4 bg-light">
                  <SendManyTxList ownerStxAddress={ownerStxAddress} userSession={userSession} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
