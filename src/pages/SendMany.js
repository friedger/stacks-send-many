import React from 'react';
import Profile from '../components/Profile';
import { SendManyInputContainer } from '../components/SendManyInputContainer';
import { SendManyTxList } from '../components/SendManyTxList';
import { testnet } from '../lib/constants';
import { useStxAddresses } from '../lib/hooks';

export default function SendMany({ userSession }) {
  const { ownerStxAddress, appStxAddress } = useStxAddresses(userSession);
  return (
    <main className="panel-welcome mt-5 container">
      <div className="lead row mt-5">
        <div className="col-xs-10 col-md-12 mx-auto px-4 mb-4">
          <Profile
            stxAddresses={{
              ownerStxAddress,
              appStxAddress
            }}
            userSession={userSession}
          />
        </div>
      </div>
    </main>
  );
}
