export default function RegisterTools(props) {
  return (
    <div className="container-fluid p-6">
      <h3>Registration / Activation Tools</h3>
      <p>
        Get fancy with the {props.token.symbol} contract functions.{' '}
        <span className="fst-italic">This section is coming soon.</span>
      </p>

      <p>
        If there's a tool you'd like to see, please share it in our{' '}
        <a
          className="link-primary"
          href="https://discord.gg/citycoins"
          target="_blank"
          rel="noreferrer"
        >
          community Discord
        </a>
        .
      </p>
    </div>
  );
}
