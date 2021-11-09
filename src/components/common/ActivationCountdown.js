import { Link } from '@reach/router';
import { testnet } from '../../lib/stacks';

export default function ActivationCountdown({ symbol, blocks }) {
  return (
    <div className="text-center">
      <h3 className="mb-3">Contract Activation in Progress</h3>
      <p>The contract is deployed and activated!</p>
      <div className="row align-items-center justify-content-center">
        <div className="col-auto">
          <div className="border rounded p-3 text-nowrap">
            <span className="fs-4">Mining will begin in {blocks} blocks.</span>
          </div>
        </div>
      </div>
      <hr />
      <p>
        Please see the{' '}
        <Link
          className="link-primary"
          to={`/${symbol.toLowerCase()}/activation${testnet ? '?chain=testnet' : '?chain=mainnet'}`}
        >
          activation page
        </Link>{' '}
        or{' '}
        <a
          className="link-primary"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/registration-and-activation"
        >
          the documentation
        </a>{' '}
        for more information.
      </p>
      <p>
        If this is a mistake, please share more information in the{' '}
        <a
          className="link-primary"
          href="https://discord.gg/citycoins"
          target="_blank"
          rel="noreferrer"
        >
          CityCoins Discord
        </a>
        .
      </p>
      <p>Or, please use the navigation to select a new page.</p>
    </div>
  );
}
