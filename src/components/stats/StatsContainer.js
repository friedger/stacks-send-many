import CurrentStacksBlock from '../common/CurrentStacksBlock';
import CityWallet from './CityWallet';
import IssuanceSchedule from './IssuanceSchedule';
import RewardCycleList from './RewardCycleList';
import TotalSupply from './TotalSupply';

// TODO: price data and market cap?

export default function StatsContainer(props) {
  return (
    <div className="container-fluid p-6">
      <h3>{props.token.symbol} Statistics</h3>
      <CurrentStacksBlock />
      <div className="row g-4 flex-column flex-md-row align-items-center justify-content-center">
        <TotalSupply contracts={props.contracts} token={props.token} config={props.config} />
        <CityWallet contracts={props.contracts} token={props.token} config={props.config} />
        <IssuanceSchedule contracts={props.contracts} token={props.token} config={props.config} />
        <RewardCycleList contracts={props.contracts} token={props.token} config={props.config} />
      </div>
    </div>
  );
}
