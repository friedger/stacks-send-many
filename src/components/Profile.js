import React, { useState, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { Address } from './Address';
import { Amount } from './Amount';
import { Jdenticon } from 'react-jdenticon';

export function Profile({ userSession }) {
  if (userSession?.isUserSignedIn()) {
    return (
      <>
        <img src="/stacks.png" width="50" height="50" alt="Logo" />
      </>
    );
  } else {
    return null;
  }
}
