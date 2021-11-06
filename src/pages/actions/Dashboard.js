import { useAtom } from 'jotai';
import { useEffect } from 'react';
import NavBackHome from '../../components/common/NavBackHome';
import NavBar from '../../components/common/NavBar';
import DashboardContainer from '../../components/dashboard/DashboardContainer';
import { getCurrentBlockHeight } from '../../lib/stacks';
import { currentBlockHeight } from '../../store/common';

export default function CityDashboard(props) {
  const [, setBlockHeight] = useAtom(currentBlockHeight);

  useEffect(() => {
    getCurrentBlockHeight().then(result => {
      setBlockHeight(result);
    });
  });

  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <DashboardContainer contracts={props.contracts} token={props.token} config={props.config} />
      <hr />
      <NavBackHome />
    </>
  );
}
