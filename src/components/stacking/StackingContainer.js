import StackCityCoins from './StackCityCoins';
import ClaimStackingRewards from './ClaimStackingRewards';
import StackingTools from './StackingTools';
import NotDeployed from '../common/NotDeployed';
import { useAtom } from 'jotai';
import {
  currentBlockHeight,
  currentCityActivationStatus,
  currentCityInitialized,
} from '../../store/common';
import { getActivationStatus, isInitialized } from '../../lib/citycoins';
import { useEffect } from 'react';
import NotActivated from '../common/NotActivated';
import ActivationCountdown from '../common/ActivationCountdown';
import NotInitialized from '../common/NotInitialized';

// TODO: stacking should display a message if contract is not activated
// else load the stacking content

export default function StackingContainer(props) {
  const [initialized, setInitialized] = useAtom(currentCityInitialized);
  const [cityActivated, setCityActivated] = useAtom(currentCityActivationStatus);
  const [blockHeight] = useAtom(currentBlockHeight);

  useEffect(() => {
    isInitialized(props.contracts.deployer, props.contracts.authContract)
      .then(result => {
        setInitialized(result);
      })
      .catch(err => {
        setInitialized(false);
        console.log(err);
      });
    getActivationStatus(props.contracts.deployer, props.contracts.coreContract)
      .then(result => {
        setCityActivated(result.value);
      })
      .catch(err => {
        setCityActivated(false);
        console.log(err);
      });
  }, [props.contracts.authContract, props.contracts.coreContract, props.contracts.deployer]);

  if (props.contracts.deployer === '') {
    return <NotDeployed />;
  }

  if (!initialized) {
    return <NotInitialized />;
  }

  if (!cityActivated) {
    return <NotActivated symbol={props.token.symbol} />;
  }

  if (blockHeight < props.config.startBlock) {
    return (
      <ActivationCountdown
        symbol={props.token.symbol}
        blocks={props.config.startBlock - blockHeight}
      />
    );
  }

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
      <div className="tab-content w-100" id="v-pills-tabContent">
        <hr className="d-md-none" />
        <div
          className="tab-pane fade show active"
          id="stacking"
          role="tabpanel"
          aria-labelledby="v-pills-stacking-tab"
        >
          <StackCityCoins contracts={props.contracts} token={props.token} config={props.config} />
        </div>
        <div
          className="tab-pane fade"
          id="stackingClaims"
          role="tabpanel"
          aria-labelledby="v-pills-stackingClaims-tab"
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
          aria-labelledby="v-pills-stackingTools-tab"
        >
          <StackingTools contracts={props.contracts} token={props.token} config={props.config} />
        </div>
      </div>
    </div>
  );
}
