import React from 'react';
import { Profile } from '../components/Profile';
import { CityCoinContainer } from '../components/CityCoinContainer'
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
          <div className="Profile position-sticky">
            <div className="row">
              <div className="col-sm-12 col-md-4 ">
                <div className="shadow p-4 m-4 mx-auto bg-light rounded sticky-top sticky-top-profile">
                  <Profile
                    stxAddress={ownerStxAddress}
                    updateStatus={s => {
                      console.log(s);
                    }}
                    showAddress
                  />
                </div>
              </div>

              <div className="col-sm-12 col-md-8 p-4 container">
                <div className="col-xs-10 col-md-12 p-2 bg-white p-4 shadow rounded">
                  <CityCoinContainer />
                </div>
                <div className="col-xs-10 col-md-12 mx-auto my-4 py-4 bg-light rounded">
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
