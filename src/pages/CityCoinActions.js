import React from 'react';
import { CityCoinContainer } from '../components/CityCoinContainer';
import { useStxAddresses } from '../lib/hooks';

export default function CityCoinActions({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="container">
      <CityCoinContainer />
    </main>
  );
}
