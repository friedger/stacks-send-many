// TODO: buttons disabled unless user either
// has a city selected (dashboard/stats) or
// is logged in with web wallet (mining/stacking)

import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { userSessionState } from '../../lib/auth';

// take city as input

export default function NavBar(props) {
  console.log(`city: ${props.city}`);
  console.log(`symbol: ${props.symbol}`);
  console.log(`path: ${props.path}`);
  const basePath = `/${props.symbol.toLowerCase()}`;
  const navArray = ['Dashboard', 'Stats', 'Activation', 'Mining', 'Stacking', 'Tools'];
  const [userSession] = useAtom(userSessionState);
  console.log(`signedIn? ${userSession?.isUserSignedIn()}`);

  return (
    <>
      <nav>
        <ul className="nav nav-pills flex-column flex-md-row flex-nowrap align-items-center justify-content-center">
          {navArray.map(value => (
            <li className="nav-item" key={value}>
              <Link
                to={basePath + '/' + value.toLowerCase()}
                className={`nav-link ${value.toLowerCase() === props.path && 'active'}`}
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
