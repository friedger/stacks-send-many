import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { CityCoinLogo, currentCity, cityInfo } from '../../store/cities';

export default function HeaderLogo() {
  const [current] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);

  return (
    <Link to={current !== '' ? '/dashboard' : '/'}>
      <img
        height="60px"
        width="60px"
        src={current !== '' ? info[current].logo : CityCoinLogo}
        alt={`${current !== '' ? info[current].name : 'CityCoins'} logo`}
      />
    </Link>
  );
}
