import { useConnect, userSessionState } from '../../lib/auth';
import { ProfileSmall } from '../profile/ProfileSmall';
import { useAtom } from 'jotai';

export default function HeaderAuth({ userSession }) {
  const { handleOpenAuth } = useConnect();
  const [user] = useAtom(userSessionState);

  if (user?.isUserSignedIn()) {
    return <ProfileSmall userSession={userSession} />;
  } else {
    return (
      <button className="btn btn-lg btn-outline-primary" type="button" onClick={handleOpenAuth}>
        Connect Wallet
      </button>
    );
  }
}
