export default function ClaimStackingRewards(props) {
  return (
    <div className="container-fluid p-6">
      <h3>
        Claim Stacking Rewards{' '}
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/claiming-stacking-rewards"
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </h3>
      <p>Claim rewards for stacking {props.token.symbol}</p>
      <p>
        When a reward cycle is complete, Stackers can claim their portion of the STX committed by
        miners.
      </p>
      <p>
        When the last selected cycle is complete, Stackers can claim their {props.token.symbol} back
        in the same transaction.
      </p>
    </div>
  );
}
