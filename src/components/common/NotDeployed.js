export default function NotDeployed() {
  return (
    <div className="text-center">
      <h3 className="mb-3">Contract not Deployed!</h3>
      <p>Sorry, we couldn't find a deployer address for this city's contracts.</p>
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
      <p>Please use the navigation to select a new page.</p>
    </div>
  );
}
