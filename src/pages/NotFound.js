import { Link } from '@reach/router';
import { isTestnet } from '../lib/stacks';

export default function NotFound() {
  return (
    <div>
      <div className="text-center">
        <h3 className="mb-3">Page Not Found!</h3>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <p>Please use the navigation to select a new page.</p>
      </div>
      <div className="row align-items-center">
        <div className="col text-center">
          <Link
            to={`/${isTestnet ? '?chain=testnet' : '?chain=mainnet'}`}
            className="btn btn-lg btn-outline-primary"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
