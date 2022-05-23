import LinkTx from './LinkTx';

export default function FormResponse({ type, hidden, text, txId }) {
  // type: keyword for bootstrap 5 alerts
  // https://getbootstrap.com/docs/5.0/components/alerts/

  return (
    <div className={`text-wrap alert alert-${type} ${hidden ? 'd-none' : ''}`}>
      {text} {txId && <LinkTx txId={txId} />}
    </div>
  );
}
