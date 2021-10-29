import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityDashboard(props) {
  return (
    <>
      <NavBar city={props.city} symbol={props.symbol} path={props.path} />
      <h3>{props.symbol} Mining Activity</h3>
      <p>{props.city} mining activity</p>
      <h3>{props.symbol} Stacking Activity</h3>
      <p>{props.city} stacking activity</p>
      <p>stacking cycle progress</p>
      <h3>{props.symbol} Contract Transactions</h3>
      <p>{props.city} transactions</p>
      <hr />
      <NavBackHome />
    </>
  );
}
