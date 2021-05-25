export function CityCoinMining() {

  return (
    <>
      <h4>Mine CityCoins</h4>
      <p>Mining CityCoins is done by spending STX in a given Stacks block. A winner is selected by a VRF weighted by the miners' proportion of contributions that block. Rewards can be withdrawn after 100 block maturity window.</p>
      <div class="input-group mb-3">
        <input type="text" class="form-control" aria-label="Amount in STX" placeholder="Amount in STX" />
        <div class="input-group-append">
          <span class="input-group-text">STX</span>
        </div>
      </div>
      <div class="input-group mb-3">
        <input type="text" class="form-control" aria-label="Number of Blocks" placeholder="Number of Blocks" />
      </div>
      <button className="btn btn-block btn-primary" type="button">Mine</button>
      <hr />
      <h4>Claim Mining Rewards</h4>
      <p>Available CityCoins:</p>
      <ul>
        <li>250,000 MIA</li>
      </ul>
      <button className="btn btn-block btn-primary" type="button">Claim Mining Rewards</button>
    </>
  );
}