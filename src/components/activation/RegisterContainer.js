import NotDeployed from '../common/NotDeloyed';
import RegisterUser from './RegisterUser';

export default function RegisterContainer(props) {
  if (props.contracts.deployer === '') {
    return <NotDeployed />;
  } else {
    return (
      <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start">
        <div
          className="nav flex-column nav-pills mx-auto mx-md-0 mt-2 mt-md-0 me-md-3 text-nowrap"
          id="v-pills-tab"
          role="tablist"
          aria-orientation="vertical"
        >
          <button
            className="nav-link active"
            id="v-pills-activity-tab"
            data-bs-toggle="pill"
            data-bs-target="#register"
            type="button"
            role="tab"
            aria-controls="register"
            aria-selected="true"
          >
            Register
          </button>
        </div>
        <div className="tab-content" id="v-pills-tabContent">
          <hr className="d-md-none" />
          <div
            className="tab-pane fade show active"
            id="register"
            role="tabpanel"
            aria-labelledby="v-pills-register-tab"
          >
            <RegisterUser contracts={props.contracts} token={props.token} config={props.config} />
          </div>
        </div>
      </div>
    );
  }
}
