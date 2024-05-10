import React from 'react';
import { useConnect } from '../lib/auth';
import { useWalletConnect } from '../lib/hooks';
// Authentication button adapting to status

export default function Auth() {
  const { handleSignOut, userSession } = useConnect();
  const { wcClient, wcSession, setWcSession } = useWalletConnect();

  if (userSession?.isUserSignedIn() || wcSession) {
    return (
      <button
        className="btn btn-primary btn-lg align-self-center m-1"
        onClick={() => {
          console.log('signOut');
          if (userSession?.isUserSignedIn()) {
            handleSignOut();
          }
          if (wcSession) {
            wcClient
              ?.disconnect({ topic: wcSession.topic, reason: { code: 1, message: '' } })
              .then(() => {
                setWcSession(null);
              });
          }
        }}
      >
        Log Out
      </button>
    );
  } else {
    return null;
  }
}
