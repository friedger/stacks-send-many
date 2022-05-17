import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { isMainnet } from '../../lib/stacks';
import { cityActions, cityInfo, cityList, currentAction, currentCity } from '../../store/cities';

export default function HeaderNav() {
  const [cities] = useAtom(cityList);
  const [info] = useAtom(cityInfo);
  const [current, setCurrent] = useAtom(currentCity);
  const [action, setAction] = useAtom(currentAction);

  const cityMenu = cities.map(city => {
    return (
      <li key={city} className={`nav-item me-3 ${city === current ? 'nav-item-active' : ''}`}>
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

  const actions = cityActions.map(value => {
    return (
      <li key={value} className={`nav-item me-3 ${value === action ? 'nav-item-active' : ''}`}>
        <Link
          className="nav-link"
          to={`/${value.toLowerCase()}${isMainnet ? '?chain=mainnet' : '?chain=testnet'}`}
          onClick={() => setAction(value)}
        >
          {value}
        </Link>
      </li>
    );
  });

  if (current !== '') return <CitySelected menu={cityMenu} actions={actions} />;

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
            <li className="nav-item nav-item-title">
              <span className="fs-5">Select a City</span>
            </li>
            {menu}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function CitySelected({ menu, actions }) {
  const [, setCurrent] = useAtom(currentCity);

  return (
    <nav className="navbar navbar-light bg-white">
      <div className="container-fluid m-0 p-0 justify-content-around">
        <button
          className="navbar-toggler m-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          Select a City
        </button>
        <div>
          <ul className="nav nav-pills flex-column flex-md-row flex-nowrap align-items-center justify-content-center">
            {actions}
          </ul>
        </div>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item nav-item-title">
              <Link
                className="nav-link"
                to={`/${isMainnet ? '?chain=mainnet' : '?chain=testnet'}`}
                onClick={() => setCurrent('')}
              >
                Clear Selection
              </Link>
            </li>
            {menu}
          </ul>
        </div>
      </div>
    </nav>
  );
}
