import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { CITYCOIN_LOGO, CITY_INFO, currentCityAtom, currentRouteAtom } from '../../store/cities';

export default function HeaderLogo() {
  const [currentCity] = useAtom(currentCityAtom);
  const [currentRoute] = useAtom(currentRouteAtom);
  const path =
    currentCity.loaded && currentRoute.loaded ? `/${currentRoute.data.toLowerCase()}` : '/';

  return (
    <Link to={path}>
      <img
        height="60px"
        width="60px"
        src={currentCity.loaded ? CITY_INFO[currentCity.data].logo : CITYCOIN_LOGO}
        alt={`${currentCity.loaded ? CITY_INFO[currentCity.data].name : 'CityCoins'} logo`}
      />
    </Link>
  );
}
