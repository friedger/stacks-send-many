import StackingContainer from '../stacking/StackingContainer';
import NavBackHome from './NavBackHome';
import NavBar from './NavBar';
import { userSessionState } from '../../lib/auth';
import { useAtom } from 'jotai';
import Unauthorized from './Unauthorized';

export default function CityStacking(props) {
  const [userSession] = useAtom(userSessionState);
  if (userSession.isUserSignedIn()) {
    return (
      <>
        <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
        <StackingContainer contracts={props.contracts} token={props.token} config={props.config} />
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
