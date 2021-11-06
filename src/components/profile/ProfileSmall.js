import React from 'react';
import { ProfileFull } from './ProfileFull';
import { useStxAddresses } from '../../lib/hooks';
import { Address } from '../Address';

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
          <i className="bi bi-person-circle me-2" />
          {ownerStxAddress ? <Address addr={ownerStxAddress} /> : 'Profile'}
        </a>

        <ProfileFull />
      </>
    );
  } else {
    return null;
  }
}
