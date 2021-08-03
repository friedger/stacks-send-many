import React from 'react';
import { CityCoinRegister } from '../components/CityCoinRegister';
import { useStxAddresses } from '../lib/hooks';

export default function CityCoinRegistration({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="container">
      <CityCoinRegister ownerStxAddress={ownerStxAddress} />
    </main>
  );
}
