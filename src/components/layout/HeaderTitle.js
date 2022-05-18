import { useAtom } from 'jotai';
import { CITY_INFO, currentCityAtom } from '../../store/cities';

export default function HeaderTitle() {
  const [currentCity] = useAtom(currentCityAtom);

  return (
    <span
      className={`h1 text-nowrap ${
        currentCity.loaded ? 'text-' + CITY_INFO[currentCity.data].bgText : ''
      }`}
    >
      {currentCity.loaded ? CITY_INFO[currentCity.data].name : 'CityCoins'}
    </span>
  );
}
