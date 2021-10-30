import NavBackHome from './NavBackHome';
import NavBar from './NavBar';
import { userSessionState } from '../../lib/auth';
import { useAtom } from 'jotai';
import Unauthorized from './Unauthorized';

export default function CityTools(props) {
  const [userSession] = useAtom(userSessionState);
  if (userSession.isUserSignedIn()) {
    return (
      <>
        <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
        <h3>{props.token.symbol} Tools</h3>
        <p>Get User ID for an address</p>
        <p>Other tools that don't fit</p>
        <hr />
        <NavBackHome />
      </>
    );
  } else {
    return (
      <Unauthorized city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
    );
  }
}
