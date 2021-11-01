import NavBackHome from '../../components/common/NavBackHome';
import NavBar from '../../components/common/NavBar';
import StatsContainer from '../../components/stats/StatsContainer';

export default function CityStats(props) {
  return (
    <>
      <NavBar city={props.config.cityName} symbol={props.token.symbol} path={props.path} />
      <StatsContainer contracts={props.contracts} token={props.token} config={props.config} />
      <hr />
      <NavBackHome />
    </>
  );
}
