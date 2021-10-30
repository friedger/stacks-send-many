import NavBackHome from './NavBackHome';
import NavBar from './NavBar';
import { userSessionState } from '../../lib/auth';
import { useAtom } from 'jotai';
import Unauthorized from './Unauthorized';

export default function CityActivation(props) {
  const [userSession] = useAtom(userSessionState);
  if (userSession.isUserSignedIn()) {
    return (
      <>
        <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
        <h3>{props.token.symbol} Activation</h3>
        <p>Registration action</p>
        <p>If registered, show registration info</p>
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
