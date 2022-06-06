import { Link } from '@reach/router';
import { useUpdateAtom } from 'jotai/utils';
import { useConnect } from '../../lib/auth';
import { CHAIN_SUFFIX } from '../../lib/stacks';
import { currentRouteAtom } from '../../store/cities';

export default function Unauthorized() {
  const setCurrentRoute = useUpdateAtom(currentRouteAtom);
  const { handleOpenAuth } = useConnect();

  return (
    <>
      <div className="text-center">
        <h3 className="my-3">Not Logged In!</h3>
        <p>
          This page requires logging in with the{' '}
          <a href="https://hiro.so/wallet/install-web" target="_blank" rel="noreferrer">
            Hiro Wallet Browser Extension
          </a>{' '}
          or{' '}
          <a href="https://xverse.app/" target="_blank" rel="noreferrer">
            Xverse Mobile Wallet
          </a>
          . .
        </p>
        <p>Please check that you have the wallet installed and enabled.</p>
      </div>
      <div className="row align-items-center mb-3">
        <div className="col text-center">
          <button
            className="btn btn-md btn-outline-primary me-3"
            type="button"
            onClick={handleOpenAuth}
          >
            Connect Wallet
          </button>
          <Link
            to={`/dashboard${CHAIN_SUFFIX}`}
            className="btn btn-md btn-outline-primary"
            onClick={() => {
              setCurrentRoute({ loaded: true, data: 'dashboard' });
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
