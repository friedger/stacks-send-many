export default function ClaimMiningRewards(props) {
  return (
    <div className="container-fluid p-6">
      <h3>
        Claim Blocks{' '}
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/claiming-mining-rewards"
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </h3>
      <p>Claim those sweet {props.token.symbol} block rewards.</p>
    </div>
  );
}
