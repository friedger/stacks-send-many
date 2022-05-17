import { Fragment, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Address } from './Address';
import { NetworkIndicatorIcon } from './NetworkIndicatorIcon';
import { getCCBalance } from '../../lib/citycoins';
import LoadingSpinner from '../common/LoadingSpinner';
import { useConnect } from '../../lib/auth';
import { getStxBalance, isTestnet, TESTNET_FAUCET_URL } from '../../lib/stacks';
import { userBalances, userBnsName, userLoggedIn, userStxAddress } from '../../store/stacks';

export function ProfileFull() {
  const [signedIn] = useAtom(userLoggedIn);
  const [ownerStxAddress] = useAtom(userStxAddress);
  const [ownerBnsName] = useAtom(userBnsName);
  const [ownerBalances, setOwnerBalances] = useAtom(userBalances);
  const { handleSignOut } = useConnect();

  // could use get-full-city-info here
  // then enumerate over city + version with getCCBalance

  useEffect(() => {
    const fetchBalances = async () => {
      const stxBalance = await getStxBalance(ownerStxAddress);
      const miaBalanceV1 = await getCCBalance('v1', 'mia', ownerStxAddress);
      const miaBalanceV2 = await getCCBalance('v2', 'mia', ownerStxAddress);
      const nycBalanceV1 = await getCCBalance('v1', 'nyc', ownerStxAddress);
      const nycBalanceV2 = await getCCBalance('v2', 'nyc', ownerStxAddress);
      const balances = {
        stx: stxBalance,
        mia: {
          v1: miaBalanceV1,
          v2: miaBalanceV2,
        },
        nyc: {
          v1: nycBalanceV1,
          v2: nycBalanceV2,
        },
      };
      setOwnerBalances({
        loaded: true,
        data: balances,
      });
    };
    if (signedIn && ownerStxAddress) {
      fetchBalances().catch(err => {
        console.error(`${err.message} Failed to fetch balances`);
      });
    }
  }, [signedIn, ownerStxAddress, setOwnerBalances]);

  if (signedIn) {
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
            <Address bns={ownerBnsName} addr={ownerStxAddress} />
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
              href={`https://explorer.stacks.co/address/${ownerStxAddress}`}
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
            {ownerBalances.loaded ? (
              Object.keys(ownerBalances.data).map(key => {
                return (
                  <Fragment key={`${key}-container`}>
                    {typeof ownerBalances.data[key] === 'object' ? (
                      Object.keys(ownerBalances.data[key]).map(key2 => {
                        return (
                          <li key={`${key}-${key2}`}>
                            {ownerBalances.data[key][key2]} {key2.toUpperCase()} {key.toUpperCase()}
                          </li>
                        );
                      })
                    ) : (
                      <li>
                        {ownerBalances.data[key].toString()} {key.toUpperCase()}
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
