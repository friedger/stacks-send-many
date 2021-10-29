import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityStacking(props) {
  return (
    <>
      <NavBar city={props.city} symbol={props.symbol} path={props.path} />
      <h3>{props.symbol} Stacking</h3>
      <p>Stack CityCoins</p>
      <p>Claim Rewards</p>
      <p>Get Cycle Info</p>
      <hr />
      <NavBackHome />
    </>
  );
}
