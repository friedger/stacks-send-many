import { Link } from '@reach/router';
import SelectCity from '../components/common/SelectCity';

export default function NotFound() {
  return (
    <div>
      <div className="text-center">
        <h3 className="mb-3">404 - Not Found!</h3>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <p>Please use the navigation to select a new page.</p>
      </div>
      <hr />
      <div class="row align-items-center">
        <div class="col-md-3">
          <Link to="/" className="btn btn-lg btn-outline-primary">
            Back Home
          </Link>
        </div>
        <div class="col-md-9">
          <SelectCity />
        </div>
      </div>
    </div>
  );
}
