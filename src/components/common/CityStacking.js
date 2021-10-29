import StackingContainer from '../stacking/StackingContainer';
import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityStacking(props) {
  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <StackingContainer contracts={props.contracts} token={props.token} config={props.config} />
      <hr />
      <NavBackHome />
    </>
  );
}
