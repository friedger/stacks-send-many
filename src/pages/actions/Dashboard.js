import MiningActivity from '../../components/dashboard/MiningActivity';
import StackingActivity from '../../components/dashboard/StackingActivity';
import TransactionLog from '../../components/dashboard/TransactionLog';
import NavBackHome from '../../components/common/NavBackHome';
import NavBar from '../../components/common/NavBar';
import DashboardContainer from '../../components/dashboard/DashboardContainer';

export default function CityDashboard(props) {
  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <DashboardContainer contracts={props.contracts} token={props.token} config={props.config} />
      <hr />
      <NavBackHome />
    </>
  );
}
