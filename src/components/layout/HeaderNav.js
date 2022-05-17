import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { isMainnet } from '../../lib/stacks';
import { cityInfo, cityList, currentCity } from '../../store/cities';

export default function HeaderNav() {
  const [cities] = useAtom(cityList);
  const [info] = useAtom(cityInfo);
  const [current, setCurrent] = useAtom(currentCity);

  const cityMenu = cities.map(city => {
    return (
      <li key={city} className={`nav-item me-3 ${city === current && 'nav-item-active'}`}>
        <Link
          className="nav-link"
          to={`/${isMainnet ? '?chain=mainnet' : '?chain=testnet'}`}
          onClick={() => setCurrent(city)}
        >
          <img className="nav-logo me-2" src={info[city].logo} alt={`${city} logo`} />
          {info[city].name}
        </Link>
      </li>
    );
  });

  if (current !== '') return <CitySelected menu={cityMenu} />;

  return <NoCitySelected menu={cityMenu} />;
}

function NoCitySelected({ menu }) {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white">
      <div className="container-fluid m-0 p-0 justify-content-center">
        <button
          className="navbar-toggler m-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span> Menu
        </button>
        <div
          className="collapse navbar-collapse align-items-center justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center justify-content-center">
            <li className="nav-item nav-item-title me-3">
              <span className="fs-5">Select a City</span>
            </li>
            {menu}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function CitySelected({ menu }) {
  const [current] = useAtom(currentCity);
  const [info] = useAtom(cityInfo);

  return (
    <nav className="navbar navbar-light bg-white">
      <div className="container-fluid m-0 p-0 justify-content-start">
        <button
          className="navbar-toggler m-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <img className="nav-logo me-2" src={info[current].logo} alt={`${current} logo`} /> Select
          a City
        </button>
        <div
          className="collapse navbar-collapse align-items-start justify-content-start"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-start justify-content-start">{menu}</ul>
        </div>
      </div>
    </nav>
  );
}
