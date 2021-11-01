export default function StackCityCoins(props) {
  return (
    <div className="container-fluid p-6">
      <h3>
        Stack {props.token.symbol}{' '}
        <a
          className="primary-link"
          target="_blank"
          rel="noreferrer"
          href="https://docs.citycoins.co/citycoins-core-protocol/stacking-citycoins"
        >
          <i className="bi bi-question-circle"></i>
        </a>
      </h3>
      <p>Stack some {props.token.symbol}!</p>
    </div>
  );
}
