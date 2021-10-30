import NavBackHome from './NavBackHome';
import NavBar from './NavBar';
import StatsCard from '../stats/StatsCard';

export default function CityStats(props) {
  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <StatsCard contracts={props.contracts} token={props.token} config={props.config} />
      <h3>{props.token.symbol} Contract</h3>
      <p>Current Stacking Cycle</p>
      <p>Cycle Progress</p>
      <h3>{props.token.symbol} Token</h3>
      <p>Total Supply</p>
      <p>{props.token.symbol} Wallet</p>
      <p>{props.config.cityWallet}</p>
      <hr />
      <NavBackHome />
    </>
  );
}
