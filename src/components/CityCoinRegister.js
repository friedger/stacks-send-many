export function CityCoinRegister() {
  const styles = {
    width: '10%',
  };

  return (
    <>
      <h3>Activate CityCoin Mining</h3>
      <p>Before mining can begin, at least 20 miners must register with the contract to signal activation.</p>
      <ul>
        <li>Miners Registered: 2</li>
        <li>Threshold: 20 Miners</li>
      </ul>
      <div className="progress mb-3">
        <div className="progress-bar" role="progressbar" style={styles} aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">10%</div>
      </div>
      <p>Countdown goes here once active</p>
      <button className="btn btn-block btn-primary" type="button">
        Register
      </button>
    </>
  );
}