import React from 'react';
import { AlertMobile } from '../components/AlertMobile';
import { CityCoinRegister } from '../components/CityCoinRegister';
import { useStxAddresses } from '../lib/hooks';

export default function CityCoinRegistration({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="container">
      <AlertMobile />
      <CityCoinRegister ownerStxAddress={ownerStxAddress} />
    </main>
  );
}
