import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { userSessionState } from '../../lib/auth';
import {
  getActivationBlock,
  getActivationStatus,
  getActivationThreshold,
  getRegisteredUsersNonce,
  getUserId,
} from '../../lib/citycoins';
import { useStxAddresses } from '../../lib/hooks';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RegisterUser(props) {
  const [userCount, setUserCount] = useState(0);
  const [activationThreshold, setActivationThreshold] = useState(0);
  const [activationStatus, setActivationStatus] = useState(false);
  const [activationStatusLoaded, setActivationStatusLoaded] = useState(false);
  const [activationBlockHeight, setActivationBlockHeight] = useState(0);
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);

  const styles = {
    width: `${(userCount / activationThreshold) * 100}%`,
  };

  useEffect(() => {
    getActivationStatus(props.contracts.deployer, props.contracts.coreContract)
      .then(result => {
        setActivationStatus(result.value);
        setActivationStatusLoaded(true);
        getActivationBlock(props.contracts.deployer, props.contracts.coreContract)
          .then(result => {
            setActivationBlockHeight(result.value.value);
          })
          .catch(err => {
            setActivationBlockHeight(0);
            console.log(err);
          });
      })
      .catch(err => {
        setActivationStatus(false);
        console.log(err);
      });
    getRegisteredUsersNonce(props.contracts.deployer, props.contracts.coreContract)
      .then(result => {
        setUserCount(result.value);
      })
      .catch(err => {
        setUserCount(0);
        console.log(err);
      });
    getActivationThreshold(props.contracts.deployer, props.contracts.coreContract)
      .then(result => {
        setActivationThreshold(result.value);
      })
      .catch(err => {
        setActivationThreshold(0);
        console.log(err);
      });
    ownerStxAddress &&
      getUserId(props.contracts.deployer, props.contracts.coreContract, ownerStxAddress)
        .then(result => {
          setUserId(result.value.value);
        })
        .catch(err => {
          setUserId(0);
          console.log(err);
        });
  }, [props.contracts.deployer, props.contracts.coreContract, ownerStxAddress]);

  const registerAction = async () => {
    setLoading(true);
    console.log(`register!`);
    setLoading(false);
  };

  // if contract is activated, display happy message
  // else, display activation progress bar

  // if user registered, display success message,
  // else, display register form

  // if activationStatusLoaded, display based on activationStatus
  // if activationStatus true, update header, disable form
  // else update header, enable form ?
  // else loading spinner

  if (activationStatus) {
    return (
      <div className="container-fluid p-6">
        <h3>
          {props.token.symbol} is Activated{' '}
          <a
            className="primary-link"
            target="_blank"
            rel="noreferrer"
            href="https://docs.citycoins.co/citycoins-core-protocol/registration-and-activation"
          >
            <i className="bi bi-question-circle"></i>
          </a>
        </h3>
        <CurrentStacksBlock />
        <p>Activation Status: {activationStatus.toString()}</p>
        <p>
          Activation Threshold:{' '}
          {activationThreshold > 0 ? activationThreshold.toLocaleString() : <LoadingSpinner />}
        </p>
        <p>
          Activation Block Height:{' '}
          {activationBlockHeight > 0 ? activationBlockHeight.toLocaleString() : <LoadingSpinner />}
        </p>
        <p>
          Registered User Count: {userCount > 0 ? userCount.toLocaleString() : <LoadingSpinner />}
        </p>
        <p>User ID: {userId ? userId.toLocaleString() : <LoadingSpinner />}</p>
      </div>
    );
  } else if (!activationStatus) {
    return (
      <div className="container-fluid p-6">
        <h3>
          Activate {props.token.symbol}{' '}
          <a
            className="primary-link"
            target="_blank"
            rel="noreferrer"
            href="https://docs.citycoins.co/citycoins-core-protocol/registration-and-activation"
          >
            <i className="bi bi-question-circle"></i>
          </a>
        </h3>
        <CurrentStacksBlock />
        <p>
          Registered User Count: {userCount > 0 ? userCount.toLocaleString() : <LoadingSpinner />}
        </p>
        <p>
          Activation Threshold:{' '}
          {activationThreshold > 0 ? activationThreshold.toLocaleString() : <LoadingSpinner />}
        </p>
        <p>Activation Status: {activationStatus.toString()}</p>
        <p>
          Activation Block Height:{' '}
          {activationBlockHeight > 0 ? activationBlockHeight.toLocaleString() : <LoadingSpinner />}
        </p>
        <p>User ID: {userId ? userId.toLocaleString() : <LoadingSpinner />}</p>
      </div>
    );
  } else {
    return <LoadingSpinner />;
  }
}

function ActivationStatus() {
  // return either a form or success message
}

function ProgressBar() {
  // return a progress bar for activation
}
