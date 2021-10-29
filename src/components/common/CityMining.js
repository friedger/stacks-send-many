import MiningContainer from '../mining/MiningContainer';
import NavBackHome from './NavBackHome';
import NavBar from './NavBar';

export default function CityMining(props) {
  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <MiningContainer contracts={props.contracts} token={props.token} config={props.config} />
      <hr />
      <NavBackHome />
    </>
  );
}
