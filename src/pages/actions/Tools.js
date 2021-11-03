import NavBackHome from '../../components/common/NavBackHome';
import NavBar from '../../components/common/NavBar';
import { userSessionState } from '../../lib/auth';
import { useAtom } from 'jotai';
import Unauthorized from '../../components/common/Unauthorized';
import ToolsContainer from '../../components/tools/ToolsContainer';
import { getCurrentBlockHeight } from '../../lib/stacks';
import { useEffect } from 'react';
import { currentBlockHeight } from '../../store/common';

export default function CityTools(props) {
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
        <ToolsContainer contracts={props.contracts} token={props.token} config={props.config} />
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
