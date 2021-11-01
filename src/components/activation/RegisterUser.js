import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { userSessionState } from '../../lib/auth';
import {
  getActivationBlock,
  getActivationStatus,
  getActivationThreshold,
  getRegisteredUsersNonce,
} from '../../lib/citycoins';
import NotDeployed from '../common/NotDeloyed';

export default function RegisterUser(props) {
  const minerMemoRef = useRef();
  const [userCount, setUserCount] = useState(0);
  const [minerId, setMinerId] = useState(null);
  const [minerRegistered, setMinerRegistered] = useState(false);
  const [activationThreshold, setActivationThreshold] = useState(1);
  const [activationStatus, setActivationStatus] = useState(false);
  const [activationBlockHeight, setActivationBlockHeight] = useState();
  const [txId, setTxId] = useState();
  const [loading, setLoading] = useState();

  const styles = {
    width: `${(userCount / activationThreshold) * 100}%`,
  };

  useEffect(() => {
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
    getActivationStatus(props.contracts.deployer, props.contracts.coreContract)
      .then(result => {
        setActivationStatus(result.value);
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
  }, [props.contracts.deployer, props.contracts.coreContract]);

  const registerAction = async () => {
    setLoading(true);
    console.log(`register!`);
    setLoading(false);
  };

  // if contract is activated, display happy message
  // else, display activation progress bar

  // if user registered, display success message,
  // else, display register form

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
      <p>Card: countdown or activated!</p>
      <p>Registered User Count: {userCount > 0 ? userCount.toLocaleString() : 'Loading...'}</p>
      <p>
        Activation Threshold:{' '}
        {activationThreshold > 0 ? activationThreshold.toLocaleString() : 'Loading...'}
      </p>
      <p>Activation Status: {activationStatus.toString()}</p>
      <p>
        Activation Block Height:{' '}
        {activationBlockHeight > 0 ? activationBlockHeight.toLocaleString() : 'Loading...'}
      </p>
    </div>
  );
}
