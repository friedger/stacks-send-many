import NotDeployed from '../common/NotDeloyed';

export default function ToolsContainer(props) {
  if (props.contracts.deployer === '') {
    return <NotDeployed />;
  } else {
    return (
      <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
        <div
          className="nav flex-column nav-pills mx-auto mx-md-0 me-md-3 text-nowrap"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          <button
            className="nav-link active"
            id="v-pills-tools-tab"
            data-bs-toggle="pill"
            data-bs-target="#tools"
            type="button"
            role="tab"
            aria-controls="tools"
            aria-selected="true"
          >
            Tools
          </button>
        </div>
        <div className="tab-content" id="v-pills-tabContent">
          <hr className="d-md-none" />
          <div
            className="tab-pane fade show active"
            id="tools"
            role="tabpanel"
            aria-labelledby="v-pills-tools-tab"
          >
            <h3>Tools</h3>
            <p>An {props.token.symbol} sandbox on steroids.</p>
          </div>
        </div>
      </div>
    );
  }
}
