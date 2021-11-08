import { Link } from '@reach/router';

export default function NotActivated() {
  return (
    <div className="text-center">
      <h3 className="mb-3">Contract not Activated!</h3>
      <p>The contract is deployed, but requires 20 independent users to activate it.</p>
      <p>
        Please see the{' '}
        <Link className="link-primary" to="activation">
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
        <a href="https://discord.gg/citycoins" target="_blank" rel="noreferrer">
          CityCoins Discord
        </a>
        .
      </p>
      <p>Please use the navigation to select a new page.</p>
    </div>
  );
}
