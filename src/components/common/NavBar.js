// TODO: buttons disabled unless user either
// has a city selected (dashboard/stats) or
// is logged in with web wallet (mining/stacking)

export default function NavBar() {
  return (
    <>
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
