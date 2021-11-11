import LinkTx from './LinkTx';

export default function FormResponse(props) {
  // supports all Bootstrap 5 alert types
  // https://getbootstrap.com/docs/5.0/components/alerts/

  // props.type
  // props.hidden
  // props.text
  // props.txId

  return (
    <div className={`mt-3 text-wrap alert alert-${props.type} ${props.hidden && 'd-none'}`}>
      {props.text}
      {props.txId && (
        <>
          <br />
          <LinkTx txId={props.txId} />
        </>
      )}
    </div>
  );
}
