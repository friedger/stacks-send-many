import { useWalletConnect, useStacksConnection } from '../lib/hooks';
import { useAtomValue } from 'jotai';
import { stacksConnectedState } from '../lib/auth';
import { useEffect, useState } from 'react';
// Authentication button adapting to status

export default function Auth() {
  const { wcClient, wcSession, setWcSession } = useWalletConnect();
  const { disconnectWallet } = useStacksConnection();
  const stacksConnected = useAtomValue(stacksConnectedState);
  const [isAuthed, setIsAuthed] = useState<boolean>(stacksConnected || !!wcSession);

  // Update auth state when connection status changes
  useEffect(() => {
    setIsAuthed(stacksConnected || !!wcSession);
  }, [stacksConnected, wcSession]);

  if (isAuthed) {
    return (
      <button
        className="btn btn-primary btn-lg align-self-center m-1"
        onClick={() => {
          console.log('signOut');
          if (stacksConnected) {
            disconnectWallet();
            setIsAuthed(false);
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
