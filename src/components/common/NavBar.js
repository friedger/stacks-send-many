// TODO: buttons disabled unless user either
// has a city selected (dashboard/stats) or
// is logged in with web wallet (mining/stacking)

import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { userSessionState } from '../../lib/auth';
import { testnet } from '../../lib/stacks';

export default function NavBar(props) {
  const basePath = `/${props.symbol.toLowerCase()}`;
  const navArray = ['Dashboard', 'Activation', 'Mining', 'Stacking'];
  const [userSession] = useAtom(userSessionState);
  const isLoggedIn = userSession.isUserSignedIn();

  return (
    <>
      <nav>
        <ul className="nav nav-pills flex-column flex-md-row flex-nowrap align-items-center justify-content-center">
          {navArray.map((value, idx) => (
            <li className="nav-item" key={value}>
              <Link
                to={`${basePath}/${value.toLowerCase()}${
                  testnet ? '?chain=testnet' : '?chain=mainnet'
                }`}
                className={`nav-link ${value.toLowerCase() === props.path && 'active'} ${
                  idx > 0 && !isLoggedIn && 'disabled'
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
