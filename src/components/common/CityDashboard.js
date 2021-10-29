import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityDashboard(props) {
  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <h3>{props.config.cityName} Dashboard</h3>
      <hr />
      <h3>{props.token.symbol} Mining Activity</h3>
      <p>{props.config.cityName} mining activity</p>
      <h3>{props.token.symbol} Stacking Activity</h3>
      <p>{props.config.cityName} stacking activity</p>
      <p>stacking cycle progress</p>
      <h3>{props.token.symbol} Contract Transactions</h3>
      <p>{props.config.cityName} transactions</p>
      <hr />
      <NavBackHome />
    </>
  );
}
