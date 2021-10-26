export default function HeaderNav() {
  return (
    <nav className="col-sm d-flex justify-content-center">
      <ul className="nav">
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
  );
}
