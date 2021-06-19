import React from 'react';
import { CityCoinContainer } from '../components/CityCoinContainer';
import { useStxAddresses } from '../lib/hooks';
import { CityCoinTxList } from '../components/CityCoinTxList';
import { PoxLiteInfo } from '../components/PoxLiteInfo';

export default function CityCoin({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);
  if (!userSession || !ownerStxAddress) {
    return <div>Loading</div>;
  }
  return (
    <main className="container">
      <CityCoinContainer />
      <hr />
      <CityCoinTxList />
    </main>
  );
}
