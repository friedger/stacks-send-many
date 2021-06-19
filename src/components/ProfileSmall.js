import React, { useState, useEffect } from 'react';
import { ProfileFull } from '../components/ProfileFull';
import { useStxAddresses } from '../lib/hooks';

export function ProfileSmall({ userSession }) {
  const { ownerStxAddress } = useStxAddresses(userSession);

  if (userSession?.isUserSignedIn()) {
    return (
      <>
        <div>
          <a
            className="btn btn-primary-outline btn-lg"
            data-bs-toggle="offcanvas"
            href="#offcanvasProfile"
            role="button"
            aria-controls="offcanvasProfile"
          >
            <i class="bi bi-circle me-2" />
            ST123...45678
          </a>
        </div>
        <ProfileFull
          stxAddress={ownerStxAddress}
          updateStatus={s => {
            console.log(s);
          }}
          showAddress
        />
      </>
    );
  } else {
    return null;
  }
}
