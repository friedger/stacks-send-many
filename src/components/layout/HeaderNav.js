import { useAtom } from 'jotai';
import { cityInfo, cityList } from '../../store/cities';

export default function HeaderNav() {
  const [cities] = useAtom(cityList);
  const [info] = useAtom(cityInfo);
  const cityMenu = cities.map(city => (
    <li key={city} className="nav-item me-3">
      <a className="nav-link" href="#">
        <img className="nav-logo me-2" src={info[city].logo} alt={city + ' logo'} />
        {info[city].name}
      </a>
    </li>
  ));
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
            {cityMenu}
          </ul>
        </div>
      </div>
    </nav>
  );
}
