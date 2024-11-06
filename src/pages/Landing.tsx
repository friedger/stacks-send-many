import { useConnect, useWcConnect } from '../lib/auth';
import { SupportedSymbols } from '../lib/constants';

// Landing page demonstrating Blockstack connect for registration

export default function Landing({
  asset,
}: {
  // asset: 'walletConnect' | 'blockstack' | 'not' | 'wmno';
  asset?: SupportedSymbols;
}) {
  const { handleOpenAuth } = useConnect();
  const { handleWcOpenAuth, isWcReady } = useWcConnect();
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container">
          <div className="panel-landing text-center mt-3">
            <p className="lead">
              {asset === 'not' ? (
                <>
                  A UI to interact with
                  <br />
                  NOT-hing
                  <br />
                  and other send-many contracts.
                </>
              ) : (
                <>
                  A UI to interact with the smart contracts
                  <br />
                  "send-many", "send-many-memo", "nope" and "xbtc-send-many-v1".
                </>
              )}
            </p>
            <p className="alert alert-info  border-info">
              Send Many is an{' '}
              <a
                href="https://github.com/friedger/stacks-send-many"
                target="_blank"
                rel="noopener noreferrer"
              >
                open source
              </a>{' '}
              web app with the purpose of{' '}
              <strong>helping everybody to send and view bulk STX/xBTC/NOT transfers.</strong>
            </p>

            <div className="card mt-4 border-info">
              <div className="card-header">
                <h5 className="card-title">Efficient STX/xBTC/NOT transfers</h5>
              </div>
              <div className="card-body">
                <p className="card-text mb-3">
                  Stacks can be transferred to individual users one by one using the stacks transfer
                  function. However, for organisations or exchanges it can be more efficient to send
                  stacks tokens or xBTC tokens to many users in one go. This can be done through a
                  smart contract. There is one contract for transfers with a memo and one for
                  transfers without.
                </p>
                <p className="card-text mb-3">
                  This app provides a web interface for these two contracts. User can make bulk
                  transfers easily, search them, export them and share links to individual amounts.
                </p>
                <p className="cart-text mb-3">
                  For testing purposes, you can use testnet by appending <code>?chain=testnet</code>{' '}
                  in the address bar.
                </p>
              </div>

              <p className="card-link mb-5">
                <button className="btn btn-outline-primary" type="button" onClick={handleOpenAuth}>
                  Start now with Stacks Wallet
                </button>
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  disabled={!isWcReady()}
                  onClick={handleWcOpenAuth}
                >
                  Start now with Wallet Connect
                </button>
              </p>

              <div className="card-footer text-info">
                <strong>With additional features for Nothing</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
