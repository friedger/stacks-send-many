import CityWallet from './CityWallet';
import IssuanceSchedule from './IssuanceSchedule';
import RewardCycleList from './RewardCycleList';
import TotalSupply from './TotalSupply';

export default function StatsContainer(props) {
  return (
    <div className="container-fluid p-6">
      <h3>{props.token.symbol} Stats</h3>
      <div className="row">
        <TotalSupply contracts={props.contracts} token={props.token} config={props.config} />
        <CityWallet contracts={props.contracts} token={props.token} config={props.config} />
        <IssuanceSchedule contracts={props.contracts} token={props.token} config={props.config} />
        <RewardCycleList contracts={props.contracts} token={props.token} config={props.config} />
      </div>
    </div>
  );
}
