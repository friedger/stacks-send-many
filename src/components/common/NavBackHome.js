import { Link } from '@reach/router';
import { testnet } from '../../lib/stacks';
import SelectCity from './SelectCity';

export default function NavBackHome() {
  return (
    <div className="row align-items-center">
      <div className="col-md-3 mb-4 mb-md-0 text-center text-md-start">
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
  );
}
