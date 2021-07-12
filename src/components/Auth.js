import React from 'react';
import { useConnect, userSessionState } from '../lib/auth';
import { useAtom } from 'jotai';
// Authentication button adapting to status

export default function Auth() {
  const { handleSignOut } = useConnect();
  const [userSession] = useAtom(userSessionState);

  if (userSession?.isUserSignedIn()) {
    return (
      <button
        className="btn btn-primary btn-lg align-self-center m-1"
        onClick={() => {
          console.log('signOut');
          handleSignOut();
        }}
      >
        Log Out
      </button>
    );
  } else {
    return null;
  }
}
