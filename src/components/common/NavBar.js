// TODO: buttons disabled unless user either
// has a city selected (dashboard/stats) or
// is logged in with web wallet (mining/stacking)

import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { userSessionState } from '../../lib/auth';

export default function NavBar(props) {
  const basePath = `/${props.symbol.toLowerCase()}`;
  const navArray = ['Dashboard', 'Stats', 'Activation', 'Mining', 'Stacking', 'Tools'];
  const [userSession] = useAtom(userSessionState);

  return (
    <>
      <nav>
        <ul className="nav nav-pills flex-column flex-md-row flex-nowrap align-items-center justify-content-center">
          {navArray.map((value, idx) => (
            <li className="nav-item" key={value}>
              <Link
                to={basePath + '/' + value.toLowerCase()}
                className={`nav-link ${value.toLowerCase() === props.path && 'active'} ${
                  idx > 1 && !userSession.isUserSignedIn() && 'disabled'
                }`}
              >
                {value}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <hr />
    </>
  );
}
