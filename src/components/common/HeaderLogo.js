import { Link } from '@reach/router';
import { useAtom } from 'jotai';
import { testnet } from '../../lib/stacks';
import { CityCoinLogo, currentCity, currentCityList } from '../../store/common';
import { AustinCoinLogo } from '../../store/common';
import { MiamiCoinLogo } from '../../store/common';
import { NewYorkCityCoinLogo } from '../../store/common';
import { SanFranciscoCoinLogo } from '../../store/common';

export default function HeaderLogo() {
  const [city] = useAtom(currentCity);
  const cityListArray = Object.entries(currentCityList);

  const cityLogo = cityListArray.reduce((acc, curr, idx) => {
    if (idx === 1 && acc[1].name === city) {
      return acc[1].logo;
    }
    if (curr[1].name === city) {
      return curr[1].logo;
    }
    return acc;
  });

  // TODO: map city list array to create options below?

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
        <img
          src={city ? cityLogo : CityCoinLogo}
          alt="CityCoins Logo"
          height="75"
          width="75"
          className="pe-1"
        />
      </a>
      <ul
        className="dropdown-menu text-nowrap"
        id="dropdownCitiesMenu"
        aria-labelledby="dropdownCities"
      >
        <li>
          <Link
            className="dropdown-item link-primary"
            to={`/${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
          >
            <img src={CityCoinLogo} alt="CityCoins Logo" className="pe-3 w-25 h-25" />
            Home
          </Link>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <p className="dropdown-item-text fw-bold ps-3 mb-0">Choose a City!</p>
        </li>
        <li>
          <hr className="dropdown-divider" />
        </li>
        <li>
          <Link
            className="dropdown-item link-primary"
            to={`/atx${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
          >
            <img src={AustinCoinLogo} alt="Austin Logo" className="pe-3 w-25 h-25" />
            Austin
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item link-primary"
            to={`/mia${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
          >
            <img src={MiamiCoinLogo} alt="Miami Logo" className="pe-3 w-25 h-25" />
            Miami
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item link-primary"
            to={`/nyc${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
          >
            <img src={NewYorkCityCoinLogo} alt="New York City Logo" className="pe-3 w-25 h-25" />
            New York City
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item link-primary"
            to={`/sfo${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
          >
            <img src={SanFranciscoCoinLogo} alt="San Francisco Logo" className="pe-3 w-25 h-25" />
            San Francisco
          </Link>
        </li>
      </ul>
    </div>
  );
}
