export function CityCoinRegister() {

  return (
    <>
      <h4>Activate CityCoin Mining</h4>
      <p>Before mining can begin, at least 20 miners must register with the contract to signal activation.</p>
      <ul>
        <li>Miners Registered: 2</li>
        <li>Treshold: 20 Miners</li>
        <li>10% complete</li>
      </ul>
      <p>Countdown goes here once active</p>
      <button className="btn btn-block btn-primary" type="button">
        Register
      </button>
    </>
  );
}