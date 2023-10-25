export function InstructionsFulfillmentSBtc() {
  return (
    <>
      <h4>Instructions sBTC Fulfillment</h4>
      <ol className="list-group small">
        <li>Deposit BTC to the sbtc wallet providing the send many contract as recipient.</li>
        <li>Call fulfillment contract function on STX</li>
      </ol>
      When you have received sBTC, you can withdraw at any time to your own Bitcoin address.
    </>
  );
}
