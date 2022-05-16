import { useAtom } from 'jotai';
import { cityInfo, cityList } from '../../store/cities';

export default function SelectCity() {
  const [cities] = useAtom(cityList);
  const [info] = useAtom(cityInfo);
  const content = cities.map(city => (
    <div key={city}>
      <img height="25px" width="25px" src={info[city].logo} alt={city + ' logo'} />
      {info[city].name}
    </div>
  ));
  return content;
}
