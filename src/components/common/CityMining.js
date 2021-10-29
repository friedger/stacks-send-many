import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityMining(props) {
  return (
    <>
      <NavBar city={props.city} symbol={props.symbol} path={props.path} />
      <h3>{props.symbol} Mining</h3>
      <p>Mine single or mine many</p>
      <p>Claim mining rewards</p>
      <hr />
      <NavBackHome />
    </>
  );
}
