import { useConnect } from '@stacks/connect-react';
import { noneCV, someCV, stringUtf8CV } from '@stacks/transactions';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { userSessionState } from '../../lib/auth';
import {
  getActivationBlock,
  getActivationStatus,
  getActivationThreshold,
  getRegisteredUsersNonce,
  getUserId,
} from '../../lib/citycoins';
import { useStxAddresses } from '../../lib/hooks';
import { NETWORK } from '../../lib/stacks';
import { currentBlockHeight } from '../../store/common';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RegisterUser(props) {
  const registerMemoRef = useRef();
  const [blockHeight] = useAtom(currentBlockHeight);
  const [userCount, setUserCount] = useState(0);
  const [activationThreshold, setActivationThreshold] = useState(0);
  const [activationStatus, setActivationStatus] = useState(false);
  const [activationStatusLoaded, setActivationStatusLoaded] = useState(false);
  const [activationBlockHeight, setActivationBlockHeight] = useState(0);
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [txId, setTxId] = useState('');
  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);
  const { doContractCall } = useConnect();

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
    const memo =
      registerMemoRef.current.value === ''
        ? ''
        : stringUtf8CV(registerMemoRef.current.value.trim());
    const registerMemoCV = memo ? someCV(memo) : noneCV();
    await doContractCall({
      contractAddress: props.contracts.deployer,
      contractName: props.contracts.coreContract,
      functionName: 'register-user',
      functionArgs: [registerMemoCV],
      network: NETWORK,
      onFinish: result => {
        setLoading(false);
        setTxId(result.txId);
      },
      onCancel: () => {
        setLoading(false);
      },
    });
    setLoading(false);
  };

  if (activationStatusLoaded) {
    return (
      <div className="container-fluid p-6">
        <h3>
          {activationStatus
            ? `${props.token.symbol} is Activated `
            : `Activate ${props.token.symbol} `}
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
        {activationStatus && (
          <p>
            Activation Block Height: {activationBlockHeight.toLocaleString()}{' '}
            <span className="fst-italic">
              ({(blockHeight - activationBlockHeight).toLocaleString()} blocks ago)
            </span>
          </p>
        )}
        <div className="row g-4 flex-column flex-md-row align-items-center justify-content-center text-center text-nowrap">
          <div className="col">
            <div className="border rounded">
              <p className="fs-5 pt-3">Threshold</p>
              <p>
                {activationThreshold > 0 ? (
                  `${activationThreshold.toLocaleString()} users`
                ) : (
                  <LoadingSpinner />
                )}
              </p>
            </div>
          </div>
          <div className="col">
            <div className="border rounded">
              <p className="fs-5 pt-3">Registered Users</p>
              <p>{userCount > 0 ? `${userCount.toLocaleString()} users` : <LoadingSpinner />}</p>
            </div>
          </div>
          <div className="col">
            <div className="border rounded">
              <p className="fs-5 pt-3">Progress</p>
              <p>
                {activationThreshold && userCount > activationThreshold
                  ? '100%'
                  : `${(userCount / activationThreshold) * 100}%`}
              </p>
            </div>
          </div>
        </div>
        {userId ? (
          <>
            <h3 className="pt-3">Registration Info</h3>
            <p>You have successfully registered!</p>
            <p>
              Your {props.token.symbol} user ID is {userId}.
            </p>
          </>
        ) : (
          <>
            <h3 className="pt-3">Register for {props.token.symbol}</h3>
            {activationStatus && <p>Contract is activated, registration form disabled.</p>}
            <form>
              <input
                type="text"
                disabled={activationStatus}
                className="form-control mt-3"
                ref={registerMemoRef}
                aria-label="Registration Message"
                placeholder="Registration Message (optional)"
                minLength="1"
                maxLength="50"
              />
              <br />
              <button
                className="btn btn-block btn-primary"
                type="button"
                disabled={txId || activationStatus}
                onClick={registerAction}
              >
                <div
                  role="status"
                  className={`${
                    loading ? '' : 'd-none'
                  } spinner-border spinner-border-sm text-info align-text-top me-2`}
                />
                Register
              </button>
            </form>
          </>
        )}
      </div>
    );
  } else {
    return <LoadingSpinner />;
  }
}
