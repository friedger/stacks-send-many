import MiamiLogo from '../../images/MIA_StandAlone.svg';
import SanFranciscoLogo from '../../images/SFO_StandAlone.svg';

// TODO: use a list of cities in store?

export default function HeaderLogo(props) {
  const path = props.path || '/citycoin-icon-blue-reversed-75x75.png';
  const size = props.size || '75';
  const alt = props.alt || 'Citycoin CC Logo';
  return (
    <div className="dropdown">
      <a
        href="/"
        className="text-dark text-decoration-none dropdown-toggle"
        role="button"
        id="dropdownCities"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img src={path} width={size} alt={alt} />
      </a>
      <ul
        class="dropdown-menu text-nowrap"
        id="dropdownCitiesMenu"
        aria-labelledby="dropdownCities"
      >
        <li>
          <p className="dropdown-item-text fw-bold border-bottom ps-3">Choose a City!</p>
        </li>
        <li>
          <a class="dropdown-item link-primary" href="#">
            <img
              src="https://placeimg.com/25/25/arch"
              alt="Austin Logo"
              className="pe-3 w-25 h-25"
            />
            Austin
          </a>
        </li>
        <li>
          <a class="dropdown-item link-primary" href="#">
            <img src={MiamiLogo} alt="Miami Logo" className="pe-3 w-25 h-25" />
            Miami
          </a>
        </li>
        <li>
          <a class="dropdown-item link-primary" href="#">
            <img
              src="https://placeimg.com/25/25/arch"
              alt="New York Logo"
              className="pe-3 w-25 h-25"
            />
            New York
          </a>
        </li>
        <li>
          <a class="dropdown-item link-primary" href="#">
            <img src={SanFranciscoLogo} alt="San Francisco Logo" className="pe-3 w-25 h-25" />
            San Francisco
          </a>
        </li>
      </ul>
    </div>
  );
}
