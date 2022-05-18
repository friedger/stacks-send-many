import { Link } from '@reach/router';
import { useUpdateAtom } from 'jotai/utils';
import { isTestnet } from '../../lib/stacks';
import { currentRouteAtom } from '../../store/cities';

export default function Unauthorized() {
  const setCurrentRoute = useUpdateAtom(currentRouteAtom);
  return (
    <>
      <div className="text-center">
        <h3 className="mb-3">Not Logged In!</h3>
        <p>
          This page requires logging in with the{' '}
          <a href="https://hiro.so/wallet/install-web" target="_blank" rel="noreferrer">
            Hiro Wallet Browser Extension
          </a>
          .
        </p>
        <p>Please check that you have the extension installed and enabled.</p>
      </div>
      <div className="row align-items-center">
        <div className="col text-center">
          <Link
            to={`/dashboard${isTestnet ? '?chain=testnet' : '?chain=mainnet'}`}
            className="btn btn-md btn-outline-primary"
            onClick={() => {
              setCurrentRoute('dashboard');
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
