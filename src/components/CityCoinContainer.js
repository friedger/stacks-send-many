import React from 'react';
import { userSessionState } from '../lib/auth';
import { useStxAddresses } from '../lib/hooks';
import { useAtomValue } from 'jotai/utils';
import { CityCoinRegister } from './CityCoinRegister';
import { CityCoinMining } from './CityCoinMining';
import { CityCoinMiningClaim } from './CityCoinMiningClaim';
import { CityCoinStacking } from './CityCoinStacking';
import { CityCoinStackingClaim } from './CityCoinStackingClaim';

export function CityCoinContainer() {
  const userSession = useAtomValue(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);

  return (
    <div>
      <div>
        <CityCoinRegister ownerStxAddress={ownerStxAddress} />
      </div>
      <br />
      <hr />
      <br />
      <div>
        <CityCoinMining />
      </div>
      <br />
      <hr />
      <br />
      <div>
        <CityCoinMiningClaim />
      </div>
      <br />
      <hr />
      <br />
      <div>
        <CityCoinStacking />
      </div>
      <br />
      <hr />
      <br />
      <div>
        <CityCoinStackingClaim />
      </div>
    </div>
  );
}
