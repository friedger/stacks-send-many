import React from 'react';
import { AlertMobile } from '../components/AlertMobile';
import { CityCoinContainer } from '../components/CityCoinContainer';
import { useStxAddresses } from '../lib/hooks';

export default function CityCoinActions({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="container">
      <AlertMobile />
      <CityCoinContainer />
    </main>
  );
}
