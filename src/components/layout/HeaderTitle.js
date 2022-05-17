import { useAtom } from 'jotai';
import { cityInfo, currentCity } from '../../store/cities';

export default function HeaderTitle() {
  const [current] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);

  return (
    <span className={`h1 text-nowrap ${current !== '' ? 'text-' + info[current].bgText : ''}`}>
      {current !== '' ? info[current].name : 'CityCoins'}
    </span>
  );
}
