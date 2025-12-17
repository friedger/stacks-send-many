import { disconnect, isConnected } from '@stacks/connect';
import { useEffect, useState } from 'react';
import { useWalletConnect } from '../lib/hooks';
// Authentication button adapting to status

export default function Auth() {
  const { wcClient, wcSession, setWcSession } = useWalletConnect();
  const [isAuthed, setIsAuthed] = useState<boolean>(isConnected() || !!wcSession);

  // Update auth state when connection status changes
  useEffect(() => {
    setIsAuthed(isConnected() || !!wcSession);
  }, [wcSession, isAuthed]);

  if (isAuthed) {
    return (
      <button
        className="btn btn-primary btn-lg align-self-center m-1"
        onClick={() => {
          console.log('signOut');
          if (isConnected()) {
            disconnect();
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
