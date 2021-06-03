import React from 'react';
import { Profile } from '../components/Profile';
import { CityCoinContainer } from '../components/CityCoinContainer';
import { useStxAddresses } from '../lib/hooks';
import { CityCoinTxList } from '../components/CityCoinTxList';
import { PoxInfo } from '../components/PoxInfo';

export default function CityCoin({ userSession }) {
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
                   <hr />
                  <PoxInfo />
                </div>
              </div>

              <div className="col-sm-12 col-md-8 p-4 container">
                <div className="col-xs-10 col-md-12 p-2 bg-white p-4 shadow rounded">
                  <CityCoinContainer />
                </div>
                <div className="col-xs-10 col-md-12 p-2 bg-white p-4 shadow rounded  mt-4">
                  <CityCoinTxList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
