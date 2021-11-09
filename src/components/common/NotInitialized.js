export default function NotInitialized() {
  return (
    <div className="text-center">
      <h3 className="mb-3">Contract not Initialized!</h3>
      <p>After the contract is initialized, registration will be available.</p>
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
