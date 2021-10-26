// TODO: hide links based on login state

export default function PageNav({ userSession }) {
  return (
    <div className="p-3">
      <div className="row d-flex justify-content-between align-content-center flex-fill">
        <div className="col-sm d-flex"></div>

        <div className="col-sm d-flex justify-content-end">
          <a href="#" className="nav-link">
            Read the Docs
          </a>
        </div>
      </div>
    </div>
  );
}
