import MineCityCoins from './MineCityCoins';
import ClaimMiningRewards from './ClaimMiningRewards';
import MiningTools from './MiningTools';
import NotDeployed from '../common/NotDeployed';
import { useAtom } from 'jotai';
import {
  currentCityActivationStatus,
  currentBlockHeight,
  currentCityInitialized,
} from '../../store/common';
import { getActivationStatus, isInitialized } from '../../lib/citycoins';
import NotActivated from '../common/NotActivated';
import { useEffect } from 'react';
import ActivationCountdown from '../common/ActivationCountdown';
import NotInitialized from '../common/NotInitialized';

// TODO: mining should display a message if contract is not activated
// else load the mining content

export default function MiningContainer(props) {
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
        className="nav flex-column nav-pills mx-auto mx-md-0 mt-2 mt-md-0 me-md-3 text-nowrap"
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
      <div className="tab-content w-100" id="v-pills-tabContent">
        <hr className="d-md-none" />
        <div
          className="tab-pane fade show active"
          id="mining"
          role="tabpanel"
          aria-labelledby="v-pills-mining-tab"
        >
          <MineCityCoins contracts={props.contracts} token={props.token} config={props.config} />
        </div>
        <div
          className="tab-pane fade"
          id="miningClaims"
          role="tabpanel"
          aria-labelledby="v-pills-miningClaims-tab"
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
          aria-labelledby="v-pills-miningTools-tab"
        >
          <MiningTools contracts={props.contracts} token={props.token} config={props.config} />
        </div>
      </div>
    </div>
  );
}
