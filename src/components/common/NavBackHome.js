import { Link } from '@reach/router';
import SelectCity from './SelectCity';

export default function NavBackHome() {
  return (
    <div class="row align-items-center">
      <div class="col-md-3 mb-4 mb-md-0 text-center text-md-start">
        <Link to="/" className="btn btn-lg btn-outline-primary">
          Back Home
        </Link>
      </div>
      <div class="col-md-9">
        <SelectCity />
      </div>
    </div>
  );
}
