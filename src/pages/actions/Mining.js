import MiningContainer from '../../components/mining/MiningContainer';
import NavBackHome from '../../components/common/NavBackHome';
import NavBar from '../../components/common/NavBar';
import { userSessionState } from '../../lib/auth';
import { useAtom } from 'jotai';
import Unauthorized from '../../components/common/Unauthorized';
import { currentBlockHeight } from '../../store/common';
import { useEffect } from 'react';
import { getCurrentBlockHeight } from '../../lib/stacks';

export default function CityMining(props) {
  const [, setBlockHeight] = useAtom(currentBlockHeight);
  const [userSession] = useAtom(userSessionState);

  useEffect(() => {
    getCurrentBlockHeight().then(result => {
      setBlockHeight(result);
    });
  });

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
