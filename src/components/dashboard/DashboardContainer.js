import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getActivationStatus, isInitialized } from '../../lib/citycoins';
import {
  currentBlockHeight,
  currentCityActivationStatus,
  currentCityInitialized,
} from '../../store/common';
import ActivationCountdown from '../common/ActivationCountdown';
import NotActivated from '../common/NotActivated';
import NotDeployed from '../common/NotDeployed';
import NotInitialized from '../common/NotInitialized';
import StatsContainer from '../stats/StatsContainer';
import MiningActivity from './MiningActivity';
import StackingActivity from './StackingActivity';
import TransactionLog from './TransactionLog';

// TODO: dashboard should display a message if contract is not activated
// else load the dashboard content

export default function DashboardContainer(props) {
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
