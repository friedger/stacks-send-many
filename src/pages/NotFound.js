import { Link } from '@reach/router';
import SelectCity from '../components/common/SelectCity';
import { testnet } from '../lib/stacks';

export default function NotFound() {
  return (
    <div>
      <div className="text-center">
        <h3 className="mb-3">404 - Not Found!</h3>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <p>Please use the navigation to select a new page.</p>
      </div>
      <hr />
      <div className="row align-items-center">
        <div className="col-md-3">
          <Link
            to={`/${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
            className="btn btn-lg btn-outline-primary"
          >
            Back Home
          </Link>
        </div>
        <div className="col-md-9">
          <SelectCity />
        </div>
      </div>
    </div>
  );
}
