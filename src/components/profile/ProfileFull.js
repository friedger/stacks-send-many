import { Fragment } from 'react';
import { useAtom } from 'jotai';
import { Address } from './Address';
import { NetworkIndicatorIcon } from './NetworkIndicatorIcon';
import LoadingSpinner from '../common/LoadingSpinner';
import { useConnect } from '../../lib/auth';
import { isTestnet, TESTNET_FAUCET_URL } from '../../lib/stacks';
import {
  loginStatusAtom,
  stxAddressAtom,
  stxBnsNameAtom,
  userBalancesAtom,
} from '../../store/stacks';

export function ProfileFull() {
  const [loginStatus] = useAtom(loginStatusAtom);
  const [stxAddress] = useAtom(stxAddressAtom);
  const [bnsName] = useAtom(stxBnsNameAtom);
  const [balances] = useAtom(userBalancesAtom);
  const { handleSignOut } = useConnect();

  if (loginStatus) {
    return (
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasProfile"
        aria-labelledby="offcanvasProfileLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasProfileLabel">
            <NetworkIndicatorIcon />
            <Address bns={bnsName} addr={stxAddress} />
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body text-start">
          <div className="btn-group" role="group" aria-label="Account control buttons">
            <a
              href={`https://explorer.stacks.co/address/${stxAddress}`}
              rel="noreferrer"
              target="_blank"
              class="btn btn-outline-primary"
              title="View Address on Explorer"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </a>
            {isTestnet && (
              <a
                rel="noreferrer"
                href={TESTNET_FAUCET_URL}
                target="_blank"
                class="btn btn-outline-primary"
                title="STX Testnet Faucet"
              >
                <i className="bi bi-box-arrow-up-right" />
              </a>
            )}
            <a
              href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Bug&template=bug_report.md&title=%F0%9F%90%9E%5BBUG%5D+"
              rel="noreferrer"
              target="_blank"
              class="btn btn-outline-primary"
              title="Report a Bug"
            >
              <i className="bi bi-bug"></i>
            </a>
            <a
              href="https://github.com/citycoins/citycoin-ui/issues/new?assignees=&labels=Enhancement&template=feature_request.md&title=%E2%9A%A1%5BFEAT%5D+"
              rel="noreferrer"
              target="_blank"
              class="btn btn-outline-primary"
              title="Request a Feature"
            >
              <i className="bi bi-lightning"></i>
            </a>
            <button
              className="btn btn-outline-primary"
              href="#"
              title="Sign Out"
              onClick={handleSignOut}
            >
              <i className="bi bi-x-circle"></i>
            </button>
          </div>

          <hr className="cc-divider" />
          <p>Balances</p>
          <ul>
            {balances.loaded ? (
              Object.keys(balances.data).map(key => {
                return (
                  <Fragment key={`${key}-container`}>
                    {typeof balances.data[key] === 'object' ? (
                      Object.keys(balances.data[key]).map(key2 => {
                        return (
                          <li key={`${key}-${key2}`}>
                            {balances.data[key][key2]} {key2.toUpperCase()} {key.toUpperCase()}
                          </li>
                        );
                      })
                    ) : (
                      <li>
                        {balances.data[key].toString()} {key.toUpperCase()}
                      </li>
                    )}
                  </Fragment>
                );
              })
            ) : (
              <LoadingSpinner text="Loading balances..." />
            )}
          </ul>
        </div>
      </div>
    );
  }
  return null;
}
