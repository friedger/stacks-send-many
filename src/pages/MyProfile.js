import React from 'react';
import Profile from '../components/Profile';
import { useStxAddresses } from '../lib/hooks';

export default function MyProfile({ userSession }) {
  console.log(userSession);
  const { ownerStxAddress, appStxAddress } = useStxAddresses(userSession);

  return (
    <main className="panel-welcome mt-5 container">
      <div className="row">
        <div className="mx-auto col-sm-10 col-md-8 px-4">
          <Profile
            stxAddresses={{
              appStxAddress: appStxAddress,
              ownerStxAddress: ownerStxAddress,
            }}
            userSession={userSession}
          />
        </div>
      </div>
    </main>
  );
}
