import React from 'react';
import { ProfileFull } from './ProfileFull';
import { useStxAddresses } from '../../lib/hooks';
import { Address } from '../Address';
import NetworkIndicatorIcon from './NetworkIndicatorIcon';
import { chainSuffix } from '../../lib/constants';

export function ProfileSmall(props) {
  const { ownerStxAddress } = useStxAddresses(props.userSession);

  if (props.userSession?.isUserSignedIn()) {
    return (
      <>
        <a
          className="btn btn-primary-outline btn-lg"
          data-bs-toggle="offcanvas"
          href="#offcanvasProfile"
          role="button"
          aria-controls="offcanvasProfile"
        >
          <NetworkIndicatorIcon chainSuffix={chainSuffix}/>
          {ownerStxAddress ? <Address addr={ownerStxAddress} /> : 'Profile'}
        </a>

        <ProfileFull />
      </>
    );
  } else {
    return null;
  }
}
