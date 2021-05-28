import React, { useEffect, useState } from 'react';
import { userSessionState } from '../lib/auth';
import { useStxAddresses } from '../lib/hooks';
import { useAtomValue } from 'jotai/utils';
import { CityCoinRegister } from './CityCoinRegister';
import { CityCoinMining } from './CityCoinMining';
import { CityCoinMiningClaim } from './CityCoinMiningClaim';
import { CityCoinStacking } from './CityCoinStacking';
import { CityCoinStackingClaim } from './CityCoinStackingClaim';
import { getMiningActivationStatus } from '../lib/citycoin';

export function CityCoinContainer() {
  const userSession = useAtomValue(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);

  const [miningActivated, setMiningActivated] = useState();

  useEffect(() => {
    getMiningActivationStatus()
      .then(result => {
        setMiningActivated(result);
      })
      .catch(e => {
        setMiningActivated(false);
        console.log(e);
      });
  }, []);

  // TODO: change back to !miningActivated when done

  if (miningActivated) {
    return (
      <div>
        <CityCoinRegister ownerStxAddress={ownerStxAddress} />
      </div>
    );
  } else {
    return (
      <div>
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
}
