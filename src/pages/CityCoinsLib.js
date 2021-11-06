export default function CityCoinsLib() {
  return (
    <div>
      <h1>CityCoins Library</h1>
      <p>
        Debating if I want to put examples here, or just use JSDoc style formatting and output
        something that way.
      </p>
      <p>
        Probably better to do the latter, but since we're here already, let's commit this and move
        on.
      </p>
      <hr />

      <h2>Core: City Wallet</h2>
      <h3>get-city-wallet</h3>
      <hr />

      <h2>Core: Registration</h2>
      <h3>get-activation-block</h3>
      <h3>get-activation-delay</h3>
      <h3>get-activation-status</h3>
      <h3>get-activation-threshold</h3>
      <h3>get-registered-users-nonce</h3>
      <h3>get-user-id</h3>
      <h3>get-user-id</h3>
      <h3>get-user</h3>
      <hr />

      <h2>Core: Mining</h2>
      <h3>get-mining-stats-at-block</h3>
      <h3>get-mining-stats-at-block-or-default</h3>
      <h3>has-mined-at-block</h3>
      <h3>get-miner-at-block</h3>
      <h3>get-miner-at-block-or-default</h3>
      <h3>get-last-high-value-at-block</h3>
      <h3>get-block-winner-id</h3>
      <h3 className="text-success">mine-tokens</h3>
      <h3 className="text-success">mine-many</h3>
      <hr />

      <h2>Core: Mining Claims</h2>
      <h3 className="text-success">claim-mining-reward</h3>
      <h3>is-block-winner</h3>
      <h3>can-claim-mining-reward</h3>
      <hr />

      <h2>Core: Stacking</h2>
      <h3>get-stacking-stats-at-cycle</h3>
      <h3>get-stacking-stats-at-cycle-or-default</h3>
      <h3>get-stacker-at-cycle</h3>
      <h3>get-stacker-at-cycle-or-default</h3>
      <h3>get-reward-cycle</h3>
      <h3>stacking-active-at-cycle</h3>
      <h3>get-first-stacks-block-in-reward-cycle</h3>
      <h3>get-stacking-reward</h3>
      <h3 className="text-success">stack-tokens</h3>
      <hr />

      <h2>Core: Stacking Claims</h2>
      <h3 className="text-success">claim-stacking-reward</h3>
      <hr />

      <h2>Core: Token Configuration</h2>
      <h3>get-coinbase-thresholds</h3>
      <h3>get-coinbase-amount</h3>
      <hr />

      <h2>Token: SIP-010</h2>
      <h3>get-name</h3>
      <h3>get-symbol</h3>
      <h3>get-decimals</h3>
      <h3>get-balance</h3>
      <h3>get-total-supply</h3>
      <h3>get-token-uri</h3>
      <hr />

      <h2>Token: Send Many</h2>
      <h3 className="text-success">send-many</h3>
    </div>
  );
}
