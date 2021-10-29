import StackCityCoins from './StackCityCoins';
import ClaimStackingRewards from './ClaimStackingRewards';
import StackingTools from './StackingTools';

export default function StackingContainer(props) {
  return (
    <div className="d-flex align-items-start">
      <div
        className="nav flex-column nav-pills me-3"
        id="v-pills-tab"
        role="tablist"
        aria-orientation="vertical"
      >
        <button
          className="nav-link active"
          id="v-pills-stacking-tab"
          data-bs-toggle="pill"
          data-bs-target="#stacking"
          type="button"
          role="tab"
          aria-controls="stacking"
          aria-selected="true"
        >
          Stack {props.token.symbol}
        </button>
        <button
          className="nav-link"
          id="v-pills-stackingClaims-tab"
          data-bs-toggle="tab"
          data-bs-target="#stackingClaims"
          type="button"
          role="tab"
          aria-controls="stackingClaims"
          aria-selected="false"
        >
          Claim Rewards
        </button>
        <button
          className="nav-link"
          id="v-pills-stackingTools-tab"
          data-bs-toggle="tab"
          data-bs-target="#stackingTools"
          type="button"
          role="tab"
          aria-controls="stackingTools"
          aria-selected="false"
        >
          Stacking Tools
        </button>
      </div>
      <div className="tab-content" id="v-pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="stacking"
          role="tabpanel"
          aria-labelledby="stacking-tab"
        >
          <StackCityCoins contracts={props.contracts} token={props.token} config={props.config} />
        </div>
        <div
          className="tab-pane fade"
          id="stackingClaims"
          role="tabpanel"
          aria-labelledby="stackingClaims-tab"
        >
          <ClaimStackingRewards
            contracts={props.contracts}
            token={props.token}
            config={props.config}
          />
        </div>
        <div
          className="tab-pane fade"
          id="stackingTools"
          role="tabpanel"
          aria-labelledby="stackingTools-tab"
        >
          <StackingTools contracts={props.contracts} token={props.token} config={props.config} />
        </div>
      </div>
    </div>
  );
}
