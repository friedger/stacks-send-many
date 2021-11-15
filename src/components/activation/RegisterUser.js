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
  isInitialized,
} from '../../lib/citycoins';
import { useStxAddresses } from '../../lib/hooks';
import { NETWORK } from '../../lib/stacks';
import {
  currentBlockHeight,
  currentCityActivationStatus,
  currentCityInitialized,
} from '../../store/common';
import CurrentStacksBlock from '../common/CurrentStacksBlock';
import FormResponse from '../common/FormResponse';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RegisterUser(props) {
  const registerMemoRef = useRef();
  const [blockHeight] = useAtom(currentBlockHeight);
  const [userCount, setUserCount] = useState(0);
  const [initialized, setInitialized] = useAtom(currentCityInitialized);
  const [activationThreshold, setActivationThreshold] = useState(0);
  const [activationStatus, setActivationStatus] = useAtom(currentCityActivationStatus);
  const [activationStatusLoaded, setActivationStatusLoaded] = useState(false);
  const [activationBlockHeight, setActivationBlockHeight] = useState(0);
  const [userId, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);
  const { doContractCall } = useConnect();

  const [formMsg, setFormMsg] = useState({
    type: '',
    hidden: true,
    text: '',
    txId: '',
  });

  // TODO: make activation status a global atom, set at container levels and here

  // TODO: registered users does not return a value when 0 users are registered

  // TODO: progress should be limited to two decimal places (same as stacking progress?)

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
  }, [
    props.contracts.deployer,
    props.contracts.coreContract,
    props.contracts.authContract,
    ownerStxAddress,
  ]);

  const registerAction = async () => {
    setLoading(true);
    setFormMsg({
      type: '',
      hidden: true,
      text: '',
      txId: '',
    });
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
      onCancel: () => {
        setLoading(false);
        setFormMsg({
          type: 'warning',
          hidden: false,
          text: 'Transaction was canceled, please try again.',
          txId: '',
        });
      },
      onFinish: result => {
        setLoading(false);
        setFormMsg({
          type: 'success',
          hidden: false,
          text: 'User registration successfully sent',
          txId: result.txId,
        });
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
              (
              {blockHeight > activationBlockHeight
                ? `${(blockHeight - activationBlockHeight).toLocaleString()} blocks ago`
                : `in ${(activationBlockHeight - blockHeight).toLocaleString()} blocks`}
              )
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
                  : `${((userCount / activationThreshold) * 100).toFixed(2)}%`}
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
            {!initialized && <p>Contract is not initialized, registration form disabled.</p>}
            <form>
              <input
                type="text"
                disabled={!initialized || activationStatus || formMsg.txId}
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
                disabled={!initialized || activationStatus || formMsg.txId}
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
            <FormResponse
              type={formMsg.type}
              text={formMsg.text}
              hidden={formMsg.hidden}
              txId={formMsg.txId}
            />
          </>
        )}
      </div>
    );
  } else {
    return (
      <p>
        <LoadingSpinner text="Checking contract activation status" />
      </p>
    );
  }
}
