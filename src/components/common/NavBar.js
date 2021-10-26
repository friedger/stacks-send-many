import { navigate } from '@reach/router';

export default function NavBar() {
  return (
    <>
      <select
        className="w-25"
        aria-label="Select a City"
        defaultValue={'none'}
        onChange={e => navToCity(e.currentTarget.value)}
      >
        <option value="none">Select a City...</option>
        <option value="atx">Austin, TX</option>
        <option value="mia">Miami, FL</option>
        <option value="nyc">New York, NY</option>
        <option value="sfo">San Fransciso, CA</option>
      </select>
      <nav>
        <ul className="nav nav-pills flex-column flex-md-row flex-nowrap align-items-center justify-content-center">
          <li className="nav-item">
            <a href="#" className="nav-link active" aria-current="page">
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              Stats
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              Mining
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              Stacking
            </a>
          </li>
        </ul>
      </nav>
      <hr />
    </>
  );
}

const updateNav = city => {
  if (city === 'none' || city === undefined) {
    return null;
  } else {
    return <h1>{city}</h1>;
  }
};

const navToCity = city => {
  if (city === 'none' || city === undefined) {
    navigate('/');
  } else {
    navigate(`/${city}`);
  }
};
