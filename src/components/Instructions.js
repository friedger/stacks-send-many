export function Instructions() {
  return (
    <>
      <h4>Instructions</h4>
      <ol className="list-group small">
        <li>
          Enter recipients and amounts one per line. If all memo field
          are empty "send-many" contract is used. Otherwise, "send-many-memo" is used.
        </li>
        <li>Review the data</li>
        <li>Click send</li>
        <li>Follow the instructions on your wallet to complete the transaction.</li>
      </ol>
    </>
  );
}
