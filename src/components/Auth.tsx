import { disconnect, isConnected } from '@stacks/connect';
import { useEffect, useState } from 'react';
import { useWalletConnect } from '../lib/hooks';
import { useNavigate } from 'react-router-dom';
// Authentication button adapting to status

export default function Auth() {
  const { wcClient, wcSession, setWcSession } = useWalletConnect();
  const [isAuthed, setIsAuthed] = useState<boolean>(() => isConnected() || !!wcSession);

  const navigate = useNavigate();

  // Update auth state when connection status changes
  useEffect(() => {
    setIsAuthed(isConnected() || !!wcSession);
  }, [wcSession]);

  const handleLogout = async () => {
    console.log('signOut');
    try {
      if (isConnected()) {
        disconnect();
      }

      if (wcSession) {
        await wcClient?.disconnect({ topic: wcSession.topic, reason: { code: 1, message: '' } });
        setWcSession(null);
      }
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsAuthed(false);
      navigate('/landing', { replace: true });
    }
  };

  if (isAuthed) {
    return (
      <button className="btn btn-primary btn-lg align-self-center m-1" onClick={handleLogout}>
        Log Out
      </button>
    );
  } else {
    return null;
  }
}
