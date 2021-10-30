import MiningContainer from '../../components/mining/MiningContainer';
import NavBackHome from '../../components/common/NavBackHome';
import NavBar from '../../components/common/NavBar';
import { userSessionState } from '../../lib/auth';
import { useAtom } from 'jotai';
import Unauthorized from '../../components/common/Unauthorized';

export default function CityMining(props) {
  const [userSession] = useAtom(userSessionState);
  if (userSession.isUserSignedIn()) {
    return (
      <>
        <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
        <MiningContainer contracts={props.contracts} token={props.token} config={props.config} />
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
