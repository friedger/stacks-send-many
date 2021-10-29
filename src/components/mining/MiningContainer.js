import MineCityCoins from './MineCityCoins';
import ClaimMiningRewards from './ClaimMiningRewards';
import MiningTools from './MiningTools';

export default function MiningContainer(props) {
  return (
    <div class="d-flex align-items-start">
      <div
        class="nav flex-column nav-pills me-3"
        id="v-pills-tab"
        role="tablist"
        aria-orientation="vertical"
      >
        <button
          className="nav-link active"
          id="v-pills-mining-tab"
          data-bs-toggle="pill"
          data-bs-target="#mining"
          type="button"
          role="tab"
          aria-controls="mining"
          aria-selected="true"
        >
          Mine {props.token.symbol}
        </button>
        <button
          className="nav-link"
          id="v-pills-miningClaims-tab"
          data-bs-toggle="tab"
          data-bs-target="#miningClaims"
          type="button"
          role="tab"
          aria-controls="miningClaims"
          aria-selected="false"
        >
          Claim Rewards
        </button>
        <button
          className="nav-link"
          id="v-pills-miningTools-tab"
          data-bs-toggle="tab"
          data-bs-target="#miningTools"
          type="button"
          role="tab"
          aria-controls="miningTools"
          aria-selected="false"
        >
          Mining Tools
        </button>
      </div>
      <div className="tab-content" id="v-pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="mining"
          role="tabpanel"
          aria-labelledby="mining-tab"
        >
          <MineCityCoins contracts={props.contracts} token={props.token} config={props.config} />
        </div>
        <div
          className="tab-pane fade"
          id="miningClaims"
          role="tabpanel"
          aria-labelledby="miningClaims-tab"
        >
          <ClaimMiningRewards
            contracts={props.contracts}
            token={props.token}
            config={props.config}
          />
        </div>
        <div
          className="tab-pane fade"
          id="miningTools"
          role="tabpanel"
          aria-labelledby="miningTools-tab"
        >
          <MiningTools contracts={props.contracts} token={props.token} config={props.config} />
        </div>
      </div>
    </div>
  );
}
