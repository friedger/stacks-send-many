import NotDeployed from '../common/NotDeployed';
import RegisterTools from './RegisterTools';
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
            id="v-pills-register-tab"
            data-bs-toggle="pill"
            data-bs-target="#register"
            type="button"
            role="tab"
            aria-controls="register"
            aria-selected="true"
          >
            Activate {props.token.symbol}
          </button>
          <button
            className="nav-link"
            id="v-pills-registerTools-tab"
            data-bs-toggle="pill"
            data-bs-target="#registerTools"
            type="button"
            role="tab"
            aria-controls="registerTools"
            aria-selected="true"
          >
            Registration Tools
          </button>
        </div>
        <div className="tab-content w-100" id="v-pills-tabContent">
          <hr className="d-md-none" />
          <div
            className="tab-pane fade show active"
            id="register"
            role="tabpanel"
            aria-labelledby="v-pills-register-tab"
          >
            <RegisterUser contracts={props.contracts} token={props.token} config={props.config} />
          </div>
          <div
            className="tab-pane fade"
            id="registerTools"
            role="tabpanel"
            aria-labelledby="v-pills-registerTools-tab"
          >
            <RegisterTools contracts={props.contracts} token={props.token} config={props.config} />
          </div>
        </div>
      </div>
    );
  }
}
