export function CityCoinStacking() {

  return (
    <>
      <h3>Stack CityCoins</h3>
      <p>Stacking CityCoin locks up the set amount in the contract for a number of reward cycles. Once these reward cycles pass, CityCoin owners are eligible to withdraw their CityCoins in addition to STX commited by miners during that reward cycle, proportionate to the amount Stacked within that cycle.</p>
      <div className="input-group mb-3">
        <input type="text" className="form-control" aria-label="Amount in STX" placeholder="Amount in CityCoin" />
        <div className="input-group-append">
          <span className="input-group-text">MIA</span>
        </div>
      </div>
      <div className="input-group mb-3">
        <input type="text" className="form-control" aria-label="Number of Reward Cycles" placeholder="Number of Reward Cycles" />
      </div>
      <button className="btn btn-block btn-primary" type="button">Stack</button>
      <br /><hr /><br />
      <h3>Claim Stacking Rewards</h3>
      <p>Available STX to claim: 250</p>
      <p>Available CityCoins to claim:</p>
      <ul>
        <li>250,000 MIA</li>
      </ul>
      <button className="btn btn-block btn-primary" type="button">Claim Stacking Rewards</button>
    </>
  );
}