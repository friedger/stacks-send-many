import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityActivation(props) {
  return (
    <>
      <NavBar city={props.city} symbol={props.symbol} path={props.path} />
      <h3>{props.symbol} Activation</h3>
      <p>Registration action</p>
      <p>If registered, show registration info</p>
      <hr />
      <NavBackHome />
    </>
  );
}
