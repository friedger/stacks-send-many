import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityTools(props) {
  return (
    <>
      <NavBar city={props.city} symbol={props.symbol} path={props.path} />
      <h3>{props.symbol} Tools</h3>
      <p>Get User ID for an address</p>
      <p>Other tools that don't fit</p>
      <hr />
      <NavBackHome />
    </>
  );
}
