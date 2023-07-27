import { Link } from 'react-router-dom';
import { CHAIN_SUFFIX } from '../lib/stacks';
import { currentRouteAtom } from '../store/cities';
import { useSetAtom } from 'jotai';

export default function NotFound() {
  const setCurrentRoute = useSetAtom(currentRouteAtom);

  return (
    <div>
      <div className="text-center">
        <h3 className="my-3">Page Not Found!</h3>
        <p>Sorry, we couldn't find the page you're looking for.</p>
        <p>Please use the navigation to select a new page.</p>
      </div>
      <div className="row align-items-center">
        <div className="col text-center">
          <Link
            to={`/${CHAIN_SUFFIX}`}
            className="btn btn-lg btn-outline-primary"
            onClick={setCurrentRoute({ loaded: false, data: '' })}
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
