import StatsContainer from '../stats/StatsContainer';
import MiningActivity from './MiningActivity';
import StackingActivity from './StackingActivity';
import TransactionLog from './TransactionLog';

export default function DashboardContainer(props) {
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
          data-bs-target="#activity"
          type="button"
          role="tab"
          aria-controls="activity"
          aria-selected="true"
        >
          Activity
        </button>
        <button
          className="nav-link"
          id="v-pills-stats-tab"
          data-bs-toggle="pill"
          data-bs-target="#stats"
          type="button"
          role="tab"
          aria-controls="stats"
          aria-selected="true"
        >
          Statistics
        </button>
        <button
          className="nav-link"
          id="v-pills-transactions-tab"
          data-bs-toggle="pill"
          data-bs-target="#transactions"
          type="button"
          role="tab"
          aria-controls="transactions"
          aria-selected="true"
        >
          Transactions
        </button>
      </div>
      <div className="tab-content w-100" id="v-pills-tabContent">
        <hr className="d-md-none" />
        <div
          className="tab-pane fade show active"
          id="activity"
          role="tabpanel"
          aria-labelledby="v-pills-activity-tab"
        >
          <MiningActivity contracts={props.contracts} token={props.token} config={props.config} />
          <br />
          <StackingActivity contracts={props.contracts} token={props.token} config={props.config} />
        </div>
        <div
          className="tab-pane fade"
          id="stats"
          role="tabpanel"
          aria-labelledby="v-pills-stats-tab"
        >
          <StatsContainer contracts={props.contracts} token={props.token} config={props.config} />
        </div>
        <div
          className="tab-pane fade"
          id="transactions"
          role="tabpanel"
          aria-labelledby="v-pills-transactions-tab"
        >
          <TransactionLog contracts={props.contracts} token={props.token} config={props.config} />
        </div>
      </div>
    </div>
  );
}
