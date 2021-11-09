import React, { useState, useEffect } from 'react';
import { fetchAccount } from '../../lib/account';
import { Address } from '../Address';
import { useAtom } from 'jotai';
import { currentCity, stxBalanceAtom } from '../../store/common';
import SelectCity from '../common/SelectCity';
import { userSessionState } from '../../lib/auth';
import { useStxAddresses } from '../../lib/hooks';
import { ustxToStx } from '../../lib/stacks';
import LoadingSpinner from '../common/LoadingSpinner';
import { testnet } from '../../lib/stacks';

export function ProfileFull(props) {
  const [userSession] = useAtom(userSessionState);
  const { ownerStxAddress } = useStxAddresses(userSession);
  const [profileState, setProfileState] = useState({
    account: undefined,
  });
  // const cities = Object.entries(currentCityList);
  const [city] = useAtom(currentCity);
  const [stxBalance, setStxBalance] = useAtom(stxBalanceAtom);
  // const [cityBalances, setCityBalances] = useAtom(cityBalancesAtom);
  // const [cityRates, setCityRates] = useAtom(cityRatesAtom);

  useEffect(() => {
    if (ownerStxAddress) {
      fetchAccount(ownerStxAddress).then(acc => {
        setProfileState({ account: acc });
      });
    }
  }, [ownerStxAddress]);

  useEffect(() => {
    // update STX balance and rate
    if (JSON.stringify(profileState) !== '{}') {
      setStxBalance(profileState.account.balance);
    }
  }, [profileState, setStxBalance]);

  /*
  useEffect(() => {
    const updateCityBalances = async (balance, symbol) => {
      setCityBalances(prev => ({ ...prev, [symbol]: balance }));
    };

    if (ownerStxAddress) {
      cities.map((value, idx) => {
        // console.log(`value: ${JSON.stringify(value)}`);
        // console.log(`idx: ${idx}`);
        // update citycoins balances
        // how to know contract addresses?
      });
    }
  });
  */

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id="offcanvasProfile"
      aria-labelledby="offcanvasProfileLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="offcanvasProfileLabel">
          <i className="bi bi-person-circle me-2" />
          {ownerStxAddress ? <Address addr={ownerStxAddress} /> : 'Profile'}{' '}
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body text-start">
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
          >
            Actions
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a
                className="dropdown-item"
                href={'http://miamining.com/history/' + ownerStxAddress}
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-box-arrow-up-right"></i> View on MIA Block Explorer
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href={'https://explorer.stacks.co/address/' + ownerStxAddress}
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-box-arrow-up-right"></i> View Address on Explorer
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Bug&template=bug_report.md&title=%F0%9F%90%9E%5BBUG%5D+"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-bug"></i> Report a Bug
              </a>
            </li>
            <li>
              <a
                className="dropdown-item"
                href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Enhancement&template=feature_request.md&title=%E2%9A%A1%5BFEAT%5D+"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bi bi-lightning"></i> Request a Feature
              </a>
            </li>
            <li>
              <button
                className="dropdown-item"
                href="#"
                onClick={() => {
                  userSession.signUserOut('/');
                }}
              >
                <i className="bi bi-x-circle"></i> Sign Out
              </button>
            </li>
          </ul>
          <hr />
          {profileState.account && (
            <>
              <h5 className="mb-3">Account Balance</h5>
              <ul>
                <li>
                  {stxBalance ? (
                    `${ustxToStx(stxBalance).toLocaleString(undefined, {
                      style: 'decimal',
                      minimumFractionDigits: 6,
                      maximumFractionDigits: 6,
                    })} Ӿ`
                  ) : (
                    <LoadingSpinner />
                  )}
                </li>
              </ul>
              <p>Selected City: {city ? city : 'None'}</p>
              <p>Network: {testnet ? 'Testnet' : 'Mainnet'}</p>
              <SelectCity />
            </>
          )}
        </div>
      </div>{' '}
    </div>
  );
}
