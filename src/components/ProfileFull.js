import React, { useState, useEffect } from 'react';
import { fetchAccount } from '../lib/account';
import { Address } from './Address';
import { Amount } from './Amount';
import { Jdenticon } from 'react-jdenticon';

export function ProfileFull({ stxAddress, updateStatus, showAddress }) {
  const [profileState, setProfileState] = useState({
    account: undefined,
  });

  useEffect(() => {
    fetchAccount(stxAddress).then(acc => {
      setProfileState({ account: acc });
    });
  }, [stxAddress]);

  return (
    <div
      class="offcanvas offcanvas-end"
      tabindex="-1"
      id="offcanvasProfile"
      aria-labelledby="offcanvasProfileLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasProfileLabel">
          <a className="navbar-brand" href="/">
            {stxAddress || typeof stxAddress != 'undefined' ? (
              <svg
                className="rounded-circle bg-white"
                width="50"
                height="50"
                data-jdenticon-value={stxAddress}
              />
            ) : (
              <img src="/stacks.png" width="50" height="50" alt="Logo" />
            )}
          </a>
          {stxAddress ? <Address addr={stxAddress} /> : 'Profile'}{' '}
        </h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <div class="dropdown mt-3">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
          >
            Actions
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <a
                class="dropdown-item"
                href={'https://explorer.stacks.co/address/' + stxAddress}
                target="_blank"
                rel="noopener"
              >
                View on Explorer ↗
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#">
                Sign Out
              </a>
            </li>
          </ul>
          <hr />
          {profileState.account && (
            <>
              <h5>Account Balances</h5>
              <hr />
              <Amount ustx={profileState.account.balance} stxAddress={stxAddress} />
            </>
          )}
        </div>
      </div>{' '}
    </div>
  );
}
