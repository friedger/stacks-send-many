import { Link } from '@reach/router';
import { testnet } from '../../lib/stacks';

export default function NotActivated({ symbol }) {
  return (
    <div className="text-center">
      <h3 className="mb-3">Contract not Activated!</h3>
      <p>The contract is deployed, but requires 20 independent users to activate it.</p>
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
