import React from 'react';
import { useConnect, userSessionState } from '../lib/auth';
import { useAtom } from 'jotai';
// Authentication button adapting to status

export default function Auth({ client, wcSession, setWcSession }) {
  const { handleSignOut } = useConnect();
  const [userSession] = useAtom(userSessionState);

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
            client.disconnect({ topic: wcSession.topic }).then(() => {
              setWcSession(undefined);
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
